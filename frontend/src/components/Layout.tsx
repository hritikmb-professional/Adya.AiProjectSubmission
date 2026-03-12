import type { ReactNode } from "react"
import { useNavigate, Link } from "react-router-dom"

export default function Layout({
  children,
  showBack,
  backLabel = "Back",
}: {
  children: ReactNode
  showBack?: boolean
  backLabel?: string
}) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {showBack && (
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors py-2 px-3 -ml-3 rounded-lg hover:bg-slate-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {backLabel}
                </button>
              )}
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-xl font-bold text-slate-900 tracking-tight hover:text-indigo-600 transition-colors"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-indigo-600 text-white shadow-lg shadow-fuchsia-500/30">
                  <svg viewBox="0 0 24 24" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="sr" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#ffffff" />
                        <stop offset="1" stopColor="#e2e8f0" />
                      </linearGradient>
                    </defs>
                    <circle cx="12" cy="12" r="10" fill="url(#sr)" opacity="0.15" />
                    <path d="M7 13.5l3 3 7-7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <path d="M5.5 7.5l1.5.5-.5 1.5-1.5-.5.5-1.5z" fill="white" />
                    <path d="M16.5 6.5l1 .3-.3 1-1-.3.3-1z" fill="white" />
                  </svg>
                </span>
                SmartRecruit
              </Link>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("token")
                navigate("/")
              }}
              className="text-slate-600 hover:text-slate-900 font-medium text-sm px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
