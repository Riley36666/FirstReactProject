// USER INFO LOGIC

import express, { Request, Response } from "express";
import requireAuth from "./Auth";
const router = express.Router();
import Settings from "../db/models/Settings";

router.get("/getInfo", (req, res) => {
  res.json({
    isAuth: req.session.isAuth ?? null,
  });
});

router.get("/tokentime", requireAuth, (req: Request, res: Response) => {
  if (!req.session.cookie.expires) {
    return res.json({ remainingMs: null });
  }

  const expiresAt = new Date(req.session.cookie.expires).getTime();
  const now = Date.now();

  const remainingMs = Math.max(expiresAt - now, 0);

  res.json({
    remainingMs,
    remainingMinutes: Math.floor(remainingMs / 1000 / 60),
  });
});

router.get("/settings", requireAuth, async (_req: Request, res: Response) => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({
      darkMode: false,
    });
  }

  res.json(settings);
});

router.put("/updatesettings", requireAuth, async(req:Request, res:Response) => {
  let {darkMode} = req.body;
  const settings = await Settings.findOneAndUpdate(
    {},
    { darkMode },
    { upsert: true, new: true }
  );



  res.json({success: true, settings})
})


export default router;