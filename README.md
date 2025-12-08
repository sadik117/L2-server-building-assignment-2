🚗 Vehicle Rental System – REST API

A complete backend API to manage users, vehicles, bookings, authentication, role-based access, availability management, and more.

🔗 Live API URL: [(https://assignment-2-express-server-indol.vercel.app/])

📌 Features
🔐 Authentication & Authorization

JWT-based authentication

Role-based access control (Admin / Customer)

👥 User Module

Register user

Login user

Get profile

Admin can manage all users

🚘 Vehicle Module

Admin can create, update, delete vehicles

Fetch all vehicles

Check availability before booking

📅 Booking Module

Create booking with:

Start & End date validation

Auto price calculation (daily rate × days)

Vehicle availability check

Cancel booking (Customer only)

Mark booking as returned (Admin only)

Auto update vehicle status

🧱 Database

PostgreSQL with relational tables:

users

vehicles

bookings

⚙️ Error Handling & Security

Custom ApiError class

Centralized error responses

Secure token verification

Request validation

🛠️ Technology Stack

Layer	Technology
Runtime	Node.js
Framework	Express.js
Database	PostgreSQL
ORM/Query	pg
Language	TypeScript
Authentication	JSON Web Token (JWT)
Password Hashing	bcrypt
Tools	Nodemon, ts-node-dev

📦 Installation & Setup

1️⃣ Clone the Repository
git clone [https://github.com/your-username/your-repo.git](https://github.com/sadik117/L2-server-building-assignment-2)
cd your-repo

2️⃣ Install Dependencies
npm install

3️⃣ Create .env File

Create .env in root:

PORT=5000
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_dbname

JWT_SECRET=your_secret_key

▶️ Running the Project
🔧 Development (Auto Reload)
npm run dev

🚀 Production
npm run build
npm start

📚 API Documentation

🔐 Authentication Routes
Method	Endpoint	Description
POST	/api/v1/auth/signup	Register new user
POST	/api/v1/auth/signin	Login & receive JWT

👥 User Routes
Method	Endpoint	Access	Description
GET	/api/v1/users/me	Auth	Get logged-in user
GET	/api/v1/users	Admin	Fetch all users

🚘 Vehicle Routes
Method	Endpoint	Access
POST	/api/v1/vehicles	Admin
GET	/api/v1/vehicles	Public
PUT	/api/v1/vehicles/:id	Admin
DELETE	/api/v1/vehicles/:id	Admin

📅 Booking Routes
Method	Endpoint	Access	Description
POST	/api/v1/bookings	Customer/Admin	Create booking
GET	/api/v1/bookings	Role Based	Admin=All, Customer=Own
PUT	/api/v1/bookings/:bookingId	Role Based	Cancel or Return Booking

📦 Project Structure
src/
 ├── config/
 │    ├── db.ts
 │    └── index.ts
 ├── middleware/
 │    └── verifyToken.ts
 ├── modules/
 │    ├── auth/
 │    ├── users/
 │    ├── vehicles/
 │    └── bookings/
 ├── utils/
 │    ├── ApiError.ts
 │    
 ├── app.ts
 └── server.ts

🛡️ Error Handling
Consistent structure using ApiError:

{
  "statusCode": 400,
  "message": "Invalid request",
  "success": false
}

🧪 Testing (Optional)
npm run test
