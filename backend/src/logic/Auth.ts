import { Request, Response, NextFunction } from "express";

export default function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.session.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
    console.log("Not auth")
  }
  next();
}