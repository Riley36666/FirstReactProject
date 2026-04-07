// USER LOGIN LOGIC

import express, { Request, Response } from "express";
import Password from "../db/models/Password";
import { deriveKey, decryptPass } from "./decryptpass";
import { encryptPass } from "./encryptpass";
import requireAuth from "./Auth";
const secret = deriveKey();
const router = express.Router();

router.get("/passwords",requireAuth , async (req: Request, res: Response): Promise<void> => {
  {
  try {
    const passwords = await Password.find(
      {},
      { _id: 0, Website: 1, Password: 1 }
    );

    const decrypted = passwords.map((pw) => ({
      Website: pw.Website,
      Password: decryptPass(pw.Password, secret),
    }));

    res.json(decrypted);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    res.status(500).send("Server error");
  }
} 
});

router.get("/totalPasswords", requireAuth, async (req: Request, res: Response): Promise<void> => {
    try {
      const total = await Password.countDocuments();
      res.json({ total });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
      res.status(500).send("Server error");
    }
  }
);

router.get("/test", requireAuth, (req: Request, res: Response) => {
  res.status(200).json({ test: true});
})


router.post("/login", (req: Request, res: Response): void => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Missing credentials" });
    return;
  }

  if (
    password === process.env.LOGIN_PASSWORD
  ) {
    req.session.isAuth = true; // TS now recognises this
    res.status(200).json({ success: true });
    return;
  }

  res.status(401).json({ success: false, message: "Invalid credentials" });
});
router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});

router.post("/createPass", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { website, password } = req.body;
    console.log(req.body);
    // Basic validation
    if (!website || !password) {
      res.status(400).json({ error: "Website and password are required" });
      return;
    }

    const secret = deriveKey();
    const encryptedPassword = encryptPass(password, secret);

    await Password.create({
      Website: website,
      Password: encryptedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Password stored successfully",
    });

  } catch (err: any) {
    // Duplicate key error (same website already exists)
    if (err.code === 11000) {
      res.status(409).json({
        success: false,
        error: "Website already exists",
      });
      return;
    }

    console.error(err.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

export default router;