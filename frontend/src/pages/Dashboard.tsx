import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getJobs } from "../api/jobs"
import JobCard from "../components/JobCard"
import CreateJob from "../components/CreateJob"

export default function Dashboard() {
  const [jobs, setJobs] = useState<any[]>([])
  const navigate = useNavigate()

  const loadJobs = async () => {
    const res = await getJobs()
    setJobs(res.data)
  }

  useEffect(() => {
    loadJobs()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">
        Dashboard
      </h1>

      <CreateJob onCreated={loadJobs} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {jobs.map(job => (
          <JobCard
            key={job._id}
            job={job}
            
          />
        ))}
      </div>
    </div>
  )
}

