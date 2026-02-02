import { Response } from "express"
import { AuthRequest } from "../middleware/auth"
import Candidate from "../models/Candidate"
import Job from "../models/Job"
import { parseResume } from "../services/resumeParser"
import { analyzeResumeWithLLM } from "../services/llmResumeAnalyzer"

export const uploadResume = async (req: AuthRequest, res: Response) => {
  try {
    const jobId = req.params.jobId

    if (!req.files || !(req.files as Express.Multer.File[]).length) {
      return res.status(400).json({ message: "Resume file is required" })
    }

    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    const files = req.files as Express.Multer.File[]
    const createdCandidates = []
    const updatedCandidates = []

    for (const file of files) {
      const resumeText = await parseResume(file.path, file.mimetype)

      const llmResult = await analyzeResumeWithLLM(
        resumeText,
        job.description
      )

      // 🔢 NORMALIZE SCORE (0–1 → 0–100)
      const rawScore = llmResult.matchScore ?? 0
      const normalizedScore =
        rawScore <= 1
          ? Math.round(rawScore * 100)
          : Math.round(rawScore)

      const existingCandidate = llmResult.email
        ? await Candidate.findOne({
            job: jobId,
            email: llmResult.email
          })
        : null

      if (existingCandidate) {
        existingCandidate.skills = llmResult.skills || []
        existingCandidate.matchedSkills = llmResult.matchedSkills || []
        existingCandidate.missingSkills = llmResult.missingSkills || []
        existingCandidate.summary = llmResult.summary || ""
        existingCandidate.matchScore = normalizedScore
        existingCandidate.resumeText = resumeText
        existingCandidate.resumePath = file.path

        await existingCandidate.save()
        updatedCandidates.push(existingCandidate)
        continue // ✅ IMPORTANT: continue loop, don’t return
      }

      const candidate = await Candidate.create({
        name: llmResult.name || "Unknown",
        email: llmResult.email || "",
        phone: llmResult.phone || "",
        skills: llmResult.skills || [],
        matchedSkills: llmResult.matchedSkills || [],
        missingSkills: llmResult.missingSkills || [],
        summary: llmResult.summary || "",
        resumeText,
        resumePath: file.path,
        matchScore: normalizedScore,
        job: jobId
      })

      createdCandidates.push(candidate)
    }

    return res.status(201).json({
      message: "Resume processing completed",
      created: createdCandidates.length,
      updated: updatedCandidates.length
    })
  } catch (err) {
    console.error("UPLOAD RESUME ERROR:", err)
    return res.status(500).json({
      message: "Failed to upload resume",
      error: String(err)
    })
  }
}
