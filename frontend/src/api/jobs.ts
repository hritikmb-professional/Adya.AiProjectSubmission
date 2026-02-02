import api from "./axios"

export interface Job {
  _id: string
  title: string
  description: string
  createdAt: string
}

export interface Candidate {
  _id: string
  name: string
  email: string
  phone: string
  skills: string[]
  matchScore: number
}

export const getJobs = () =>
  api.get<Job[]>("/jobs")

export const createJob = (data: {
  title: string
  description: string
}) =>
  api.post<Job>("/jobs", data)

export const getCandidates = (jobId: string) =>
  api.get<Candidate[]>(`/jobs/${jobId}/candidates`)
