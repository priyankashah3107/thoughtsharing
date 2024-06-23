import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { commentOnPost, createPost, deletePost, likeOrUnLikePost } from "../controllers/post.controller.js";

const router  = Router()

// how many routes do we need to create a post 
// a) create a post b) delete Post c) Like Post d) comment post e) bookmark the post f) share the post(whatapp or any socialmedia)

router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeOrUnLikePost);
// router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost)

export default router;