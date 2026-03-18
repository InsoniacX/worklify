import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN
}))

app.use(bodyParser.json());

/**
 * API URL
 */
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

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
