import express from "express"
import { authenticate } from "../middleware/auth"
import { updateCandidateStatus } from "../controllers/candidateController"
import {
  getCandidateById,
  getCandidatesByIds
} from "../controllers/candidateController"

const router = express.Router()

// ✅ ALWAYS put specific routes FIRST
router.get("/compare", authenticate, getCandidatesByIds)

// ✅ Then dynamic routes
router.get("/:candidateId", authenticate, getCandidateById)

router.patch(
  "/:candidateId/status",
  authenticate,
  updateCandidateStatus
)

export default router
