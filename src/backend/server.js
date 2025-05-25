import express from "express"
import cors from "cors"
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

// Setup paths
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const BASE_DIR = __dirname
const DATA_DIR = path.join(BASE_DIR, "data")
const CLIENTS_FILE = path.join(DATA_DIR, "clients.json")
const PROGRAMS_FILE = path.join(DATA_DIR, "programs.json")
const ENROLLMENTS_FILE = path.join(DATA_DIR, "enrollments.json")

// Initialize data directory and files
async function initializeDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    console.log(`📁 Data directory created/verified: ${DATA_DIR}`)

    for (const filePath of [CLIENTS_FILE, PROGRAMS_FILE, ENROLLMENTS_FILE]) {
      try {
        await fs.access(filePath)
        console.log(`✅ Found existing file: ${path.basename(filePath)}`)
      } catch {
        await fs.writeFile(filePath, JSON.stringify([], null, 2))
        console.log(`📄 Created new file: ${path.basename(filePath)}`)
      }
    }
  } catch (error) {
    console.error("❌ Error initializing data files:", error)
  }
}

// Data operations
async function loadData(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error(`❌ Error loading data from ${filePath}:`, error)
    return []
  }
}

async function saveData(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
    console.log(`💾 Data saved to ${path.basename(filePath)}`)
  } catch (error) {
    console.error(`❌ Error saving data to ${filePath}:`, error)
    throw error
  }
}

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(cors())

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path} - ${new Date().toISOString()}`)
  next()
})

// Root route for testing
app.get("/", (req, res) => {
  res.json({
    message: "Health Information System API is running!",
    status: "OK",
    endpoints: [
      "GET /api/clients",
      "POST /api/clients",
      "GET /api/programs",
      "POST /api/programs", 
      "GET /api/enrollments",
      "POST /api/enrollments"
    ],
    timestamp: new Date().toISOString()
  })
})

// ─── Clients ────────────────────────────────────────────────────────────────────

// GET /api/clients - Get all clients with optional search
app.get("/api/clients", async (req, res) => {
  try {
    console.log("🔍 Fetching clients...")
    let clients = await loadData(CLIENTS_FILE)
    const searchQuery = req.query.search?.trim().toLowerCase()

    if (searchQuery) {
      clients = clients.filter(
        (client) =>
          client.first_name.toLowerCase().includes(searchQuery) || 
          client.last_name.toLowerCase().includes(searchQuery)
      )
      console.log(`🔍 Search query: "${searchQuery}", found ${clients.length} results`)
    }

    console.log(`✅ Returning ${clients.length} clients`)
    res.json(clients)
  } catch (error) {
    console.error("❌ Error fetching clients:", error)
    res.status(500).json({ error: "Failed to fetch clients" })
  }
})

// POST /api/clients - Create new client
app.post("/api/clients", async (req, res) => {
  try {
    console.log("📝 Creating new client:", req.body)
    const { first_name, last_name, date_of_birth, gender, contact_number, address } = req.body

    // Validate required fields
    if (!first_name || !last_name || !date_of_birth || !gender) {
      console.log("❌ Missing required fields")
      return res.status(400).json({
        error: "Missing required fields: first_name, last_name, date_of_birth, gender",
      })
    }

    const clients = await loadData(CLIENTS_FILE)
    const newId = Math.max(...clients.map((c) => c.id), 0) + 1

    const newClient = {
      id: newId,
      first_name,
      last_name,
      date_of_birth,
      gender,
      contact_number: contact_number || "",
      address: address || "",
      created_at: new Date().toISOString(),
    }

    clients.push(newClient)
    await saveData(CLIENTS_FILE, clients)

    console.log(`✅ Created client with ID: ${newId}`)
    res.status(201).json({ id: newId, message: "Client created successfully", client: newClient })
  } catch (error) {
    console.error("❌ Error creating client:", error)
    res.status(500).json({ error: "Failed to create client" })
  }
})

// ─── Programs ───────────────────────────────────────────────────────────────────

// GET /api/programs - Get all programs
app.get("/api/programs", async (req, res) => {
  try {
    console.log("🔍 Fetching programs...")
    const programs = await loadData(PROGRAMS_FILE)
    console.log(`✅ Returning ${programs.length} programs`)
    res.json(programs)
  } catch (error) {
    console.error("❌ Error fetching programs:", error)
    res.status(500).json({ error: "Failed to fetch programs" })
  }
})

// POST /api/programs - Create new program
app.post("/api/programs", async (req, res) => {
  try {
    console.log("📝 Creating new program:", req.body)
    const { name, description } = req.body

    if (!name) {
      console.log("❌ Program name required")
      return res.status(400).json({ error: "Program name required" })
    }

    const programs = await loadData(PROGRAMS_FILE)
    const newId = Math.max(...programs.map((p) => p.id), 0) + 1

    const newProgram = {
      id: newId,
      name,
      description: description || "",
      created_at: new Date().toISOString(),
    }

    programs.push(newProgram)
    await saveData(PROGRAMS_FILE, programs)

    console.log(`✅ Created program with ID: ${newId}`)
    res.status(201).json(newProgram)
  } catch (error) {
    console.error("❌ Error creating program:", error)
    res.status(500).json({ error: "Failed to create program" })
  }
})

// ─── Enrollments ────────────────────────────────────────────────────────────────

// GET /api/enrollments - Get all enrollments
app.get("/api/enrollments", async (req, res) => {
  try {
    console.log("🔍 Fetching enrollments...")
    const enrollments = await loadData(ENROLLMENTS_FILE)
    console.log(`✅ Returning ${enrollments.length} enrollments`)
    res.json(enrollments)
  } catch (error) {
    console.error("❌ Error fetching enrollments:", error)
    res.status(500).json({ error: "Failed to fetch enrollments" })
  }
})

// POST /api/enrollments - Create new enrollment
app.post("/api/enrollments", async (req, res) => {
  try {
    console.log("📝 Creating new enrollment:", req.body)
    const { client_id, program_id } = req.body

    if (!client_id || !program_id) {
      console.log("❌ client_id and program_id required")
      return res.status(400).json({ error: "client_id and program_id required" })
    }

    // Check if client exists
    const clients = await loadData(CLIENTS_FILE)
    if (!clients.find((c) => c.id === client_id)) {
      console.log(`❌ Client not found: ${client_id}`)
      return res.status(404).json({ error: "Client not found" })
    }

    // Check if program exists
    const programs = await loadData(PROGRAMS_FILE)
    if (!programs.find((p) => p.id === program_id)) {
      console.log(`❌ Program not found: ${program_id}`)
      return res.status(404).json({ error: "Program not found" })
    }

    // Check if already enrolled
    const enrollments = await loadData(ENROLLMENTS_FILE)
    if (enrollments.find((e) => e.client_id === client_id && e.program_id === program_id)) {
      console.log(`❌ Already enrolled: client ${client_id} in program ${program_id}`)
      return res.status(400).json({ error: "Already enrolled" })
    }

    const newEnrollment = {
      client_id,
      program_id,
      enrollment_date: new Date().toISOString(),
      status: "active",
    }

    enrollments.push(newEnrollment)
    await saveData(ENROLLMENTS_FILE, enrollments)

    console.log(`✅ Enrollment successful: client ${client_id} in program ${program_id}`)
    res.status(201).json(newEnrollment)
  } catch (error) {
    console.error("❌ Error creating enrollment:", error)
    res.status(500).json({ error: "Failed to create enrollment" })
  }
})

// 404 handler for unmatched routes
app.use("*", (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`)
  res.status(404).json({ 
    error: "Route not found",
    method: req.method,
    path: req.originalUrl,
    available_endpoints: [
      "GET /",
      "GET /api/clients",
      "POST /api/clients",
      "GET /api/programs",
      "POST /api/programs", 
      "GET /api/enrollments",
      "POST /api/enrollments"
    ]
  })
})

// Start server
async function startServer() {
  await initializeDataFiles()

  app.listen(PORT, () => {
    console.log("\n" + "=".repeat(50))
    console.log(`🚀 Health Info System Backend RUNNING`)
    console.log(`📍 Server URL: http://localhost:${PORT}`)
    console.log(`📁 Data directory: ${DATA_DIR}`)
    console.log("=".repeat(50))
    console.log("\n📋 Available API Endpoints:")
    console.log(`   GET    http://localhost:${PORT}/`)
    console.log(`   GET    http://localhost:${PORT}/api/clients`)
    console.log(`   POST   http://localhost:${PORT}/api/clients`)
    console.log(`   GET    http://localhost:${PORT}/api/programs`)
    console.log(`   POST   http://localhost:${PORT}/api/programs`)
    console.log(`   GET    http://localhost:${PORT}/api/enrollments`)
    console.log(`   POST   http://localhost:${PORT}/api/enrollments`)
    console.log("\n🔧 Test the API by visiting: http://localhost:" + PORT)
    console.log("=".repeat(50) + "\n")
  })
}

startServer().catch(console.error)