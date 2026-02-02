import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getCandidates } from "../api/jobs"
import { updateCandidateStatus } from "../api/candidates"
import api from "../api/axios"

export default function JobDetails() {
  const { jobId } = useParams()
  const navigate = useNavigate()

  const [files, setFiles] = useState<FileList | null>(null)
  const [candidates, setCandidates] = useState<any[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const loadCandidates = async () => {
    if (!jobId) return
    const res = await getCandidates(jobId)
    setCandidates(res.data)
  }

  useEffect(() => {
    loadCandidates()
  }, [jobId])

  /* ===================== UPLOAD ===================== */
  const handleUpload = async () => {
    if (!files || !jobId) {
      alert("Select at least one resume")
      return
    }

    const formData = new FormData()
    Array.from(files).forEach(file => {
      formData.append("resumes", file)
    })

    try {
      setLoading(true)
      await api.post(`/resumes/${jobId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setFiles(null)
      await loadCandidates()
      alert("Resumes uploaded successfully")
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Resume upload failed"
      )
    } finally {
      setLoading(false)
    }
  }

  /* ===================== SELECT ===================== */
  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    )
  }

  const handleCompare = () => {
    if (selected.length < 2) {
      alert("Select at least 2 candidates to compare")
      return
    }
    navigate(`/compare?ids=${selected.join(",")}`)
  }

  /* ===================== STATUS ===================== */
  const changeStatus = async (
    candidateId: string,
    status: "shortlisted" | "hired" | "rejected"
  ) => {
    await updateCandidateStatus(candidateId, status)
    await loadCandidates()
  }

  const statusColor = (status: string) =>
    status === "hired"
      ? "bg-green-600"
      : status === "shortlisted"
      ? "bg-yellow-500"
      : status === "rejected"
      ? "bg-red-600"
      : "bg-gray-400"

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Job Details</h1>

      {/* Upload Resumes */}
      <div className="border p-4 rounded mb-6 bg-white">
        <h2 className="font-semibold mb-2">Upload Resumes</h2>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          multiple
          onChange={e => setFiles(e.target.files)}
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="ml-4 px-4 py-2 bg-black text-white rounded"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Compare Button */}
      {selected.length >= 2 && (
        <button
          onClick={handleCompare}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Compare Selected ({selected.length})
        </button>
      )}

      {/* Candidates */}
      <div className="grid gap-4">
        {candidates.map(c => (
          <div
            key={c._id}
            className={`border p-3 rounded bg-white ${
              selected.includes(c._id) ? "ring-2 ring-blue-500" : ""
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(c._id)}
                  onChange={() => toggleSelect(c._id)}
                />
                <h3 className="text-lg font-semibold">
                  {c.name || "Unnamed Candidate"}
                </h3>
              </div>

              <div className="flex gap-2 items-center">
                <span className="px-2 py-1 text-xs rounded bg-black text-white">
                  {c.matchScore}
                </span>

                <span
                  className={`px-2 py-1 text-xs rounded text-white ${statusColor(
                    c.status
                  )}`}
                >
                  {c.status?.toUpperCase() || "APPLIED"}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              {c.email || "No email"} · {c.phone || "No phone"}
            </p>

            {/* Skills */}
            <div className="mt-3">
              <p className="text-sm font-medium text-green-700">
                Matched Skills
              </p>
              <p className="text-sm">
                {c.matchedSkills?.length
                  ? c.matchedSkills.join(", ")
                  : "None"}
              </p>
            </div>

            <div className="mt-2">
              <p className="text-sm font-medium text-red-600">
                Missing Skills
              </p>
              <p className="text-sm">
                {c.missingSkills?.length
                  ? c.missingSkills.join(", ")
                  : "None"}
              </p>
            </div>

            {/* Summary */}
            <div className="mt-3">
              <p className="text-sm font-medium">AI Summary</p>
              <p className="text-sm text-gray-700">
                {c.summary || "No summary available"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => changeStatus(c._id, "shortlisted")}
                className="px-3 py-1 text-xs bg-yellow-500 text-white rounded"
              >
                Shortlist
              </button>

              <button
                onClick={() => changeStatus(c._id, "hired")}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded"
              >
                Hire
              </button>

              <button
                onClick={() => changeStatus(c._id, "rejected")}
                className="px-3 py-1 text-xs bg-red-600 text-white rounded"
              >
                Reject
              </button>

              <button
                onClick={() => navigate(`/candidates/${c._id}`)}
                className="ml-auto text-sm text-blue-600 hover:underline"
              >
                View full profile →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
