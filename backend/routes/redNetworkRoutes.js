// backend/routes/redNetworkRoutes.js
import express from "express";
import { joinRedNetwork } from "../controllers/redNetworkController.js";

const router = express.Router();

router.options("/join", (req, res) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.FRONTEND_URL || "http://localhost:3000"
  );
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(204);
});

router.post("/join", joinRedNetwork);

export default router;