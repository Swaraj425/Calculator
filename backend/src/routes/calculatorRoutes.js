

import express from "express";
import { calculateExpression } from "../controllers/calculatorController.js";

const router = express.Router();

router.post("/calculate", calculateExpression);

export default router;
