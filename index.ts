import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import connectDb from "./config/db";
import userRoutes from "./routes/userRoute";
import postRoutes from "./routes/postRoute";

dotenv.config();

const app = express();
const PORT = 5000;

// Connect to the database
connectDb();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
