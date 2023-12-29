import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { Buffer } from "buffer";
globalThis.Buffer = Buffer;
import userRoutes from "./routes/users.js";
import { Server } from "socket.io";
import { sendMessage } from "./controllers/users.js";
import cors from "cors";
import "dotenv/config";
const app = express();
const PORT = 5000;
app.use(cors());

const URL = process.env.MONGO_URL;
const io = new Server({
  cors: {
    origin: "http://localhost:5173/home",
    origin: "http://localhost:5173",
  },
});
io.on("connection", (socket) => {
  console.log("new user has been connected");
});

app.use(bodyParser.json());
app.use("/users", userRoutes);
mongoose
  .connect(URL)
  .then((res) => {
    console.log("connected to mongodb database");
  })
  .catch((err) => {
    console.log(err);
  });
// socket code to send and recieve message
io.on("sendMessage", async (data) => {
  console.log(data);
  await sendMessage(data);
  io.emit("message", data);

  io.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.listen(PORT, () => {
  console.log("rever is running on Port" + PORT);
});

app.get("/", (_, res) => res.send("Hello Server"));

io.listen(8000);
