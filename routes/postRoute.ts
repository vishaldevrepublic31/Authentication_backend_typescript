import express from "express";
import isLoggedin from "../middlewares/authMiddleware";
import {
    createPost,
    deletePost,
    getAllPost,
    getUserPosts,
    myPosts,
    updatePost,
} from "../controllers/postController";

const router = express.Router();

router.get("/get-all-post", getAllPost);
router.get("/my-posts", isLoggedin, myPosts);
router.get("/user-posts/:id", getUserPosts);
router.post("/create-post", isLoggedin, createPost);
router.patch("/update-post/:id", isLoggedin, updatePost);
router.delete("/delete-post/:id", isLoggedin, deletePost);

export default router;
