"use client"

function QuickActionCard({ icon, title, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 text-left"
    >
      <div className="flex items-center mb-2">
        <span className="mr-2">
          {icon === "user-plus" && "👤+"}
          {icon === "plus-circle" && "⊕"}
          {icon === "search" && "🔍"}
          {icon === "list" && "📋"}
        </span>
        <h4 className="font-bold">{title}</h4>
      </div>
      <p className="text-sm text-gray-400">{description}</p>
    </button>
  )
}

export default QuickActionCard
