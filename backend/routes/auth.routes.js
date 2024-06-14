import { Router } from "express";
import {signup, login, logout, authCheck} from "../controllers/auth.controllers.js"
import { protectRoute } from "../middleware/protectRoute.js";
const router = Router()

router.get("/me", protectRoute,authCheck)
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)


export default router;