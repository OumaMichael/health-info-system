const ProgramsList = ({ programs = [] }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Available Programs</h2>
      <div className="space-y-4">
        {programs.length > 0 ? (
          programs.map((program) => (
            <div key={program.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-lg font-bold">{program.name}</h3>
              <p className="text-gray-400 mt-2">{program.description || "No description available."}</p>
              <p className="text-xs text-gray-500 mt-2">Created: {new Date(program.created_at).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-gray-400">No programs available. Create your first program!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProgramsList
