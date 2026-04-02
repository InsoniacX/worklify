import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

/* Middleware */
import { protect, adminOnly } from "./middleware/authMiddleware.js";

/* Route */
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import authRouter from "./routes/authRoute.js";
import taskRouter from "./routes/taskRoute.js";
import teamRouter from "./routes/teamRoute.js";
import scheduleRouter from "./routes/scheduleRoute.js";
import notificationRouter from "./routes/notificationRoute.js";
import activityRouter from "./routes/activityRoute.js";

/* Model */
import "./model/userModel.js";
import "./model/taskModel.js";
import "./model/teamModel.js";
import "./model/activityModel.js";
import "./model/notificationModel.js";
import "./model/scheduleModel.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN
}))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

/**
 * Public API
*/
app.use("/api/auth", authRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/user", protect, adminOnly, userRouter);
app.use("/api/product", protect, adminOnly, productRouter);

app.use("/api/task", protect, taskRouter);
app.use("/api/team", protect, teamRouter);
app.use("/api/schedule", protect, scheduleRouter);
app.use("/api/notification", protect, notificationRouter);
app.use("/api/activity", protect, activityRouter);


const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGO_URL;

if (!MONGOURL) {
  throw new Error("MONGO_URL is not defined in .env");
}

mongoose.connect(MONGOURL).then(() => {
    console.log("Connection With DB returned Status 200 OK")
    app.listen(PORT, () => {
        console.log(`Server is Running on port: ${PORT}`)
    });
}).catch((error) => console.log(error))
 