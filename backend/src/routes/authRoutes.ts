import express from "express"
import { signup, login } from "../controllers/authController"
import { authenticate } from "../middleware/auth"
console.log("authRoutes loaded")
const router = express.Router()
router.post("/signup", signup)
router.post("/login", login)
router.get("/me", authenticate, (req, res) => {
  res.json({ message: "Authenticated", userId: (req as any).userId })
})
export default router
