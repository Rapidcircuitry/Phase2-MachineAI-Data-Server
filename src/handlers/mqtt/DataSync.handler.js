import { DeviceDataService } from "@/services/DeivceData.service.js";
import dayjs from "dayjs";
import { TopicHandler } from "./base.handler.js";

const devicePayloadBuffer = {};

export const mockDataFormat = {
  0: "Power Factor",
  1: "R Phase Voltage",
  2: "Y Phase Voltage",
  3: "B Phase Voltage",
  4: "R Phase Current",
  5: "Y Phase Current",
  6: "B Phase Current",
  7: "Voltage",
  8: "Current",
  9: "Weight in Kgs",
  10: "Gas flow",
};

export class DataSyncHandler {
  static CHUNKS_PER_DEVICE = 10;

  /**
   * Handle incoming MQTT chunk and produce daily summary once all chunks arrive
   */
  static async handleSyncData(topic, message) {
    const deviceId = TopicHandler.parseMacId(topic, 3);
    console.log(deviceId);

    // return;

    // Initialize buffer if first chunk
    if (!devicePayloadBuffer[deviceId]) {
      devicePayloadBuffer[deviceId] = [];
    }

    // Store the new chunk
    devicePayloadBuffer[deviceId].push(message);

    console.log(
      `Device ${deviceId} chunk received (${devicePayloadBuffer[deviceId].length}/${DataSyncHandler.CHUNKS_PER_DEVICE})`
    );

    // Wait until all chunks arrive
    if (
      devicePayloadBuffer[deviceId].length < DataSyncHandler.CHUNKS_PER_DEVICE
    ) {
      return; // do nothing until all 10 chunks are received
    }

    // All chunks received → parse & compute summary
    const allChunks = devicePayloadBuffer[deviceId].map((msg) =>
      JSON.parse(msg)
    );
    // Compute summary
    const dailySummary = DataSyncHandler.computeDailySummary(
      deviceId,
      allChunks
    );

    // Process each chunk
    for (const chunk of allChunks) {
      console.log(chunk);

      const processedRecords = DataSyncHandler.parseRawPayload(chunk, deviceId);
      await DeviceDataService.storeDeviceDataV2({
        deviceId,
        rawData: chunk,
        processedData: processedRecords,
        typeId: null, // optional: set device type if needed
      });
    }

    console.log(`Daily summary for device ${deviceId}:`, dailySummary);

    // Store daily summary in DB
    await DeviceDataService.storeDeviceDailySummary(dailySummary);

    // Clear buffer
    devicePayloadBuffer[deviceId] = [];

    return dailySummary;
  }

  /**
   * Parse single MQTT payload into flat DB-ready records
   */
  static parseRawPayload(payload, deviceId) {
    const { D, T, M } = payload;
    console.log(D?.length);

    if (!D || !M) return [];

    const baseTime = dayjs(M, "YYYYMMDDHHmm");

    const records = [];

    D.forEach((sensorArray, sensorIndex) => {
      sensorArray.forEach((value, idx) => {
        if (value === 0) return; // skip empty values

        const counter = T[idx] || 0;
        if (counter === 0) return;

        const timestamp = baseTime
          .add((counter - 1) * 5, "minute")
          .toISOString();

        // if sensorIndex is 9 then value is in grams
        if (sensorIndex === 9) {
          value = value / 1000;
        }

        records.push({
          deviceId,
          sensorName: mockDataFormat[sensorIndex],
          timestamp,
          counter,
          value,
        });
      });
    });

    return records;
  }

  /**
   * Compute daily summary for all chunks of a device
   */
  static computeDailySummary(deviceId, chunks) {
    let totalKWH = 0;
    let totalKVAH = 0;
    let totalWH = 0;
    let whCount = 0;
    let maxLoad = Number.NEGATIVE_INFINITY;
    let minLoad = Number.POSITIVE_INFINITY;
    let totalGas = 0;

    const intervalHours = 5 / 60; // 5-minute intervals

    chunks.forEach(({ D, T }) => {
      if (!D || !T) return;

      D[0].forEach((_, idx) => {
        const counter = T[idx] || 0;
        if (counter === 0) return;

        const PF = D[0][idx] || 0;
        const VR = D[1][idx] || 0;
        const VY = D[2][idx] || 0;
        const VB = D[3][idx] || 0;
        const IR = D[4][idx] || 0;
        const IY = D[5][idx] || 0;
        const IB = D[6][idx] || 0;
        const VDC = D[7][idx] || 0;
        const IDC = D[8][idx] || 0;
        const rawLoad = D[9][idx] || 0;
        const gas = D[10][idx] || 0;

        const load = rawLoad / 1000;
        maxLoad = Math.max(maxLoad, load);
        minLoad = Math.min(minLoad, load);

        // ✅ Calculate phase-wise apparent and real power (W)
        const apparentPowerW = VR * IR + VY * IY + VB * IB; // W
        const realPowerW = apparentPowerW * PF; // W

        // ✅ Convert to kW and kVA
        const realPowerKW = realPowerW / 1000;
        const apparentPowerKVA = apparentPowerW / 1000;

        // ✅ Integrate energy over interval (kWh, kVAh)
        totalKWH += realPowerKW * intervalHours;
        totalKVAH += apparentPowerKVA * intervalHours;

        // ✅ DC energy in Wh → kWh
        totalWH += (VDC * IDC) / 1000;
        whCount += 1;

        // ✅ Gas integration
        totalGas += gas;
      });
    });

    const avgTWH = whCount > 0 ? totalWH / whCount : 0;
    const loadConsumption = maxLoad - minLoad;

    return {
      deviceId,
      totalKWH: parseFloat(totalKWH.toFixed(4)),
      totalKVA: parseFloat(totalKVAH.toFixed(4)),
      avgTWH: parseFloat(avgTWH.toFixed(4)),
      // if remained maxLoad is -Infinity then set it to 0
      maxLoad: maxLoad === Number.NEGATIVE_INFINITY ? 0 : parseFloat(maxLoad.toFixed(3)),
      minLoad: minLoad === Number.POSITIVE_INFINITY ? 0 : parseFloat(minLoad.toFixed(3)),
      // if remained loadConsumption is -Infinity then set it to 0
      loadConsumption: loadConsumption === Number.NEGATIVE_INFINITY ? 0 : parseFloat(loadConsumption.toFixed(3)),
      totalGas: parseFloat(totalGas.toFixed(3)),
      summaryDate: new Date().toISOString(),
    };
  }
}
