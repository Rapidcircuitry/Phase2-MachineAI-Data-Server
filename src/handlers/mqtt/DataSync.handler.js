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
    let totalKVA = 0;
    let totalWH = 0;
    let whCount = 0;
    let maxLoad = Number.NEGATIVE_INFINITY;
    let minLoad = Number.POSITIVE_INFINITY;
    let totalGas = 0;

    chunks.forEach((payload) => {
      const { D, T } = payload;
      if (!D || !T) return;

      D[0].forEach((_, idx) => {
        const counter = T[idx] || 0;
        if (counter === 0) return;

        // AC Power Factors
        const PFR = D[0][idx] || 0;
        const PFY = D[0][idx] || 0;
        const PFB = D[0][idx] || 0;

        // AC Voltages
        const VR = D[1][idx] || 0;
        const VY = D[2][idx] || 0;
        const VB = D[3][idx] || 0;

        // AC Currents
        const IR = D[4][idx] || 0;
        const IY = D[5][idx] || 0;
        const IB = D[6][idx] || 0;

        // DC
        const VDC = D[7][idx] || 0;
        const IDC = D[8][idx] || 0;

        // Load cell
        const load = D[9][idx] || 0;
        if (load > maxLoad) maxLoad = load;
        if (load < minLoad) minLoad = load;

        // Gas
        const gas = D[10][idx] || 0;
        totalGas += gas;

        // Derived
        totalKWH += VR * IR * PFR + VY * IY * PFY + VB * IB * PFB;
        totalKVA += VR * IR + VY * IY + VB * IB;

        const wh = VDC * IDC;
        totalWH += wh;
        whCount += 1;
      });
    });

    const avgTWH = whCount > 0 ? totalWH / whCount : 0;
    const loadConsumption = maxLoad - minLoad;

    return {
      deviceId,
      totalKWH,
      totalKVA,
      avgTWH,
      maxLoad,
      minLoad,
      loadConsumption,
      totalGas,
      summaryDate: new Date().toISOString(),
    };
  }
}
