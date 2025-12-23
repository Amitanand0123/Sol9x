# Sol9x: Role-Based LMS Portal

A comprehensive mini-Learning Management System (LMS) featuring secure Authentication, Role-Based Access Control (RBAC), and Course Management. Built with the **MERN Stack** and styled with **Shadcn UI**.

## ✨ Key Features

### 🔐 Authentication & Security

* **JWT Authentication:** Secure login using JSON Web Tokens.
* **Password Hashing:** Industry-standard encryption using `bcryptjs`.
* **Email Verification:** New users must verify their email via **Nodemailer** before logging in.
* **Password Recovery:** Complete "Forgot Password" flow with time-limited reset tokens.

### 👥 Role-Based Access (RBAC)

* **Admin Dashboard:**
* Full Student CRUD (Create, Read, Update, Delete).
* Course Management (Create and View courses).
* Deep-dive Student Profiles (View specific student enrollment data).


* **Student Dashboard:**
* Profile Management.
* Browse and Enroll in courses.
* Disenrollment functionality.



### 🎨 UI/UX

* **Modern Design:** Built with **Tailwind CSS** and **Shadcn UI** components.
* **Responsive:** Fully optimized for Mobile, Tablet, and Desktop.
* **State Management:** Global state handled via **Redux Toolkit**.

---

## 🏗️ Tech Stack

* **Frontend:** React.js, Redux Toolkit, React Router, Tailwind CSS, Shadcn UI.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (Mongoose ODM).
* **Utilities:** Nodemailer (Email), JWT (Auth), Axios (API calls).

---

## 📂 Project Structure

```text
mern-auth-project/
├── backend/
│   ├── controllers/    # Request handling logic
│   ├── models/         # Database schemas
│   ├── routes/         # API endpoints
│   ├── utils/          # Email and helper functions
│   └── server.js       # Entry point
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI & Layouts
    │   ├── store/      # Redux slices
    │   ├── pages/      # View components
    │   └── lib/        # Axios & Utility configs

```

---

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mern-academy.git
cd mern-academy

```

### 2. Backend Setup

```bash
cd backend
npm install

```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173

```

Run the backend: `npm run dev`

### 3. Frontend Setup

```bash
cd ../frontend
npm install

```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api

```

Run the frontend: `npm run dev`

---

## 🚦 API Endpoints

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Register new user | Public |
| GET | `/api/auth/verify/:token` | Verify email | Public |
| POST | `/api/auth/login` | Login & get token | Public |
| GET | `/api/admin/students` | Get all students | Admin |
| POST | `/api/courses/enroll` | Enroll in course | Student |
| POST | `/api/courses/disenroll` | Remove course | Student |

---

## 🤝 Contributing

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

### 📝 Final Interview Checklist

* [ ] Does the email verification link work?
* [ ] Can an Admin see the "Manage Courses" tab?
* [ ] Does "Disenroll" remove the card from the Student Dashboard?
* [ ] Is the password hashed in the MongoDB database?

**Congratulations! You have a fully documented, full-stack project ready for submission. Is there anything else you need help with before your interview?**