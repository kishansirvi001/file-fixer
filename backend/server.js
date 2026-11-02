import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import emailRoutes from "./routes/email.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", emailRoutes);
app.get("/", (_req, res) => res.send("FileFixer service is running."));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`FileFixer service listening on port ${port}`));
