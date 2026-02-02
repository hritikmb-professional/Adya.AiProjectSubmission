import { Response } from "express"
import Job from "../models/Job"
import { AuthRequest } from "../middleware/auth"
import Candidate from "../models/Candidate"


/**
 * Create a new job
 */
export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    console.log("📥 CREATE JOB HIT")
    console.log("🧑 USER ID:", req.userId)
    console.log("📦 BODY:", req.body)

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const job = await Job.create({
      title: req.body.title,
      description: req.body.description,
      createdBy: req.userId
    })

    console.log("✅ JOB SAVED:", job._id)

    return res.status(201).json(job)
  } catch (err) {
    console.error("❌ CREATE JOB ERROR:", err)
    return res.status(500).json({
      message: "Create job failed",
      error: String(err)
    })
  }
}

/**
 * Get jobs created by logged-in recruiter
 */
export const getMyJobs = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const jobs = await Job.find({ createdBy: req.userId })
      .sort({ createdAt: -1 })

    return res.status(200).json(jobs)
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch jobs",
      error: String(err)
    })
  }
}

/**
 * Get ranked candidates for a job
 */
export const getRankedCandidates = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.params

    const candidates = await Candidate.find({ job: jobId })
      .sort({ matchScore: -1 })

    return res.status(200).json(candidates)
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch candidates",
      error: String(err)
    })
  }
}
