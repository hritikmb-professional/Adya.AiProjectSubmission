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
  status: "applied" | "promote_to_oa" | "promote_to_hr" | "rejected"
) =>
  api.patch(`/candidates/${candidateId}/status`, { status })