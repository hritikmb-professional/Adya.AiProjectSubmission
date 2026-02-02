import { useNavigate } from "react-router-dom"

export default function JobCard({ job }: { job: any }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/jobs/${job._id}`)}
      className="border p-4 rounded cursor-pointer hover:bg-gray-50"
    >
      <h3 className="font-bold">{job.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">
        {job.description}
      </p>
    </div>
  )
}
