import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import calculatorRoutes from "./src/routes/calculatorRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors(
    {
        origin: [""],
        methods: ["GET", "POST"], 
        credentials: true
    }
));
app.use(express.json());

app.use("/api", calculatorRoutes);

export default app;
