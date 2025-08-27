import { ALERT_MAP, SENSOR_MAP } from "../../utils/constants.js";
import { TopicHandler } from "./base.handler.js";
import axios from "axios";
import { config } from "../../config/index.js";
import { customLogger } from "../../middlewares/logging.middleware.js";
import { handlePostRequest } from "../../utils/helpers/api.utils.js";

export class AlertsHandler extends TopicHandler {
  static async handleAlerts(topic, message) {
    const macId = TopicHandler.parseMacId(topic, 3);

    try {
      const parsedMsg = JSON.parse(message.toString());
      const [sensorKey] = Object.keys(parsedMsg); // either G or W
      const sensorName = SENSOR_MAP[sensorKey] || sensorKey;

      const [valueReceived, thresholdType] = parsedMsg[sensorKey]; // destructure array

      const alertType =
        ALERT_MAP[thresholdType] || `Unknown (${thresholdType})`;

      console.log(`\n🔔 Received Alert from Device [${macId}]`);
      console.log(`   • Sensor: ${sensorName}`);
      console.log(`   • Value Received: ${valueReceived}`);
      console.log(`   • Threshold Crossed: ${alertType}`);
      console.log("---------------------------------------------------\n");

      // Send alert notification to client server for email processing
      try {
        const clientServerUrl = config.CLIENT_SERVER_URL;
        const alertPayload = {
          macId,
          sensorName,
          valueReceived,
          thresholdType,
          alertType,
        };

        const response = await handlePostRequest(
          `${clientServerUrl}/api/v1/alert/trigger`,
          alertPayload
        );

        if (response.data.success) {
          customLogger.info(
            `Alert notification queued successfully for device ${macId}, Job ID: ${response.data.data?.jobId}`
          );
        } else {
          customLogger.warn(
            `Alert notification failed for device ${macId}: ${response.data.message}`
          );
        }
      } catch (apiError) {
        // Log error but don't crash the MQTT handler
        customLogger.error(
          `Failed to send alert notification to client server: ${apiError.message}`
        );

        // You might want to implement a fallback mechanism here
        // such as storing failed alerts in a local queue for retry
      }
    } catch (error) {
      console.error(`Error in handleAlerts: ${error.message}`);
    }
  }
}
