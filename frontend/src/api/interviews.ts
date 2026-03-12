import api from "./axios"

export const getSlots = (params: {
  dateISO: string
  durationMinutes: number
  calendarId?: string
  timeZone?: string
}) => api.get("/interviews/slots", { params })

export const scheduleInterview = (data: {
  candidateId: string
  jobId: string
  interviewerEmail: string
  startISO: string
  endISO: string
  timeZone?: string
}) => api.post("/interviews", data)

export const listInterviews = (params?: { jobId?: string }) =>
  api.get("/interviews", { params })

export const getInterview = (id: string) =>
  api.get(`/interviews/${id}`)

export const submitFeedback = (id: string, data: { rating: number; comments: string }) =>
  api.post(`/interviews/${id}/feedback`, data)

export const generateSlots = (data: {
  startDateISO: string
  endDateISO: string
  durationMinutes: number
  calendarId?: string
  timeZone?: string
  workStartHour?: number
  workEndHour?: number
}) => api.post("/interviews/slots/generate", data)

export const listOpenSlots = (params?: { dateISO?: string }) =>
  api.get("/interviews/slots/open", { params })

export const bookSlot = (id: string, data: {
  candidateId: string
  jobId: string
  interviewerEmail: string
}) => api.post(`/interviews/slots/${id}/book`, data)
