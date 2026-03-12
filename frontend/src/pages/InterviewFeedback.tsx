import { useParams } from "react-router-dom"
import { useState } from "react"
import Layout from "../components/Layout"
import { submitFeedback } from "../api/interviews"

export default function InterviewFeedback() {
  const { id } = useParams()
  const [rating, setRating] = useState(5)
  const [comments, setComments] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setLoading(true)
    try {
      await submitFeedback(id, { rating, comments })
      setMessage("Feedback submitted")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout showBack backLabel="Back">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Interview Feedback</h1>
        <p className="text-slate-600 mb-6">Share feedback after the interview</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
            <select
              value={rating}
              onChange={e => setRating(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-md border border-slate-200"
            >
              {[5,4,3,2,1].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Comments</label>
            <textarea
              value={comments}
              onChange={e => setComments(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-slate-200 h-32"
              placeholder="Your notes, strengths, concerns..."
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-indigo-600 text-white"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            {message}
          </div>
        )}
      </div>
    </Layout>
  )
}

