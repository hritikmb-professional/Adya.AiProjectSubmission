import { useState } from "react"
import { signup } from "../api/auth"
import { useNavigate, Link } from "react-router-dom"

export default function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validateEmail = (e: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  }

  const validatePassword = (pass: string) => {
    const hasLetter = /[a-zA-Z]/.test(pass)
    const hasNumber = /[0-9]/.test(pass)
    const hasMinLength = pass.length >= 8
    return {
      hasLetter,
      hasNumber,
      hasMinLength,
      isValid: hasLetter && hasNumber && hasMinLength,
    }
  }

  const validation = validatePassword(password)
  const emailValid = validateEmail(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!emailValid) {
      alert("Invalid email address")
      return
    }

    if (!validation.isValid) {
      alert("Password does not meet requirements")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      setLoading(true)
      await signup(name, email, password)
      navigate("/")
    } catch {
      alert("Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-fuchsia-400/30 to-indigo-400/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-br from-indigo-400/30 to-blue-400/30 blur-3xl" />
      </div>
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-indigo-600 text-white shadow-xl shadow-fuchsia-500/30 mb-6">
            <svg viewBox="0 0 24 24" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="sr-signup" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="1" stopColor="#e2e8f0" />
                </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="10" fill="url(#sr-signup)" opacity="0.15" />
              <path d="M7 13.5l3 3 7-7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M5.5 7.5l1.5.5-.5 1.5-1.5-.5.5-1.5z" fill="white" />
              <path d="M16.5 6.5l1 .3-.3 1-1-.3.3-1z" fill="white" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-slate-600">
            Start hiring smarter with SmartRecruit
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs">
            <span className="px-2 py-1 rounded-full bg-fuchsia-100 text-fuchsia-700">Collaborative</span>
            <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">Insightful</span>
            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">Fast setup</span>
          </div>
        </div>

        <button
          type="button"
          className="w-full mb-4 py-3.5 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42v-0.083H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24 s8.955,20,20,20s20-8.955,20-20C44,22.724,43.871,21.383,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.816C14.071,16.158,18.683,14,24,14c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C34.046,6.053,29.268,4,24,4C15.314,4,7.75,8.946,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.176,0,9.86-1.977,13.409-5.196l-6.196-5.238C29.121,35.863,26.681,36.8,24,36.8 c-5.188,0-9.592-3.317-11.253-7.946l-6.498,5.012C8.646,39.556,15.742,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42v-0.083H24v8h11.303c-0.794,2.24-2.231,4.207-4.094,5.64l6.196,5.238 C39.27,36.965,44,31.999,44,24C44,22.724,43.871,21.383,43.611,20.083z"/></svg>
          Continue with Google
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-slate-500">or continue with email</span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-8"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full name
              </label>
              <input
                type="text"
                placeholder="Jane Doe"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {email && !emailValid && (
                <p className="mt-2 text-sm text-rose-600">Invalid email address</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c-1.657 0-3 1.343-3 3v4h6v-4c0-1.657-1.343-3-3-3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 10-10 0v2" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full pl-11 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="mt-3 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${validation.isValid ? "w-11/12 bg-emerald-500" : validation.hasLetter && validation.hasNumber ? "w-8/12 bg-indigo-500" : validation.hasMinLength ? "w-5/12 bg-blue-500" : "w-2/12 bg-slate-300"}`}
                />
              </div>
              {password && (
                <div className="mt-3 space-y-2">
                  {[
                    { valid: validation.hasMinLength, label: "At least 8 characters" },
                    { valid: validation.hasLetter, label: "Contains letters" },
                    { valid: validation.hasNumber, label: "Contains numbers" },
                  ].map(({ valid, label }) => (
                    <div key={label} className="flex items-center gap-2 text-sm">
                      <span className={valid ? "text-emerald-500" : "text-slate-400"}>
                        {valid ? "✓" : "○"}
                      </span>
                      <span className={valid ? "text-emerald-700" : "text-slate-500"}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm font-medium"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-2 text-sm text-rose-600">Passwords do not match</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:from-indigo-700 hover:to-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Sign in
            </Link>
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-slate-50 p-3">
              <span className="text-xs text-slate-600">Calendar interviews</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <span className="text-xs text-slate-600">AI matching</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <span className="text-xs text-slate-600">Secure data</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
