MangoGuard AI: Deep Learning-Based Disease Diagnostic System

Overview:-
    MangoGuard AI is a hybrid AI pipeline designed to provide real-time, high-accuracy disease classification for mango crops. The system combines a local ResNet50  deep   learning model with the Gemini 1.5 Flash API to ensure both high-speed inference and intelligent validation.

Key Features:-
  Hybrid AI Pipeline: Utilizes TensorFlow/ResNet50 for classification and Gemini 1.5 Flash for semantic image validation.
  Real-Time Diagnostics: A mobile dashboard built with React Native for instant health monitoring.
  Secure Backend: Engineered with Flask to support multi-tenant authentication and sub-second inference latency.
  Image Forensics: Built-in logic to detect and reject fraudulent or non-leaf scans, ensuring data integrity.
  History Tracking: Persistent user history allows growers to monitor disease progression over time.

Tech Stack:-
  Frontend: React Native (Android/iOS) 
  Backend: Flask (Python) 
  Machine Learning: TensorFlow, ResNet50, Gemini 1.5 Flash API 
  Data Integrity: Custom image forensic validation logic 

How to Run:-
  Backend: Navigate to the server folder and run python 
  server.py.Mobile: Run npm install followed by npx expo start.
