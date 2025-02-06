import { Router } from "express";
import { ActionController } from "../controllers/Action.controller.js";

const router = Router();

router.post("/reload-templates", ActionController.reloadTemplates);

export default router;
