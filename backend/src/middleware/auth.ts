import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request {
  userId?: string
}

export const authenticate = (req: any, res: any, next: any) => {
  console.log("🔐 AUTH MIDDLEWARE HIT")

  const authHeader = req.headers.authorization
  if (!authHeader) {
    console.log("❌ NO AUTH HEADER")
    return res.status(401).json({ message: "Unauthorized" })
  }

  const token = authHeader.split(" ")[1]
  if (!token) {
    console.log("❌ NO TOKEN")
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
    req.userId = decoded.userId
    console.log("✅ AUTH SUCCESS", req.userId)
    next()
  } catch (err) {
    console.log("❌ AUTH FAILED", err)
    return res.status(401).json({ message: "Invalid token" })
  }
}
