# Health Information System

A full-stack web application for managing health program clients and enrollments.

## Project Structure

```
health-information-system/
├── frontend/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── RegisterClient.js
│   │   │   ├── CreateProgram.js
│   │   │   ├── EnrollClient.js
│   │   │   ├── SearchClients.js
│   │   │   └── ClientProfile.js
│   │   ├── App.js            # Main App component
│   │   ├── index.js          # React entry point
│   │   └── index.css         # Global styles
│   ├── package.json
│   └── README.md
│
└── backend/                  # Flask API backend
    ├── app.py                # Main Flask application
    ├── data/                 # Data storage directory
    │   ├── clients.json
    │   ├── programs.json
    │   └── enrollments.json
    ├── requirements.txt
    └── README.md
```

## Backend Setup

1. Create a virtual environment and activate it:

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install required packages:

   ```bash
   pip install flask flask-cors
   ```

3. Run the Flask application:

   ```bash
   python app.py
   ```

   The API will be available at [http://localhost:5000](http://localhost:5000).

## Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

## API Endpoints

- `GET /api/clients` - Get all clients
- `POST /api/clients` - Register a new client
- `GET /api/clients/:id` - Get specific client details
- `GET /api/clients/:id/programs` - Get programs a client is enrolled in
- `GET /api/programs` - Get all health programs
- `POST /api/programs` - Create a new health program
- `POST /api/enrollments` - Enroll a client in a program