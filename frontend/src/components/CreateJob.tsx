import { useState } from "react"
import { createJob } from "../api/jobs"

export default function CreateJob({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    await createJob({ title, description })
    setTitle("")
    setDescription("")
    onCreated()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow mb-6"
    >
      <h3 className="font-bold mb-2">Create Job</h3>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Job Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Job Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={4}
        required
      />

      <button className="bg-black text-white px-4 py-2">
        Create
      </button>
    </form>
  )
}
