import { DeviceDataDecoder } from "../handlers/data/DataDecoder.handler.js";

export class ActionController {
  static async reloadTemplates(req, res) {
    try {
      await DeviceDataDecoder.initialize();
      return res.status(200).json({
        success: true,
        message: "Templates reloaded",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to reload templates",
        error: error.message,
      });
    }
  }
}
