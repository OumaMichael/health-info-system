"use client"

function SidebarLink({ active, onClick, icon, text }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-3 mb-1 rounded-md text-left ${
        active ? "bg-gray-800" : "hover:bg-gray-800"
      }`}
    >
      <span className="mr-3">
        {icon === "home" && "🏠"}
        {icon === "clipboard" && "📋"}
        {icon === "plus-circle" && "⊕"}
        {icon === "users" && "👥"}
        {icon === "user-plus" && "👤+"}
      </span>
      {text}
    </button>
  )
}

export default SidebarLink
