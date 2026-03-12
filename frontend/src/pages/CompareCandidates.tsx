import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { compareCandidates } from "../api/candidates"
import Layout from "../components/Layout"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

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

  const statusColor = (status: string) =>
    status === "promote_to_hr"
      ? "bg-emerald-600"
      : status === "promote_to_oa"
      ? "bg-indigo-600"
      : status === "rejected"
      ? "bg-rose-600"
      : "bg-slate-500"

  const statusLabel = (status: string) =>
    status === "promote_to_hr"
      ? "Promote to HR"
      : status === "promote_to_oa"
      ? "Promote to OA"
      : status === "rejected"
      ? "Rejected"
      : "Applied"

  if (loading) {
    return (
      <Layout showBack>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-600">Loading comparison...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showBack>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Candidate comparison
          </h1>
          <p className="mt-2 text-slate-600">
            Compare {candidates.length} candidates side by side
          </p>
        </div>

        {/* Comparison charts */}
        {candidates.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-8 animate-fade-in">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Match score comparison</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={candidates.map(c => ({
                      name: (c.name || "Unnamed").split(" ")[0],
                      score: c.matchScore <= 1 ? Math.round(c.matchScore * 100) : Math.round(c.matchScore)
                    }))}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} width={80} />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                      formatter={(value: number | undefined) => [`${value ?? 0}%`, "Match score"]}
                    />
                    <Bar dataKey="score" fill="#6366f1" radius={[0, 4, 4, 0]} name="Match score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Skills overview</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={candidates.map(c => ({
                      name: (c.name || "Unnamed").split(" ")[0],
                      matched: c.matchedSkills?.length ?? 0,
                      missing: c.missingSkills?.length ?? 0
                    }))}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 12 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                    />
                    <Legend />
                    <Bar dataKey="matched" stackId="a" fill="#10b981" name="Matched skills" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="missing" stackId="a" fill="#ef4444" name="Missing skills" radius={[0, 0, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed min-w-[600px]">
              <colgroup>
                <col className="w-[180px] min-w-[180px]" />
                {candidates.map((c) => (
                  <col key={c._id} className="min-w-[280px]" />
                ))}
              </colgroup>
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider sticky left-0 bg-slate-50 z-10 border-r border-slate-200">
                    Criteria
                  </th>
                  {candidates.map((c) => (
                    <th
                      key={c._id}
                      className="px-5 py-4 text-left bg-gradient-to-b from-indigo-50/50 to-white border-b border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {(c.name || "?")[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {c.name || "Unnamed"}
                          </p>
                          <p className="text-xs text-slate-500 truncate max-w-[200px]">
                            {c.email || "—"}
                          </p>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {/* Section: Overview */}
                <tr className="bg-slate-50/30">
                  <td
                    colSpan={candidates.length + 1}
                    className="px-5 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Overview
                  </td>
                </tr>

                {/* Status */}
                <tr className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-slate-700 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 border-r border-slate-100">
                    Status
                  </td>
                  {candidates.map(c => (
                    <td key={c._id} className="px-5 py-4 align-middle">
                      <span
                        className={`inline-block px-3 py-1.5 text-xs font-semibold rounded-lg text-white ${statusColor(
                          c.status
                        )}`}
                      >
                        {statusLabel(c.status || "applied")}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Match Score */}
                <tr className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-slate-700 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 border-r border-slate-100">
                    Match score
                  </td>
                  {candidates.map(c => {
                    const score =
                      c.matchScore <= 1
                        ? Math.round(c.matchScore * 100)
                        : Math.round(c.matchScore)
                    return (
                      <td key={c._id} className="px-5 py-4 align-middle">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-lg font-bold text-slate-900">{score}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  score >= 70 ? "bg-emerald-500" : score >= 40 ? "bg-amber-500" : "bg-rose-500"
                                }`}
                                style={{ width: `${Math.min(score, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                    )
                  })}
                </tr>

                {/* Section: Contact */}
                <tr className="bg-slate-50/30">
                  <td
                    colSpan={candidates.length + 1}
                    className="px-5 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Contact
                  </td>
                </tr>

                {/* Email */}
                <tr className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-slate-700 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 border-r border-slate-100">
                    Email
                  </td>
                  {candidates.map(c => (
                    <td key={c._id} className="px-5 py-4 text-sm text-slate-600 break-all">
                      {c.email || "—"}
                    </td>
                  ))}
                </tr>

                {/* Phone */}
                <tr className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-slate-700 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 border-r border-slate-100">
                    Phone
                  </td>
                  {candidates.map(c => (
                    <td key={c._id} className="px-5 py-4 text-sm text-slate-600">
                      {c.phone || "—"}
                    </td>
                  ))}
                </tr>

                {/* Section: Skills */}
                <tr className="bg-slate-50/30">
                  <td
                    colSpan={candidates.length + 1}
                    className="px-5 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Skills
                  </td>
                </tr>

                {/* All Skills */}
                <tr className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-slate-700 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 border-r border-slate-100 align-top pt-4">
                    All skills
                  </td>
                  {candidates.map(c => (
                    <td key={c._id} className="px-5 py-4 align-top">
                      <div className="flex flex-wrap gap-1.5">
                        {c.skills?.length ? (
                          c.skills.map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Matched Skills */}
                <tr className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-slate-700 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 border-r border-slate-100 align-top pt-4">
                    Matched
                  </td>
                  {candidates.map(c => (
                    <td key={c._id} className="px-5 py-4 align-top">
                      <div className="flex flex-wrap gap-1.5">
                        {c.matchedSkills?.length ? (
                          c.matchedSkills.map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-800"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Missing Skills */}
                <tr className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-slate-700 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 border-r border-slate-100 align-top pt-4">
                    Missing
                  </td>
                  {candidates.map(c => (
                    <td key={c._id} className="px-5 py-4 align-top">
                      <div className="flex flex-wrap gap-1.5">
                        {c.missingSkills?.length ? (
                          c.missingSkills.map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-xs font-medium bg-rose-100 text-rose-800"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Section: AI Analysis */}
                <tr className="bg-slate-50/30">
                  <td
                    colSpan={candidates.length + 1}
                    className="px-5 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    AI analysis
                  </td>
                </tr>

                {/* AI Summary */}
                <tr className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-slate-700 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 border-r border-slate-100 align-top pt-4">
                    Summary
                  </td>
                  {candidates.map(c => (
                    <td key={c._id} className="px-5 py-4 align-top">
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {c.summary || "—"}
                      </p>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
