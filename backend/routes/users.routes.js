import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { followUnFollowUser, getUserProfile, suggestUserForMe, updateUser } from "../controllers/users.controller.js";

const router = Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggest", protectRoute, suggestUserForMe);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.post("/update", protectRoute, updateUser)



export default router;