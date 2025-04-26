import os
import json
from datetime import datetime
from flask import Flask, jsonify, request, abort
from flask_cors import CORS

# ─── Setup ──────────────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
CLIENTS_FILE    = os.path.join(DATA_DIR, 'clients.json')
PROGRAMS_FILE   = os.path.join(DATA_DIR, 'programs.json')
ENROLLMENTS_FILE= os.path.join(DATA_DIR, 'enrollments.json')

os.makedirs(DATA_DIR, exist_ok=True)
for path in (CLIENTS_FILE, PROGRAMS_FILE, ENROLLMENTS_FILE):
    if not os.path.exists(path):
        with open(path,'w') as f:
            json.dump([], f, indent=2)

def load_data(path):
    with open(path,'r') as f:
        return json.load(f)

def save_data(path, data):
    with open(path,'w') as f:
        json.dump(data, f, indent=2)

app = Flask(__name__)
# ← This single line opens CORS for *all* origins on /api/*
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ─── Clients ────────────────────────────────────────────────────────────────────
@app.route('/api/clients', methods=['GET'])
def get_clients():
    clients = load_data(CLIENTS_FILE)
    q = request.args.get('search', '').strip().lower()
    if q:
        clients = [c for c in clients
                   if q in c['first_name'].lower()
                   or q in c['last_name'].lower()]
    return jsonify(clients)

@app.route('/api/clients/<int:client_id>', methods=['GET'])
def get_client(client_id):
    clients = load_data(CLIENTS_FILE)
    client = next((c for c in clients if c['id']==client_id), None)
    if not client:
        abort(404, 'Client not found')
    programs   = load_data(PROGRAMS_FILE)
    enrolls    = load_data(ENROLLMENTS_FILE)
    client['enrolled_programs'] = [
        {
          'id': p['id'],
          'name': p['name'],
          'description': p.get('description',''),
          'enrollment_date': e['enrollment_date'],
          'status': e.get('status','active')
        }
        for e in enrolls if e['client_id']==client_id
        for p in programs  if p['id']==e['program_id']
    ]
    return jsonify(client)

@app.route('/api/clients', methods=['POST'])
def create_client():
    data = request.get_json() or {}
    for field in ('first_name','last_name','date_of_birth','gender'):
        if not data.get(field):
            abort(400, f"Missing {field}")
    clients = load_data(CLIENTS_FILE)
    new_id = max((c['id'] for c in clients), default=0) + 1
    new_client = {
        'id': new_id,
        'first_name': data['first_name'],
        'last_name': data['last_name'],
        'date_of_birth': data['date_of_birth'],
        'gender': data['gender'],
        'contact_number': data.get('contact_number',''),
        'address': data.get('address',''),
        'created_at': datetime.utcnow().isoformat()
    }
    clients.append(new_client)
    save_data(CLIENTS_FILE, clients)
    return jsonify({'id': new_id}), 201

# ─── Programs ───────────────────────────────────────────────────────────────────
@app.route('/api/programs', methods=['GET'])
def get_programs():
    return jsonify(load_data(PROGRAMS_FILE))

@app.route('/api/programs', methods=['POST'])
def create_program():
    data = request.get_json() or {}
    if not data.get('name'):
        abort(400, 'Program name required')
    programs = load_data(PROGRAMS_FILE)
    new_id   = max((p['id'] for p in programs), default=0) + 1
    prog = {
        'id': new_id,
        'name': data['name'],
        'description': data.get('description',''),
        'created_at': datetime.utcnow().isoformat()
    }
    programs.append(prog)
    save_data(PROGRAMS_FILE, programs)
    return jsonify(prog), 201

# ─── Enroll ────────────────────────────────────────────────────────────────────
@app.route('/api/clients/<int:client_id>/enroll', methods=['POST'])
def enroll_client(client_id):
    data = request.get_json() or {}
    pid  = data.get('program_id')
    if not pid:
        abort(400, 'program_id required')
    if not any(c['id']==client_id for c in load_data(CLIENTS_FILE)):
        abort(404, 'Client not found')
    if not any(p['id']==pid for p in load_data(PROGRAMS_FILE)):
        abort(404, 'Program not found')
    enrolls = load_data(ENROLLMENTS_FILE)
    if any(e['client_id']==client_id and e['program_id']==pid for e in enrolls):
        abort(400, 'Already enrolled')
    new_e = {
        'client_id': client_id,
        'program_id': pid,
        'enrollment_date': datetime.utcnow().isoformat(),
        'status': 'active'
    }
    enrolls.append(new_e)
    save_data(ENROLLMENTS_FILE, enrolls)
    return jsonify(new_e), 201

if __name__ == '__main__':
    app.run(debug=True)
