import api from "./axios"

export const getCandidate = (id: string) =>
  api.get(`/candidates/${id}`)

export const compareCandidates = (ids: string[]) =>
  api.get(`/candidates/compare`, {
    params: {
      ids: ids.join(",")
    }
  })
export const updateCandidateStatus = (
  candidateId: string,
  status: "shortlisted" | "hired" | "rejected"
) =>
  api.patch(`/candidates/${candidateId}/status`, { status })

