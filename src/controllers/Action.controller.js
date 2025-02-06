import { DeviceDataDecoder } from "../handlers/data/DataDecoder.handler.js";

export class ActionController {
  static async reloadTemplates(req, res) {
    await DeviceDataDecoder.initialize();
    return res.status(200).json({
      success: true,
      message: "Templates reloaded",
    });
  }
}
