# <p align="center">📓 IMEMO</p>

<p align="center">
  <img src="assets/banner.png" alt="IMEMO Banner" width="800">
</p>

<p align="center">
  <strong>Your private online notepad, reimagined for security and simplicity.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License">
</p>

---

## 🌟 Overview

**IMEMO** is a sophisticated, secure, and private online notepad designed to protect your sensitive information. Built with a focus on ease of use and modern aesthetics, IMEMO allows you to keep your daily tasks, ideas, and secrets stored safely in the cloud.

---

## ✨ Key Features

- 🔒 **Secure Access**: Protected by a customizable passcode to ensure only you can access your notes.
- ☁️ **Cloud Storage**: Powered by **Firebase Firestore**, ensuring your notes are always available and synchronized.
- 📝 **Dynamic Editing**: Seamlessly create, read, update, and delete notes with a glassmorphic user interface.
- 🌓 **Modern UI**: A premium dark-mode aesthetic with micro-interactions and smooth transitions.
- 📱 **PWA Ready**: Install IMEMO on your mobile device or desktop for a native-like experience.
- ⚡ **Auto-Save**: Never lose a thought again with reliable backend persistence.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | [Python](https://www.python.org/) & [Flask](https://flask.palletsprojects.com/) |
| **Database** | [Google Firebase Firestore](https://firebase.google.com/products/firestore) |
| **Frontend** | Vanilla JS, CSS3 (Glassmorphism), HTML5 |
| **Deployment** | [Vercel](https://vercel.com/) |
| **PWA** | Service Workers & Web Manifests |

---

## 🚀 Getting Started

### 📋 Prerequisites

- **Python 3.8+**
- **Firebase Account** (for Firestore credentials)
- **Pip** (Python package manager)

### ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lachicus/imemo.git
   cd imemo
   ```

2. **Set up a Virtual Environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**
   Create a `.env` file in the root directory and add your credentials:
   ```env
   FIREBASE_TYPE=service_account
   FIREBASE_PROJECT_ID=your_id
   FIREBASE_PRIVATE_KEY_ID=your_key_id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=your_email
   FIREBASE_CLIENT_ID=your_id
   ...
   passcode=your_secret_passcode
   encrypted_key=your_flask_secret_key
   ```

5. **Run the Engine**
   ```bash
   python main.py
   ```
   Visit `http://localhost:81` to start noting!

---

## 📸 Screenshots

<p align="center">
  <i>(Add your own screenshots here to showcase your unique UI!)</i>
</p>

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📫 Contact

**Rafael Lachica (Lachicus)**  
📧 [Email](mailto:lachicarfl05@gmail.com) | 🐙 [GitHub](https://github.com/Lachicus)

<p align="center">
  Made with 💜 by <a href="https://github.com/Lachicus">Rafael Lachica</a>
</p>
