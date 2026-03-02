import express = require("express");
import session = require("express-session");
import path = require("path");
import { connectDB } from "./db/connect";
import passwordRouter from "./logic/api";
import dotenv = require("dotenv");
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://192.168.1.125:3000"
    ],
    credentials: true,
  })
);
app.use(
  session({
    name: "connect.sid",
    secret: "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,      // MUST be false on http
      sameSite: "lax",    // MUST be lax
    },
  })
);

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session.isAuth) return next();
  return res.status(401).send("Unauthorized");
}



app.use(express.json());
app.use("/api", passwordRouter);

async function startServer() {
  await connectDB(process.env.DB as string);
  app.listen(port,"0.0.0.0",  () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

startServer();
