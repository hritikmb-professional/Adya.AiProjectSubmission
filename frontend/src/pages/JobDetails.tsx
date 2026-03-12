import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getCandidates } from "../api/jobs"
import { updateCandidateStatus } from "../api/candidates"
import api from "../api/axios"
import Layout from "../components/Layout"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts"

const STATUS_COLORS: Record<string, string> = {
  applied: "#94a3b8",
  promote_to_oa: "#6366f1",
  promote_to_hr: "#10b981",
  rejected: "#ef4444"
}

export default function JobDetails() {
  const { jobId } = useParams()
  const navigate = useNavigate()

  const [files, setFiles] = useState<FileList | null>(null)
  const [candidates, setCandidates] = useState<any[]>([])
  const [filteredCandidates, setFilteredCandidates] = useState<any[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [minScore, setMinScore] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>("")

  const loadCandidates = async () => {
    if (!jobId) return
    const res = await getCandidates(jobId)
    setCandidates(res.data)
    setFilteredCandidates(res.data)
  }

  useEffect(() => {
    loadCandidates()
  }, [jobId])

  // Apply filters
  useEffect(() => {
    let filtered = [...candidates]

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(c => c.status === statusFilter)
    }

    // Score filter
    filtered = filtered.filter(c => c.matchScore >= minScore)

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(c =>
        c.name?.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query) ||
        c.skills?.some((skill: string) => skill.toLowerCase().includes(query))
      )
    }

    setFilteredCandidates(filtered)
  }, [statusFilter, minScore, searchQuery, candidates])

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
    status: "applied" | "promote_to_oa" | "promote_to_hr" | "rejected"
  ) => {
    try {
      await updateCandidateStatus(candidateId, status)
      await loadCandidates()
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to update status"
      alert(msg)
    }
  }

  const statusColor = (status: string) =>
    status === "promote_to_hr"
      ? "bg-green-600"
      : status === "promote_to_oa"
      ? "bg-blue-600"
      : status === "rejected"
      ? "bg-red-600"
      : "bg-gray-500"

  const statusLabel = (status: string) =>
    status === "promote_to_hr"
      ? "PROMOTE TO HR"
      : status === "promote_to_oa"
      ? "PROMOTE TO OA"
      : status === "rejected"
      ? "REJECTED"
      : "APPLIED"

  return (
    <Layout showBack backLabel="Back to Dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Job details
          </h1>
          <p className="mt-2 text-slate-600">
            Upload resumes and manage candidates
          </p>
        </div>

        {/* Upload Resumes */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 mb-6 shadow-sm animate-fade-in">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Upload resumes
          </h2>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              multiple
              onChange={e => setFiles(e.target.files)}
              className="flex-1 text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
            />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 mb-6 shadow-sm animate-fade-in">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Filter candidates
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="applied">Applied</option>
                <option value="promote_to_oa">Promote to OA</option>
                <option value="promote_to_hr">Promote to HR</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Score Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Minimum score: {minScore}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={minScore}
                onChange={e => setMinScore(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-slate-200 accent-indigo-600"
              />
            </div>

            {/* Search Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Name, email, or skills..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing {filteredCandidates.length} of {candidates.length} candidates
            </p>
            {(statusFilter !== "all" || minScore > 0 || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("all")
                  setMinScore(0)
                  setSearchQuery("")
                }}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Visualizations */}
        {candidates.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-8 animate-fade-in">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Status distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(
                        candidates.reduce((acc: Record<string, number>, c) => {
                          const s = c.status || "applied"
                          acc[s] = (acc[s] || 0) + 1
                          return acc
                        }, {})
                      ).map(([key, value]) => ({
                        name: statusLabel(key),
                        value
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {Object.entries(
                        candidates.reduce((acc: Record<string, number>, c) => {
                          const s = c.status || "applied"
                          acc[s] = (acc[s] || 0) + 1
                          return acc
                        }, {})
                      ).map(([name]) => (
                        <Cell key={name} fill={STATUS_COLORS[name] || "#94a3b8"} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                      formatter={(value: number | undefined) => [`${value ?? 0} candidates`, "Count"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Score distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        range: "0–25",
                        count: candidates.filter(c => (c.matchScore ?? 0) >= 0 && (c.matchScore ?? 0) < 25).length
                      },
                      {
                        range: "26–50",
                        count: candidates.filter(c => (c.matchScore ?? 0) >= 25 && (c.matchScore ?? 0) < 50).length
                      },
                      {
                        range: "51–75",
                        count: candidates.filter(c => (c.matchScore ?? 0) >= 50 && (c.matchScore ?? 0) < 75).length
                      },
                      {
                        range: "76–100",
                        count: candidates.filter(c => (c.matchScore ?? 0) >= 75 && (c.matchScore ?? 0) <= 100).length
                      }
                    ]}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="range" tick={{ fill: "#64748b", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 12 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Candidates" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Compare Button */}
        {selected.length >= 2 && (
          <button
            type="button"
            onClick={handleCompare}
            className="mb-6 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all"
          >
            Compare selected ({selected.length})
          </button>
        )}

        {/* Candidates */}
        {filteredCandidates.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-16 text-center animate-fade-in">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {candidates.length === 0 ? "No candidates yet" : "No candidates match filters"}
            </h3>
            <p className="text-slate-600">
              {candidates.length === 0
                ? "Upload resumes to start evaluating candidates"
                : "Try adjusting your filters"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredCandidates.map((c, i) => (
              <div
                key={c._id}
                className={`bg-white rounded-2xl border p-6 shadow-sm animate-fade-in transition-all ${
                  selected.includes(c._id)
                    ? "border-indigo-300 ring-2 ring-indigo-500/20 shadow-indigo-100"
                    : "border-slate-200/80 hover:border-slate-300"
                }`}
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(c._id)}
                      onChange={() => toggleSelect(c._id)}
                      className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <h3 className="text-xl font-semibold text-slate-900">
                      {c.name || "Unnamed Candidate"}
                    </h3>
                  </div>

                  <div className="flex gap-2 items-center flex-wrap">
                    <span className="px-3 py-1.5 text-sm rounded-xl bg-slate-800 text-white font-semibold">
                      Score: {c.matchScore}
                    </span>
                    <span
                      className={`px-3 py-1.5 text-sm rounded-xl text-white font-semibold ${statusColor(
                        c.status
                      )}`}
                    >
                      {statusLabel(c.status || "applied")}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-4">
                  {c.email || "No email"} · {c.phone || "No phone"}
                </p>

                {/* Skills */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-semibold text-emerald-700 mb-2">
                      Matched skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {c.matchedSkills?.length ? (
                        c.matchedSkills.map((skill: string) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-800"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-400">None</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-rose-700 mb-2">
                      Missing skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {c.missingSkills?.length ? (
                        c.missingSkills.map((skill: string) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-100 text-rose-800"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-400">None</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
                  <p className="text-sm font-semibold text-slate-900 mb-1">
                    AI summary
                  </p>
                  <p className="text-sm text-slate-700">
                    {c.summary || "No summary available"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => changeStatus(c._id, "promote_to_oa")}
                    className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    Promote to OA
                  </button>
                  <button
                    type="button"
                    onClick={() => changeStatus(c._id, "promote_to_hr")}
                    className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    Promote to HR
                  </button>
                  <button
                    type="button"
                    onClick={() => changeStatus(c._id, "rejected")}
                    className="px-4 py-2 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/candidates/${c._id}`)}
                    className="ml-auto text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    View full profile
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}