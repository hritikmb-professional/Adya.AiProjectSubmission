import mongoose, { Schema, Document } from "mongoose"

export interface ICandidate extends Document {
  name: string
  email: string
  phone: string
  skills: string[]
  matchedSkills: string[]
  missingSkills: string[]
  summary: string
  experience: string
  education: string[]
  resumeText: string
  resumePath: string
  matchScore: number
  status: {
  type: String,
  enum: ["applied", "shortlisted", "hired", "rejected"],
  default: "applied"
},

  job: mongoose.Types.ObjectId
  createdAt: Date
}

const CandidateSchema = new Schema<ICandidate>({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    default: ""
  },

  phone: {
    type: String,
    default: ""
  },

  skills: {
    type: [String],
    default: []
  },

  matchedSkills: {
    type: [String],
    default: []
  },

  missingSkills: {
    type: [String],
    default: []
  },

  summary: {
    type: String,
    default: ""
  },

  experience: {
    type: String,
    default: ""
  },

  education: {
    type: [String],
    default: []
  },

  resumeText: {
    type: String,
    required: true
  },

  resumePath: {
    type: String,
    required: true
  },

  matchScore: {
    type: Number,
    default: 0
  },

  job: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model<ICandidate>("Candidate", CandidateSchema)
