import dayjs from "dayjs";

export const mockDataFormat = {
  0: "R Phase Voltage",
  1: "Y Phase Voltage",
  2: "B Phase Voltage",
  3: "R Phase Current",
  4: "Y Phase Current",
  5: "B Phase Current",
  6: "Voltage",
  7: "Current",
  8: "Weight in Kgs",
  9: "Gas flow",
};

const deviceDataMap = new Map();

export class DataSyncHandler {
  /**
   * Main MQTT handler
   */
  static handleSyncData(receivedTopic, message) {
    let payload;
    try {
      payload = JSON.parse(message);
      const parsedPayload = DataSyncHandler.parsePayload(
        payload,
        receivedTopic
      );
      console.log("Parsed payload:", parsedPayload);
    } catch (err) {
      console.error("Invalid JSON payload:", err);
      return [];
    }
  }

  // ----------------------------------------------------
  // Version 1
  // ----------------------------------------------------

  /**
   * Parse single MQTT payload into flat DB-ready records
   */
  // static parsePayload(payload, deviceId) {
  //   const { D, T, M } = payload;
  //   console.log(D?.length);

  //   if (!D || !M) return [];

  //   const baseTime = dayjs(M, "YYYYMMDDHHmm");

  //   const records = [];

  //   D.forEach((sensorArray, sensorIndex) => {
  //     sensorArray.forEach((value, idx) => {
  //       if (value === 0) return; // skip empty values

  //       const counter = T[idx] || 0;
  //       if (counter === 0) return;

  //       const timestamp = baseTime
  //         .add((counter - 1) * 5, "minute")
  //         .toISOString();

  //       records.push({
  //         deviceId,
  //         sensorName: mockDataFormat[sensorIndex],
  //         timestamp,
  //         counter,
  //         value,
  //       });
  //     });
  //   });

  //   return records;
  // }

  // ----------------------------------------------------
  // Version 2
  // ----------------------------------------------------
  static parsePayload(payload, deviceId) {
    const { D, T, M } = payload;
    if (!D || !M) return [];

    const baseTime = dayjs(M, "YYYYMMDDHHmm");
    const records = [];

    D[0].forEach((_, idx) => {
      const counter = T[idx] || 0;
      if (counter === 0) return;

      const timestamp = baseTime.add((counter - 1) * 5, "minute").toISOString();

      // --- Extract values ---
      const PFR = D[0][idx] || 0;
      const PFY = D[0][idx] || 0;
      const PFB = D[0][idx] || 0;

      const VR = D[1][idx] || 0;
      const VY = D[2][idx] || 0;
      const VB = D[3][idx] || 0;

      const IR = D[4][idx] || 0;
      const IY = D[5][idx] || 0;
      const IB = D[6][idx] || 0;

      const VDC = D[7][idx] || 0;
      const IDC = D[8][idx] || 0;

      const weight = D[9][idx] || 0;
      const gas = D[10][idx] || 0;

      // --- Derived ---
      const kwh = VR * IR * PFR + VY * IY * PFY + VB * IB * PFB;
      const kva = VR * IR + VY * IY + VB * IB;
      const wh = VDC * IDC;

      // --- Push records ---
      records.push(
        { deviceId, sensorName: "Power Factor", timestamp, value: PFR },
        { deviceId, sensorName: "R Phase Voltage", timestamp, value: VR },
        { deviceId, sensorName: "R Phase Current", timestamp, value: IR },
        { deviceId, sensorName: "DC Voltage", timestamp, value: VDC },
        { deviceId, sensorName: "DC Current", timestamp, value: IDC },
        { deviceId, sensorName: "Weight in Kgs", timestamp, value: weight },
        { deviceId, sensorName: "Gas Flow", timestamp, value: gas },
        { deviceId, sensorName: "KWH", timestamp, value: kwh },
        { deviceId, sensorName: "KVA", timestamp, value: kva },
        { deviceId, sensorName: "WH", timestamp, value: wh }
      );
    });

    return records;
  }
}
