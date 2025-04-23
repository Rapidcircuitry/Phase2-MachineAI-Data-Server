import { Router } from "express";
import { ActionController } from "../controllers/Action.controller.js";

const router = Router();

router.post("/reload-templates", ActionController.reloadTemplates);

/**
 * Get the current online devices
 * @route GET /action/get-online-devices
 * @returns {Object} The current online devices
 */
router.get("/get-online-devices", ActionController.getOnlineDevices);

export default router;
