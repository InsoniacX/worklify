import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL).then(() => {
    console.log("Connection With DB returned Status 200 OK")
    app.listen(PORT, () => {
        console.log(`Server is Running on port: ${PORT}`)
    });
}).catch((error) => console.log(error))
