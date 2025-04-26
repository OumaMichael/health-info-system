from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import uuid
import os
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize data storage (in a real app, use a proper database)
DATA_DIR = 'data'
os.makedirs(DATA_DIR, exist_ok=True)

CLIENTS_FILE = os.path.join(DATA_DIR, 'clients.json')
PROGRAMS_FILE = os.path.join(DATA_DIR, 'programs.json')
ENROLLMENTS_FILE = os.path.join(DATA_DIR, 'enrollments.json')

# Initialize data files if they don't exist
def init_data_files():
    if not os.path.exists(CLIENTS_FILE):
        with open(CLIENTS_FILE, 'w') as f:
            json.dump([], f)
    
    if not os.path.exists(PROGRAMS_FILE):
        with open(PROGRAMS_FILE, 'w') as f:
            json.dump([], f)
            
    if not os.path.exists(ENROLLMENTS_FILE):
        with open(ENROLLMENTS_FILE, 'w') as f:
            json.dump([], f)

# Helper functions for data operations
def read_data(file_path):
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except:
        return []

def write_data(file_path, data):
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)

# Initialize data files
init_data_files()

# API Routes
@app.route('/api/clients', methods=['GET', 'POST'])
def handle_clients():
    if request.method == 'GET':
        clients = read_data(CLIENTS_FILE)
        return jsonify(clients)
    
    elif request.method == 'POST':
        new_client = request.json
        new_client['id'] = str(uuid.uuid4())
        
        clients = read_data(CLIENTS_FILE)
        clients.append(new_client)
        write_data(CLIENTS_FILE, clients)
        
        return jsonify({'id': new_client['id'], 'message': 'Client registered successfully'}), 201

@app.route('/api/clients/<client_id>', methods=['GET'])
def get_client(client_id):
    clients = read_data(CLIENTS_FILE)
    client = next((c for c in clients if c['id'] == client_id), None)
    
    if client:
        return jsonify(client)
    else:
        return jsonify({'message': 'Client not found'}), 404

@app.route('/api/programs', methods=['GET', 'POST'])
def handle_programs():
    if request.method == 'GET':
        programs = read_data(PROGRAMS_FILE)
        return jsonify(programs)
    
    elif request.method == 'POST':
        new_program = request.json
        new_program['id'] = str(uuid.uuid4())
        
        programs = read_data(PROGRAMS_FILE)
        programs.append(new_program)
        write_data(PROGRAMS_FILE, programs)
        
        return jsonify({'id': new_program['id'], 'message': 'Program created successfully'}), 201

@app.route('/api/enrollments', methods=['POST'])
def create_enrollment():
    enrollment_data = request.json
    client_id = enrollment_data.get('clientId')
    program_id = enrollment_data.get('programId')
    
    # Validate client and program exist
    clients = read_data(CLIENTS_FILE)
    programs = read_data(PROGRAMS_FILE)
    
    client = next((c for c in clients if c['id'] == client_id), None)
    program = next((p for p in programs if p['id'] == program_id), None)
    
    if not client:
        return jsonify({'message': 'Client not found'}), 404
    if not program:
        return jsonify({'message': 'Program not found'}), 404
    
    # Create enrollment record
    new_enrollment = {
        'id': str(uuid.uuid4()),
        'clientId': client_id,
        'programId': program_id,
        'enrollmentDate': datetime.now().isoformat()
    }
    
    enrollments = read_data(ENROLLMENTS_FILE)
    enrollments.append(new_enrollment)
    write_data(ENROLLMENTS_FILE, enrollments)
    
    return jsonify({'id': new_enrollment['id'], 'message': 'Client enrolled successfully'}), 201

@app.route('/api/clients/<client_id>/programs', methods=['GET'])
def get_client_programs(client_id):
    # Validate client exists
    clients = read_data(CLIENTS_FILE)
    client = next((c for c in clients if c['id'] == client_id), None)
    
    if not client:
        return jsonify({'message': 'Client not found'}), 404
    
    # Get enrollments for this client
    enrollments = read_data(ENROLLMENTS_FILE)
    client_enrollments = [e for e in enrollments if e['clientId'] == client_id]
    
    # Get program details for each enrollment
    programs = read_data(PROGRAMS_FILE)
    
    result = []
    for enrollment in client_enrollments:
        program = next((p for p in programs if p['id'] == enrollment['programId']), None)
        if program:
            result.append({
                'id': enrollment['id'],
                'programId': program['id'],
                'programName': program['name'],
                'programDescription': program['description'],
                'enrollmentDate': enrollment['enrollmentDate']
            })
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)