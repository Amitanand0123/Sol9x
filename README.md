
# Sol9x: Role-Based LMS Portal 🎓

A comprehensive mini-Learning Management System (LMS) built with the **MERN Stack**. This project features secure Authentication, Role-Based Access Control (RBAC), Course Management, and a robust Email Notification system using Google OAuth2.

🔗 **Live Demo:** [https://sol9x-neon.vercel.app](https://sol9x-neon.vercel.app)  


---

## ✨ Key Features

### 🔐 Authentication & Security
*   **Secure Auth:** JWT-based stateless authentication.
*   **Password Encryption:** Industry-standard hashing using `bcryptjs`.
*   **Email Verification:** Users cannot login until they verify their email.
    *   *Powered by NodeMailer + Google OAuth2 API to bypass cloud firewall restrictions.*
*   **Password Recovery:** Full "Forgot Password" & "Reset Password" flow with secure tokens.
*   **Change Password:** Secure flow requiring verification of the old password.

### 👥 Role-Based Access Control (RBAC)
*   **Admin Dashboard:**
    *   Manage Students (Create, Read, Update, Delete).
    *   Create and Manage Courses.
    *   View detailed student profiles (enrollment history, verification status).
*   **Student Dashboard:**
    *   View personal profile and enrolled courses.
    *   Browse available courses.
    *   **Enroll/Disenroll** functionality with real-time UI updates.
    *   Update profile details (Name, Email).

### 🛠️ Technical Highlights
*   **Frontend:** React (Vite), Redux Toolkit (State Management), Tailwind CSS, Shadcn UI.
*   **Backend:** Node.js, Express.js, MongoDB (Mongoose).
*   **Deployment:** Frontend on Vercel (with rewrite rules), Backend on Render.

---

## 🚀 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Redux Toolkit, Tailwind CSS, Lucide React, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Email Service** | Nodemailer + Google OAuth2 (Gmail API) |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Prerequisites
*   Node.js (v16+)
*   MongoDB Atlas Connection URI
*   Google Cloud Project Credentials (Client ID, Secret, Refresh Token)

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/sol9x.git
cd sol9x
```

### 3. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173

# Email Configuration (Google OAuth2)
EMAIL_USER=your_email@gmail.com
GOOGLE_CLIENT_ID=your_oauth_client_id
GOOGLE_CLIENT_SECRET=your_oauth_client_secret
GOOGLE_REFRESH_TOKEN=your_oauth_refresh_token
```
*Note: We use Google OAuth2 instead of standard SMTP to ensure reliable delivery on cloud platforms like Render that block port 587/465.*

Start the Server:
```bash
npm run dev
```

### 4. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the Client:
```bash
npm run dev
```

---

## 🧪 Application Flow & Assumptions

### 1. Email Delivery Delay (Important Note)
The application uses a **Google Cloud Project in "Testing Mode"** to send emails via the Gmail API.
*   **Observation:** Emails are sent instantly by the backend (confirmed via logs), but may take **2-5 minutes** to arrive in the recipient's inbox.
*   **Reason:** This is Google's internal security/greylisting for new, unverified apps. It is not a code latency issue.

### 2. Verification & Expiration
*   New users are created with `isVerified: false`.
*   A verification link is sent immediately.
*   The token expires in **24 hours**. If expired, the user must re-register (or logic can be extended to resend).

### 3. Admin Privileges
*   Admins can create students without specifying a "Course" (it defaults to "Not Assigned").
*   Admins cannot delete their own account (Self-deletion protection).

### 4. Deployment Configuration
*   **Frontend (Vercel):** Includes a `vercel.json` file to handle Client-Side Routing (SPA). This prevents 404 errors when refreshing pages like `/verify/:token`.
*   **Backend (Render):** Uses the `googleapis` library to construct raw MIME messages, ensuring emails bypass SMTP port blocking common on free-tier hosting.

---

## 📂 Project Structure

```text
sol9x-lms/
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Logic (Auth, Admin, Student, Course)
│   ├── middleware/     # Auth protection & Role checks
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # API Routes
│   └── utils/          # sendEmail (Google OAuth2 implementation)
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI (Modals, Buttons, Layout)
    │   ├── pages/      # Dashboards, Login, Register
    │   ├── store/      # Redux Slices (Auth state)
    │   └── lib/        # Axios setup & Utils
    └── vercel.json     # SPA Routing config
```

---

## 🛡️ API Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Register new user (sends email) |
| **POST** | `/api/auth/login` | Public | Login & receive JWT |
| **GET** | `/api/auth/verify/:token` | Public | Verify email address |
| **POST** | `/api/auth/forgot-password` | Public | Initiate password reset |
| **GET** | `/api/admin/students` | Admin | List all students (Paginated) |
| **POST** | `/api/courses` | Admin | Create a new course |
| **POST** | `/api/courses/enroll` | Student | Enroll in a course |
| **POST** | `/api/courses/disenroll` | Student | Disenroll from a course |

---

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
