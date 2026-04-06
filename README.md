# PrepAI 

**PrepAI** is an AI-powered interview simulation platform designed to help job seekers prepare for technical and behavioral interviews with ease. By leveraging state-of-the-art AI (Google Gemini), PrepAI analyzes your resume, simulates realistic interview scenarios, and provides detailed performance reports to help you ace your next big opportunity.

---

## Key Features

- ** Smart Resume Parsing**: Upload your resume and let the AI tailor the interview questions specifically to your background and skills.
- ** Realistic Interview Simulation**: Experience a real-time, interactive interview environment with dynamic questions.
- ** Detailed Performance Reports**: Receive a comprehensive analysis of your performance, including strengths, areas for improvement, and recommended answers.
- ** Secure Authentication**: Integrated with **Auth0** for reliable and secure user management.
- ** Progress Tracking**: A personalized dashboard to track your past interviews and monitor your growth.

---

## Tech Stack

### **Frontend**
- **React 19** & **Vite**: Modern, lightning-fast development and build suite.
- **React Router 7**: Advanced client-side routing.
- **Sass (SCSS)**: Professional, modular styling.
- **Auth0 SDK**: Industry-standard authentication.
- **Axios**: Efficient API handling.

### **Backend**
- **Node.js** & **Express 5**: Fast and robust server-side execution.
- **MongoDB** & **Mongoose**: Flexible NoSQL database with powerful modeling.
- **Google Generative AI (Gemini)**: Powering the interview engine.
- **Puppeteer**: For generating high-quality PDF reports.
- **PDF-Parse**: Efficient resume data extraction.
- **Zod**: Reliable schema validation.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)
- Auth0 account
- Google Gemini API Key

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/YourUsername/PrepAI.git
cd PrepAI
```

#### 2. Setup the Backend
```bash
cd Backend
npm install
```
Create a `.env` file in the `Backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GOOGLE_GEMINI_KEY=your_gemini_api_key
AUTH0_AUDIENCE=your_auth0_audience
AUTH0_ISSUER_BASE_URL=your_auth0_domain
```
Run the backend:
```bash
npm run dev
```

#### 3. Setup the Frontend
```bash
cd ../Frontend
npm install
```
Create a `.env` file in the `Frontend` directory:
```env
VITE_AUTH0_DOMAIN=your_auth0_domain
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_AUTH0_AUDIENCE=your_auth0_audience
VITE_API_URL=http://localhost:5000
```
Run the frontend:
```bash
npm run dev
```

---

## 📁 Project Structure

```text
PrepAI/
├── Frontend/          # React + Vite application
│   ├── src/
│   │   ├── features/  # Module-based features (auth, interview, landing)
│   │   ├── components/# Reusable UI components
│   │   └── style.scss # Global styles
├── Backend/           # Express.js application
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/     # API endpoints
│   │   └── services/   # Business logic & AI integration
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

Avtar Singh - [GitHub](https://github.com/Avtarsingh97)

Project Link: [https://github.com/Avtarsingh97/PrepAI](https://github.com/Avtarsingh97/PrepAI)
