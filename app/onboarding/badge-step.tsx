export function BadgeStep() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Get Your Own Badge</h1>
      <div className="flex justify-center mb-6">
        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
          </svg>
        </div>
      </div>
      <p className="text-gray-600">
        Complete activities and earn badges to showcase your environmental impact and inspire others.
      </p>
    </div>
  )
}
