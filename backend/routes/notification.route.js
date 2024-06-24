import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { deleteNotificationById, deleteNotifications, getNotifications } from "../controllers/notification.controller.js";


const router = Router()

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotifications)
router.delete("/:id", protectRoute, deleteNotificationById)

export default router