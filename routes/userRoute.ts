import express from "express";
import {
    forgetPassword,
    getUsers,
    login,
    profile,
    register,
    updateProfile,
} from "../controllers/userController";
import isLoggedin from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.get("/users", getUsers);
router.post("/login", login);
router.get("/me", isLoggedin, profile);
router.post("/forget-password", forgetPassword);
router.put("/update-profile", isLoggedin, updateProfile);

export default router;
