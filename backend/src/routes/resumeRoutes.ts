import express from "express"
import multer from "multer"
import { authenticate } from "../middleware/auth"
import { uploadResume } from "../controllers/resumeController"

const router = express.Router()

// NOTE: Ensure an 'uploads' folder exists in your project root
const upload = multer({
  dest: "uploads/"
})

router.post(
  "/:jobId",
  authenticate,              // 1. Authenticate FIRST
  upload.array("resumes", 10), // 2. Parse files SECOND
  uploadResume
)

export default router