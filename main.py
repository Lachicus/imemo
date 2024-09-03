from flask import Flask, render_template, request, redirect, url_for, session, jsonify, send_from_directory
import os
from dotenv import load_dotenv
# NEW
import firebase_admin
from firebase_admin import credentials, firestore, storage
# END NEW
load_dotenv()

app = Flask(__name__, template_folder='templates', static_folder='static')

# Initialize Firebase
cred = credentials.Certificate({
    "type": os.environ.get("FIREBASE_TYPE"),
    "project_id": os.environ.get("FIREBASE_PROJECT_ID"),
    "private_key_id": os.environ.get("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.environ.get("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
    "client_email": os.environ.get("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.environ.get("FIREBASE_CLIENT_ID"),
    "auth_uri": os.environ.get("FIREBASE_AUTH_URI"),
    "token_uri": os.environ.get("FIREBASE_TOKEN_URI"),
    "auth_provider_x509_cert_url": os.environ.get("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
    "client_x509_cert_url": os.environ.get("FIREBASE_CLIENT_X509_CERT_URL")
})
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# Retrieve the passcode from SECRETS
passcode = os.environ.get('passcode')
app.secret_key = os.environ.get('encrypted_key')

@app.route('/notes')
def notes():
    if session.get('authenticated'):
        notes_ref = db.collection('notes')
        notes = notes_ref.stream()
        note_files = [note.id for note in notes]
        return render_template('memo/memo.html', note_files=note_files)
    else:
        return redirect(url_for('index'))

@app.route('/')
def index():
    if session.get('authenticated'):
        # Redirect authenticated users to the notes page
        return redirect(url_for('notes'))
    else:
        return render_template('authcode/authcode.html')

@app.route('/authenticate', methods=['POST'])
def authenticate():
    user_input = request.form['passcode_input']
    if user_input == passcode:
        session['authenticated'] = True
        return redirect(url_for('notes'))
    else:
        return render_template('authcode/authcode.html', alert=True)

@app.route('/logout')
def logout():
    # Clear the session when the user logs out
    session.pop('authenticated', None)
    return redirect(url_for('index'))

@app.route('/load-file')
def load_file():
    filename = request.args.get('filename')
    note_ref = db.collection('notes').document(filename)
    note = note_ref.get()
    if note.exists:
        return note.to_dict().get('content', '')
    else:
        return "File not found", 404

@app.route('/save-file', methods=['POST'])
def save_file():
    filename = request.args.get('filename')
    content = request.data.decode('utf-8')

    note_ref = db.collection('notes').document(filename)
    try:
        note_ref.set({'content': content})
        return 'File saved successfully', 200
    except Exception as e:
        return f'Error saving file: {str(e)}', 500

@app.route('/create_note', methods=['POST'])
def create_note():
    data = request.get_json()
    title = data.get('title')

    note_ref = db.collection('notes').document(f"{title}.txt")
    try:
        note_ref.set({'content': ''})
        return redirect(url_for('notes'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/rename-file')
def rename_file():
    old_filename = request.args.get('oldFilename')
    new_filename = request.args.get('newFilename')

    old_note_ref = db.collection('notes').document(old_filename)
    new_note_ref = db.collection('notes').document(new_filename)

    try:
        note = old_note_ref.get()
        if note.exists:
            new_note_ref.set(note.to_dict())
            old_note_ref.delete()
            return 'File renamed successfully', 200
        else:
            return 'File not found', 404
    except Exception as e:
        return f'Error renaming file: {str(e)}', 500

@app.route('/delete-file')
def delete_file():
    filename = request.args.get('filename')
    note_ref = db.collection('notes').document(filename)

    try:
        note_ref.delete()
        return 'File deleted successfully', 200
    except Exception as e:
        return f'Error deleting file: {str(e)}', 500

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory("./", filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=81)
