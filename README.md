# 🎯 Policy Distributor

A comprehensive, full-stack insurance policy management system designed to streamline the distribution and tracking of insurance policies. Built with a modern tech stack, it provides a seamless experience for both administrators and policy seekers.

## 🚀 Key Features

### 👤 For Users (Members)
- **Policy Discovery:** Browse through various categories of insurance policies (Life, Health, Auto, Travel, etc.).
- **Quick Application:** Multi-step or direct application process for any active policy.
- **Application Tracking:** Real-time status updates on submitted applications (Pending, Approved, Rejected).
- **Google OAuth:** Secure and easy login with Google integration.

### 🛡️ For Administrators
- **Dashboard Overview:** Key metrics and analytics for policy performance.
- **Member Management:** Manage user roles and permissions.
- **Policy Control:** Create, update, and manage the insurance catalog.
- **Application Processing:** Review and manage pending applications with detailed notes.

## 🛠️ Tech Stack

- **Frontend:** [React](https://reactjs.org/), [Redux Toolkit](https://redux-toolkit.js.org/), [Material UI](https://mui.com/)
- **Backend:** [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Authentication:** [JSON Web Tokens (JWT)](https://jwt.io/), [Google OAuth](https://developers.google.com/identity/gsi/web/guides/overview)
- **Styling:** Styled-components & Vanilla CSS

## 📂 Project Structure

```bash
Policy Distributor/
├── client/          # React Frontend
│   ├── public/      # Static assets
│   └── src/         # Components, Redux storage, Pages
├── server/          # Express Backend
│   ├── Models/      # Mongoose Schemas (User, Policy, Application)
│   ├── Routes/      # API Endpoints
│   ├── Controllers/ # Business logic
│   └── Middleware/  # Auth & Error handling
└── README.md        # Project documentation
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Google Cloud Console Project (for OAuth)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd "Policy Distributor"
   ```

2. **Setup Server:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   ```

3. **Setup Client:**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   ```

### Running the Application

- **Start Backend:** `npm run dev` (from `server` folder)
- **Start Frontend:** `npm start` (from `client` folder)

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the ISC License.
