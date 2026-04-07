import { Request, Response, NextFunction } from "express";

export default function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.session.isAuth) {
    console.log("Not auth")
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}