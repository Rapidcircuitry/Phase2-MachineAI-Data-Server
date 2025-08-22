import { prisma } from "../../../app.js";
import { customLogger } from "../../middlewares/logging.middleware.js";
import { mockDataFormat } from "../../utils/constants.js";

export class TemplateService {
  // static async loadAllTemplates() {
  //   try {
  //     const templates = await prisma.deviceTemplateInfo.findMany({
  //       select: {
  //         device_template_id: true,
  //         device_template_config: true,
  //       },
  //       where: {
  //         is_active: true,
  //       },
  //     });
  //     return templates;
  //   } catch (error) {
  //     customLogger.error(error);
  //     throw new Error("Failed to load templates");
  //   }
  // }

  static async loadAllTemplates() {
    return mockDataFormat;
  }

  static async getTemplateById(templateId) {
    try {
      const template = await prisma.deviceTemplateInfo.findUnique({
        where: { device_template_id: templateId },
      });
      return template;
    } catch (error) {
      customLogger.error(
        `Failed to fetch template for id: ${templateId}: ${error.message}`
      );
      throw new Error(`Failed to fetch template for id: ${templateId}`);
    }
  }
}
