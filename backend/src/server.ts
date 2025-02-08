import express, { Express } from "express";
import mongoose from "mongoose";

const app: Express = express();

const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "";

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(error => console.log("Error connecting to MongoDB", error));
