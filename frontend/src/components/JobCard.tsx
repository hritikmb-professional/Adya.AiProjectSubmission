import { useState } from "react"
import api from "../api/axios"

export default function JobCard({
  job,
  onClick,
  onComplete,
}: {
  job: any
  onClick: () => void
  onComplete?: () => void
}) {
  const [completing, setCompleting] = useState(false)

  const handleCompleteRecruitment = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!confirm("This will send status emails to all candidates. Continue?")) {
      return
    }

    try {
      setCompleting(true)
      const res = await api.post(`/jobs/${job._id}/complete`)
      alert(`Recruitment completed! ${res.data.emailsSent} emails sent successfully.`)
      if (onComplete) onComplete()
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to complete recruitment")
    } finally {
      setCompleting(false)
    }
  }

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-200/80 p-6 transition-all duration-300 cursor-pointer"
    >
      <div className="flex-1 min-h-0">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center text-indigo-600 group-hover:from-indigo-200 group-hover:to-indigo-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
              {job.title}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">
              {job.description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-5 mt-5 border-t border-slate-100">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          View details
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          onClick={handleCompleteRecruitment}
          disabled={completing}
          className="px-4 py-2 text-sm font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {completing ? "Sending..." : "Release results"}
        </button>
      </div>
    </div>
  )
}
