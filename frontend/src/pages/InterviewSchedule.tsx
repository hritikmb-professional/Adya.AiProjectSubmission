import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Layout from "../components/Layout"
import { getSlots, scheduleInterview, generateSlots, listOpenSlots, bookSlot } from "../api/interviews"

export default function InterviewSchedule() {
  const [params] = useSearchParams()
  const jobId = params.get("jobId") || ""
  const candidateId = params.get("candidateId") || ""

  const [interviewerEmail, setInterviewerEmail] = useState("")
  const [dateISO, setDateISO] = useState(() => new Date().toISOString().slice(0, 10))
  const [durationMinutes, setDurationMinutes] = useState(30)
  const [slots, setSlots] = useState<{ start: string; end: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [openSlots, setOpenSlots] = useState<{ id: string; start: string; end: string }[]>([])
  const [generating, setGenerating] = useState(false)

  const loadSlots = async () => {
    try {
      setLoading(true)
      const res = await getSlots({
        dateISO: new Date(dateISO).toISOString(),
        durationMinutes
      })
      setSlots(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSlots()
    loadOpenSlots()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateISO, durationMinutes])

  const loadOpenSlots = async () => {
    const res = await listOpenSlots({ dateISO: new Date(dateISO).toISOString() })
    setOpenSlots(res.data)
  }

  const generate = async () => {
    try {
      setGenerating(true)
      setMessage("")
      const res = await generateSlots({
        startDateISO: new Date(dateISO).toISOString(),
        endDateISO: new Date(dateISO).toISOString(),
        durationMinutes
      })
      await loadOpenSlots()
      await loadSlots()
      const created = (res as any).data?.created ?? 0
      setMessage(created > 0 ? `Slots generated: ${created}` : "No free slots found to generate")
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to generate slots"
      setMessage(msg)
    } finally {
      setGenerating(false)
    }
  }

  const book = async (id: string) => {
    if (!interviewerEmail || !jobId || !candidateId) {
      setMessage("Please fill interviewer email and ensure jobId, candidateId are present")
      return
    }
    setMessage("")
    await bookSlot(id, {
      candidateId,
      jobId,
      interviewerEmail
    })
    await loadOpenSlots()
    setMessage("Slot booked and invites sent")
  }

  const schedule = async (start: string, end: string) => {
    if (!interviewerEmail || !jobId || !candidateId) {
      setMessage("Please fill interviewer email and ensure jobId, candidateId are present")
      return
    }
    setMessage("")
    await scheduleInterview({
      candidateId,
      jobId,
      interviewerEmail,
      startISO: start,
      endISO: end,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    })
    setMessage("Interview scheduled and invites sent")
  }

  return (
    <Layout showBack backLabel="Back">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Interview Scheduling</h1>
        <p className="text-slate-600 mb-6">Pick a date and slot to schedule an interview</p>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
              <input
                type="date"
                value={dateISO}
                onChange={e => setDateISO(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Duration (min)</label>
              <select
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-md border border-slate-200"
              >
                <option value={30}>30</option>
                <option value={45}>45</option>
                <option value={60}>60</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Interviewer Email</label>
              <input
                type="email"
                placeholder="interviewer@company.com"
                value={interviewerEmail}
                onChange={e => setInterviewerEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-slate-200"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={loadSlots}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white"
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh Slots"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Available Slots</h2>
          {slots.length === 0 ? (
            <p className="text-slate-500">No available slots for this day.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {slots.map((s, i) => (
                <button
                  key={i}
                  onClick={() => schedule(s.start, s.end)}
                  className="text-left p-4 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50"
                >
                  <div className="text-slate-900 font-medium">
                    {new Date(s.start).toLocaleTimeString()} - {new Date(s.end).toLocaleTimeString()}
                  </div>
                  <div className="text-slate-500 text-sm">
                    {new Date(s.start).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900">My Open Slots</h2>
            <button
              onClick={generate}
              className={`px-4 py-2 rounded-md ${generating ? "bg-indigo-400" : "bg-indigo-600"} text-white`}
              disabled={generating}
            >
              {generating ? "Generating..." : "Generate Slots For Day"}
            </button>
          </div>
          {openSlots.length === 0 ? (
            <p className="text-slate-500">No open slots for this day.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {openSlots.map((s) => (
                <button
                  key={s.id}
                  onClick={() => book(s.id)}
                  className="text-left p-4 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50"
                >
                  <div className="text-slate-900 font-medium">
                    {new Date(s.start).toLocaleTimeString()} - {new Date(s.end).toLocaleTimeString()}
                  </div>
                  <div className="text-slate-500 text-sm">
                    {new Date(s.start).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {message && (
          <div className="mt-6 p-4 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            {message}
          </div>
        )}
      </div>
    </Layout>
  )
}
