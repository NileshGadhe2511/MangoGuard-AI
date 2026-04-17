import os
import json
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.preprocessing import image

# --- MODULAR IMPORT ---
# Ensure gatekeeper.py is in the same folder!
from gatekeeper import LeafValidator

app = Flask(__name__)

# 🛡️ GLOBAL CORS CONFIGURATION 
# Optimized to prevent "Loading" hangs on mobile devices
CORS(app, resources={r"/*": {
    "origins": "*",
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization", "Accept"]
}}, supports_credentials=True)

# --- CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
USER_DB_PATH = os.path.join(BASE_DIR, 'users.json')
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
DISEASE_MODEL_PATH = os.path.join(BASE_DIR, 'mango_disease_model.h5')

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# --- INITIALIZE MODELS ---
print("\n--- Initializing AI Models on Nitro V15 ---")
validator = LeafValidator()

try:
    # Load the ResNet50-based disease model
    disease_model = tf.keras.models.load_model(DISEASE_MODEL_PATH)
    print("✅ Disease Model Loaded Successfully!")
except Exception as e:
    print(f"❌ Error Loading Disease Model: {e}")

MANGO_LABELS = [
    'Anthracnose', 'Bacterial Canker', 'Cutting Diffuse', 'Die Back',
    'Gall Midge', 'Healthy', 'Powdery Mildew', 'Sooty Mould'
]

# --- USER DATABASE LOGIC ---
def load_users():
    if not os.path.exists(USER_DB_PATH):
        with open(USER_DB_PATH, 'w') as f: json.dump([], f)
        return []
    try:
        with open(USER_DB_PATH, 'r') as f: 
            return json.load(f)
    except: 
        return []

def save_users(users):
    with open(USER_DB_PATH, 'w') as f: 
        json.dump(users, f, indent=4)

# --- API ROUTES ---

@app.route('/')
def index():
    return "MangoGuard AI Server is Online!"

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data: return jsonify({"error": "No data received"}), 400
    
    users = load_users()
    email = data.get('email', '').lower()
    
    if any(u['email'].lower() == email for u in users):
        return jsonify({"error": "Email already registered"}), 400
    
    users.append({
        "name": data.get('name'),
        "email": email,
        "password": data.get('password') # In a real app, use hashing (bcrypt)
    })
    save_users(users)
    return jsonify({"message": "Registration successful"}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data: return jsonify({"error": "No data received"}), 400
    
    email = data.get('email', '').lower()
    password = data.get('password', '')
    
    users = load_users()
    for user in users:
        if user['email'].lower() == email and user['password'] == password:
            print(f"✅ Login Successful: {email}")
            return jsonify({
                "user": {"name": user['name'], "email": user['email']}
            }), 200
            
    print(f"❌ Login Failed: {email}")
    return jsonify({"error": "Invalid email or password"}), 401

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    img_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(img_path)

    try:
        # 1. CALL THE GATEKEEPER (Gemini API Validation)
        # This checks for fake images/laptop screens
        is_leaf, g_conf, g_idx = validator.is_valid_leaf(img_path)
        
        if not is_leaf:
            if os.path.exists(img_path): os.remove(img_path)
            return jsonify({
                "status": "Invalid", 
                "details": "AI identified this as a digital screen or non-mango image."
            }), 200

        # 2. IMAGE PREPROCESSING FOR RESNET50
        with image.load_img(img_path) as img:
            img_array = image.img_to_array(img)
            
        # resize_with_pad maintains the aspect ratio of your Nitro V15 scans
        img_padded = tf.image.resize_with_pad(img_array, 224, 224) 
        img_final = np.expand_dims(img_padded.numpy(), axis=0) / 255.0

        # 3. DISEASE CLASSIFICATION
        predictions = disease_model.predict(img_final)
        index = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0]))

        # 🛡️ CONFIDENCE THRESHOLD
        if confidence < 0.65:
            result = {
                "status": "Invalid",
                "details": "Image quality too low or leaf unrecognized. Please take a clearer photo."
            }
        else:
            result = {
                "status": "Success",
                "disease": MANGO_LABELS[index],
                "confidence": round(confidence * 100, 2)
            }

    except Exception as e:
        print(f"❌ Prediction Error: {e}")
        result = {"error": "Server Error", "details": str(e)}
    
    # 🧹 DISK CLEANUP (Keep Nitro V15 Storage Clean)
    if os.path.exists(img_path):
        os.remove(img_path)

    return jsonify(result)

if __name__ == '__main__':
    # '0.0.0.0' allows external devices (phones) to connect
    app.run(host='0.0.0.0', port=5000, debug=True)