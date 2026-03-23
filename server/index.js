import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import authRouter from "./routes/authRoute.js";
import { fileURLToPath } from "url";
import cors from "cors";
import { protect } from "./middleware/authMiddleware.js";
import path from "path";

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
app.use("/api/user", protect, userRouter);
app.use("/api/product", protect, productRouter);


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
