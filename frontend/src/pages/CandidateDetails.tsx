import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getCandidate, updateCandidateStatus } from "../api/candidates"

const STATUS_COLORS: Record<string, string> = {
  applied: "bg-gray-500",
  shortlisted: "bg-yellow-500",
  hired: "bg-green-600",
  rejected: "bg-red-600"
}

const STATUS_OPTIONS = ["applied", "shortlisted", "hired", "rejected"]

export default function CandidateDetails() {
  const { candidateId } = useParams()
  const [candidate, setCandidate] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!candidateId) return
    getCandidate(candidateId).then(res => setCandidate(res.data))
  }, [candidateId])

  if (!candidate) {
    return <p className="p-6">Loading candidate details...</p>
  }

  // ✅ NORMALIZE SCORE
  const score =
    candidate.matchScore <= 1
      ? Math.round(candidate.matchScore * 100)
      : Math.round(candidate.matchScore)

  const barColor =
    score >= 70 ? "bg-green-600" : score >= 40 ? "bg-yellow-500" : "bg-red-500"

  const status = candidate.status || "applied"

  // 🔥 REAL STATUS UPDATE
  const handleStatusChange = async (newStatus: string) => {
    if (!candidateId || newStatus === status) return

    try {
      setUpdating(true)
      const res = await updateCandidateStatus(candidateId, newStatus as "shortlisted" | "hired" | "rejected")
      setCandidate(res.data) // backend is source of truth
      setOpen(false)
    } catch (err) {
      alert("Failed to update status")
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-4 relative">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">
            {candidate.name || "Unnamed Candidate"}
          </h1>

          {/* Status Pill */}
          <button
            type="button"
            disabled={updating}
            onClick={() => setOpen(prev => !prev)}
            className={`px-3 py-1 text-xs rounded-full text-white cursor-pointer ${STATUS_COLORS[status]}`}
          >
            {updating ? "UPDATING..." : status.toUpperCase()}
          </button>
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute mt-2 bg-white border rounded shadow w-40 z-50">
            {STATUS_OPTIONS.map(s => (
              <div
                key={s}
                onClick={() => handleStatusChange(s)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                {s.toUpperCase()}
              </div>
            ))}
          </div>
        )}

        <span className="inline-block mt-3 px-3 py-1 text-sm rounded-full bg-black text-white">
          Match Score: {score}
        </span>

        <p className="text-gray-600 mt-2">
          Email: {candidate.email || "N/A"}
        </p>
        <p className="text-gray-600">
          Phone: {candidate.phone || "N/A"}
        </p>
      </div>

      {/* Score Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
          <div
            className={`h-3 transition-all ${barColor}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Explainability */}
      <div className="mt-6 bg-white p-5 rounded shadow">
        <h2 className="font-semibold mb-3">Explainability</h2>

        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Matched Skills</p>
          <div className="flex flex-wrap gap-2">
            {candidate.matchedSkills?.length ? (
              candidate.matchedSkills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-2 py-1 rounded text-xs bg-green-100 text-green-800"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-400">None</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Missing Skills</p>
          <div className="flex flex-wrap gap-2">
            {candidate.missingSkills?.length ? (
              candidate.missingSkills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-2 py-1 rounded text-xs bg-red-100 text-red-800"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-400">None</span>
            )}
          </div>
        </div>

        <div className="mt-4 bg-gray-50 p-4 rounded border">
          <p className="text-sm font-semibold mb-1">AI Summary</p>
          <p className="text-sm text-gray-700">
            {candidate.summary || "No AI summary available."}
          </p>
        </div>
      </div>
    </div>
  )
}

