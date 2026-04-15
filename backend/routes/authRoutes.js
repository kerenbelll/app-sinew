import express from "express";
import auth from "../middleware/auth.js";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";

const router = express.Router();

/*
  Se montan en /api
  POST   /api/users/register
  POST   /api/users/login
  GET    /api/users/profile
  PATCH  /api/users/profile
  PATCH  /api/users/password
*/

router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.get("/users/profile", auth, getProfile);
router.patch("/users/profile", auth, updateProfile);
router.patch("/users/password", auth, changePassword);

export default router;