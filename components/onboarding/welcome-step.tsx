export function WelcomeStep() {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M40 12C36.5 20.5 28.5 26.5 20 30C20 48.5 28 62 40 68C52 62 60 48.5 60 30C51.5 26.5 43.5 20.5 40 12Z"
            stroke="#0c5727"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M40 26C38.5 30 34.5 32.5 31 34C31 42.5 34.5 48.5 40 51C45.5 48.5 49 42.5 49 34C45.5 32.5 41.5 30 40 26Z"
            stroke="#0c5727"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-4 text-[#093923]">Welcome Back!</h1>
      <p className="text-gray-600">
        Join our community of people making a difference for our planet. Let's work together to create a more
        sustainable future.
      </p>
    </div>
  )
}
