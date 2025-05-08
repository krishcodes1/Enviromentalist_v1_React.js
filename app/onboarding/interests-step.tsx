"use client"

interface InterestsStepProps {
  interests: string[]
  onToggle: (interest: string) => void
}

export function InterestsStep({ interests, onToggle }: InterestsStepProps) {
  const interestOptions = [
    { id: "cleanup", label: "Clean-ups" },
    { id: "planting", label: "Tree Planting" },
    { id: "recycling", label: "Recycling" },
    { id: "conservation", label: "Conservation" },
    { id: "education", label: "Environmental Education" },
    { id: "sustainable", label: "Sustainable Living" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">What are you interested in?</h1>
      <p className="text-gray-600 text-center mb-6">
        Select topics you're passionate about to personalize your experience.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {interestOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onToggle(option.id)}
            className={`p-3 rounded-lg border ${
              interests.includes(option.id)
                ? "border-primary bg-primary/10 text-primary"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
