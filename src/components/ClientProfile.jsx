const ClientProfile = ({ client }) => {
    if (!client) {
      return <p className="text-gray-400 p-4">Loading client details...</p>
    }
  
    return (
      <div className="space-y-6">
        {/* Client Basic Information */}
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Full Name</p>
              <p className="font-medium">
                {client.first_name} {client.last_name}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Gender</p>
              <p className="font-medium">{client.gender}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Date of Birth</p>
              <p className="font-medium">{client.date_of_birth}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Contact Number</p>
              <p className="font-medium">{client.contact_number || "Not provided"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-400 text-sm">Address</p>
              <p className="font-medium">{client.address || "Not provided"}</p>
            </div>
          </div>
        </div>
  
        {/* Enrolled Programs */}
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Enrolled Programs</h3>
          {client.enrolled_programs && client.enrolled_programs.length > 0 ? (
            <div className="space-y-3">
              {client.enrolled_programs.map((program) => (
                <div key={program.id} className="p-3 bg-gray-700 rounded border border-gray-600">
                  <h4 className="font-medium">{program.name}</h4>
                  <p className="text-sm text-gray-400 mt-1">{program.description || "No description available"}</p>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Status: {program.status}</span>
                    <span>Enrolled: {new Date(program.enrollment_date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Client is not enrolled in any programs yet.</p>
          )}
        </div>
  
        {/* Client Registration Info */}
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Registration Information</h3>
          <p className="text-gray-400 text-sm">Client ID</p>
          <p className="font-medium mb-2">{client.id}</p>
          <p className="text-gray-400 text-sm">Registration Date</p>
          <p className="font-medium">{new Date(client.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    )
  }
  
  export default ClientProfile
  