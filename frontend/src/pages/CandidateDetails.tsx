import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { getCandidate, updateCandidateStatus } from "../api/candidates"
import Layout from "../components/Layout"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts"

const STATUS_COLORS: Record<string, string> = {
  applied: "bg-gray-500",
  promote_to_oa: "bg-blue-600",
  promote_to_hr: "bg-green-600",
  rejected: "bg-red-600",
};

const STATUS_LABELS: Record<string, string> = {
  applied: "APPLIED",
  promote_to_oa: "PROMOTE TO OA",
  promote_to_hr: "PROMOTE TO HR",
  rejected: "REJECTED",
};

const STATUS_OPTIONS = ["applied", "promote_to_oa", "promote_to_hr", "rejected"] as const

export default function CandidateDetails() {
  const { candidateId } = useParams()
  const [candidate, setCandidate] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!candidateId) return;
    getCandidate(candidateId).then((res) => setCandidate(res.data));
  }, [candidateId]);

  if (!candidate) {
    return (
      <Layout showBack>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-600">Loading candidate details...</p>
          </div>
        </div>
      </Layout>
    )
  }

  const status = candidate.status || "applied";

  const handleStatusChange = async (
    newStatus: "applied" | "promote_to_oa" | "promote_to_hr" | "rejected"
  ) => {
    if (!candidateId || newStatus === status) return;

    try {
      setUpdating(true);
      const res = await updateCandidateStatus(candidateId, newStatus);
      setCandidate(res.data);
      setOpen(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to update status"
      alert(msg)
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadResume = () => {
    if (candidate.resumePath) {
      window.open(`http://localhost:5000/${candidate.resumePath}`, "_blank");
    }
  };

  const scoreBreakdown = candidate.scoreBreakdown || {
    skillsMatch: 0,
    experienceRelevance: 0,
    educationMatch: 0,
    projectRelevance: 0,
    overallExperience: 0,
  };

  const ScoreBar = ({ label, score, maxScore = 20 }: { label: string; score: number; maxScore?: number }) => {
    const percentage = (score / maxScore) * 100
    const color = percentage >= 70 ? "bg-emerald-600" : percentage >= 40 ? "bg-amber-500" : "bg-rose-500"

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className="text-sm font-bold text-slate-900">{score}/{maxScore}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 ${color} rounded-full transition-all`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <Layout showBack>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Candidate Header Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 border border-slate-200/80 animate-fade-in">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                {candidate.name || "Unnamed Candidate"}
              </h2>
              <div className="grid md:grid-cols-2 gap-3 text-slate-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">{candidate.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm">{candidate.phone || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Applied {new Date(candidate.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadResume}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Resume
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/interviews/schedule?jobId=${candidate.job}&candidateId=${candidate._id}`}
                    className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Schedule Interview
                  </Link>
                </div>
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="relative ml-6">
              <button
                type="button"
                disabled={updating}
                onClick={() => setOpen((prev) => !prev)}
                className={`px-5 py-2 text-sm rounded-lg text-white font-semibold ${STATUS_COLORS[status]} ${updating ? "opacity-50" : "hover:opacity-90"} transition-opacity`}
              >
                {updating ? "UPDATING..." : STATUS_LABELS[status]}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-56 z-50">
                  {STATUS_OPTIONS.map((s) => (
                    <div
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className={`px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 ${s === status ? "bg-blue-50 font-semibold" : ""} first:rounded-t-lg last:rounded-b-lg`}
                    >
                      {STATUS_LABELS[s]}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Overall Match Score */}
          <div className="bg-gradient-to-r from-indigo-50 to-slate-50 p-6 rounded-xl border border-indigo-200/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-700">Overall match score</span>
              <span className="text-3xl font-bold text-slate-900">{candidate.matchScore}/100</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-5 overflow-hidden">
              <div
                className={`h-5 transition-all ${
                  candidate.matchScore >= 70 ? "bg-emerald-600" : candidate.matchScore >= 40 ? "bg-amber-500" : "bg-rose-500"
                } rounded-full flex items-center justify-end pr-2`}
                style={{ width: `${candidate.matchScore}%` }}
              >
                {candidate.matchScore > 15 && (
                  <span className="text-xs text-white font-semibold">{candidate.matchScore}%</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Score Breakdown with Radar */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-slate-200/80">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Detailed score breakdown</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  data={[
                    { subject: "Skills", value: scoreBreakdown.skillsMatch, fullMark: 20 },
                    { subject: "Experience", value: scoreBreakdown.experienceRelevance, fullMark: 20 },
                    { subject: "Education", value: scoreBreakdown.educationMatch, fullMark: 20 },
                    { subject: "Projects", value: scoreBreakdown.projectRelevance, fullMark: 20 },
                    { subject: "Overall", value: scoreBreakdown.overallExperience, fullMark: 20 }
                  ]}
                >
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 20]} tick={{ fill: "#64748b" }} />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.4}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <ScoreBar label="Skills Match" score={scoreBreakdown.skillsMatch} />
              <ScoreBar label="Experience Relevance" score={scoreBreakdown.experienceRelevance} />
              <ScoreBar label="Education Match" score={scoreBreakdown.educationMatch} />
              <ScoreBar label="Project Relevance" score={scoreBreakdown.projectRelevance} />
              <ScoreBar label="Overall Experience" score={scoreBreakdown.overallExperience} />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Experience Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200/80">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-900">Experience</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {candidate.experience || "No experience information available"}
            </p>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200/80">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-900">Education</h3>
            </div>
            {candidate.education && candidate.education.length > 0 ? (
              <ul className="space-y-2">
                {candidate.education.map((edu: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-sm text-gray-700">{edu}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No education information available</p>
            )}
          </div>
        </div>

        {/* Skills Analysis */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-slate-200/80">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Skills analysis</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* All Skills */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                All Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {candidate.skills?.length ? (
                  candidate.skills.map((skill: string) => (
                    <span key={skill} className="px-3 py-1 rounded-lg text-sm bg-blue-100 text-blue-800 font-medium">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">None</span>
                )}
              </div>
            </div>

            {/* Matched Skills */}
            <div>
              <p className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Matched Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {candidate.matchedSkills?.length ? (
                  candidate.matchedSkills.map((skill: string) => (
                    <span key={skill} className="px-3 py-1 rounded-lg text-sm bg-green-100 text-green-800 font-medium">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">None</span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div>
              <p className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Missing Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {candidate.missingSkills?.length ? (
                  candidate.missingSkills.map((skill: string) => (
                    <span key={skill} className="px-3 py-1 rounded-lg text-sm bg-red-100 text-red-800 font-medium">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">None</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Verification */}
        {(() => {
          const gv = candidate.githubVerification || {};
          const hasGithubData =
            gv.githubFound ||
            (Array.isArray(gv.topRepos) && gv.topRepos.length > 0) ||
            (Array.isArray(gv.topLanguages) && gv.topLanguages.length > 0) ||
            !!gv.totals ||
            !!gv.activitySummary ||
            !!gv.lastActiveAt;
          return hasGithubData;
        })() && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-slate-200/80">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-900">GitHub verification</h3>
              {typeof candidate.githubVerification?.contributionBonus === "number" && (
                <span className="ml-auto px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  +{candidate.githubVerification.contributionBonus} Bonus Points
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">GitHub profile:</p>
                <a
                  href={candidate.githubVerification.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-2"
                >
                  {candidate.githubVerification.githubUrl}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Verification score:</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                      style={{ width: `${(((candidate.githubVerification?.verificationScore) ?? 0) / 20) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-800">
                    {(candidate.githubVerification?.verificationScore ?? 0)}/20
                  </span>
                </div>
              </div>

              {candidate.githubVerification.lastActiveAt && (
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-7a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Last active: {new Date(candidate.githubVerification.lastActiveAt).toLocaleString()}</span>
                </div>
              )}

              {candidate.githubVerification.totals && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-lg">
                    ★ Stars: {candidate.githubVerification.totals.stars}
                  </span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg">
                    Forks: {candidate.githubVerification.totals.forks}
                  </span>
                </div>
              )}

              {candidate.githubVerification.topLanguages?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Top languages</p>
                  <div className="flex flex-wrap gap-2">
                    {candidate.githubVerification.topLanguages.map((l: any, idx: number) => (
                      <span key={idx} className="px-3 py-1 rounded-lg text-sm bg-indigo-100 text-indigo-800 font-medium">
                        {l.language} • {l.percentage}%
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {candidate.githubVerification.activitySummary && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                  <div className="rounded-lg bg-slate-50 p-3 text-center">
                    <div className="text-xs text-slate-500">PR Opened</div>
                    <div className="text-sm font-semibold text-slate-900">{candidate.githubVerification.activitySummary.prOpened}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 text-center">
                    <div className="text-xs text-slate-500">PR Merged</div>
                    <div className="text-sm font-semibold text-slate-900">{candidate.githubVerification.activitySummary.prMerged}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 text-center">
                    <div className="text-xs text-slate-500">Issues</div>
                    <div className="text-sm font-semibold text-slate-900">{candidate.githubVerification.activitySummary.issuesOpened}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 text-center">
                    <div className="text-xs text-slate-500">Commits</div>
                    <div className="text-sm font-semibold text-slate-900">{candidate.githubVerification.activitySummary.commits}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 text-center">
                    <div className="text-xs text-slate-500">Repos</div>
                    <div className="text-sm font-semibold text-slate-900">{candidate.githubVerification.activitySummary.repositoriesContributedTo}</div>
                  </div>
                </div>
              )}

              {candidate.githubVerification.topRepos?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Top repositories</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {candidate.githubVerification.topRepos.map((repo: any, idx: number) => (
                      <div key={idx} className="rounded-lg border border-slate-200 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-900">{repo.name}</span>
                          <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">★ {repo.stars}</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">{repo.language || "Unknown"}</div>
                        {repo.description && (
                          <div className="text-xs text-slate-500 mt-1">{repo.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {candidate.githubVerification.projectsVerified?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verified Projects ({candidate.githubVerification.projectsVerified.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {candidate.githubVerification.projectsVerified.map((project: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 rounded-lg text-sm bg-green-100 text-green-800 font-medium">
                        ✓ {project}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200/80">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-lg font-semibold text-slate-900">AI-generated summary</h3>
          </div>
          <div className="bg-gradient-to-br from-indigo-50/80 to-slate-50 p-6 rounded-xl border border-indigo-200/80">
            <p className="text-sm text-gray-700 leading-relaxed">{candidate.summary || "No AI summary available."}</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
