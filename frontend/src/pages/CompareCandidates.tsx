import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { compareCandidates } from "../api/candidates"

export default function CompareCandidates() {
  const [params] = useSearchParams()
  const ids = params.get("ids")?.split(",") || []
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ids.length) return

    compareCandidates(ids)
      .then(res => setCandidates(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-6">Loading comparison…</p>

  const statusColor = (status: string) =>
    status === "hired"
      ? "bg-green-600"
      : status === "shortlisted"
      ? "bg-yellow-500"
      : status === "rejected"
      ? "bg-red-600"
      : "bg-gray-500"

  return (
    <div className="p-6 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-6">
        Candidate Comparison
      </h1>

      <table className="min-w-full border bg-white">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border">Field</th>
            {candidates.map(c => (
              <th key={c._id} className="p-3 border">
                {c.name || "Unnamed"}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Status */}
          <tr>
            <td className="p-3 border font-medium">Status</td>
            {candidates.map(c => (
              <td key={c._id} className="p-3 border">
                <span
                  className={`px-2 py-1 text-xs rounded text-white ${statusColor(
                    c.status
                  )}`}
                >
                  {(c.status || "applied").toUpperCase()}
                </span>
              </td>
            ))}
          </tr>

          {/* Match Score */}
          <tr>
            <td className="p-3 border font-medium">Match Score</td>
            {candidates.map(c => {
              const score =
                c.matchScore <= 1
                  ? Math.round(c.matchScore * 100)
                  : Math.round(c.matchScore)

              return (
                <td key={c._id} className="p-3 border">
                  {score}
                </td>
              )
            })}
          </tr>

          {/* Skills */}
          <tr>
            <td className="p-3 border font-medium">Skills</td>
            {candidates.map(c => (
              <td key={c._id} className="p-3 border text-sm">
                {c.skills?.join(", ") || "—"}
              </td>
            ))}
          </tr>

          {/* Matched */}
          <tr>
            <td className="p-3 border font-medium">Matched Skills</td>
            {candidates.map(c => (
              <td key={c._id} className="p-3 border text-sm text-green-700">
                {c.matchedSkills?.join(", ") || "—"}
              </td>
            ))}
          </tr>

          {/* Missing */}
          <tr>
            <td className="p-3 border font-medium">Missing Skills</td>
            {candidates.map(c => (
              <td key={c._id} className="p-3 border text-sm text-red-600">
                {c.missingSkills?.join(", ") || "—"}
              </td>
            ))}
          </tr>

          {/* Summary */}
          <tr>
            <td className="p-3 border font-medium">AI Summary</td>
            {candidates.map(c => (
              <td key={c._id} className="p-3 border text-sm">
                {c.summary || "—"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
