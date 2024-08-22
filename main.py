from flask import Flask, render_template, request, redirect, url_for, session, jsonify, send_from_directory
import os
from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__, template_folder='templates', static_folder='static')

# Retrieve the passcode from SECRETS
passcode = os.environ.get('passcode')

app.secret_key = os.environ.get('encrypted_key')

@app.route('/notes')
def notes():
    if session.get('authenticated'):
        note_files = []
        for filename in os.listdir('./memo-notes'):
            if filename.endswith('.txt'):
                note_files.append(filename)
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
    print(passcode)
    if user_input == passcode:
        session['authenticated'] = True
        
        print("AUTHENTICATION SUCCESS!!!")
        return redirect(url_for('notes'))
    else:
        print("AUTHENTICATION FAILED!")
        return render_template('authcode/authcode.html', alert=True)

@app.route('/logout')
def logout():
    # Clear the session when the user logs out
    session.pop('authenticated', None)
    return redirect(url_for('index'))

@app.route('/load-file')
def load_file():
    filename = request.args.get('filename')
    file_path = os.path.join('./memo-notes', filename)

    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        return content
    except FileNotFoundError:
        return "File not found", 404

@app.route('/save-file', methods=['POST'])
def save_file():
    filename = request.args.get('filename')
    content = request.data.decode('utf-8')

    # Check if the filename exists in the "memo-notes" folder
    if filename and os.path.isfile(f'./memo-notes/{filename}'):
        try:
            # Open the file and overwrite its content with the new content
            with open(f'./memo-notes/{filename}', 'w') as file:
                file.write(content)
            return 'File saved successfully', 200
        except Exception as e:
            return f'Error saving file: {str(e)}', 500
    else:
        return 'File not found', 404


@app.route('/create_note', methods=['POST'])
def create_note():
    data = request.get_json()
    title = data.get('title')

   # Create the new text file with the specified title
    file_name = f"{title}.txt"
    path = os.path.join('./memo-notes', file_name)

    try:
        with open(path, 'w') as file:
            pass
        return redirect(url_for('notes'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/rename-file')
def rename_file():
    old_filename = request.args.get('oldFilename')
    new_filename = request.args.get('newFilename')

    old_path = os.path.join('./memo-notes', old_filename)
    new_path = os.path.join('./memo-notes', new_filename)

    try:
        os.rename(old_path, new_path)
        return 'File renamed successfully', 200
    except Exception as e:
        return f'Error renaming file: {str(e)}', 500

@app.route('/delete-file')
def delete_file():
    filename = request.args.get('filename')
    file_path = os.path.join('./memo-notes', filename)

    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return 'File deleted successfully', 200
        else:
            return 'File not found', 404
    except Exception as e:
        return f'Error deleting file: {str(e)}', 500


@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory("./", filename)




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=81)
