🏨 RoyalStay – Hotel Automation System

RoyalStay is a full-stack Hotel Management & Automation System designed to digitalize hotel operations for Guests, Receptionists, Managers, and Staff.
The system includes end-to-end automation of reservations, billing, food services, complaints, room management, occupancy monitoring, and more.

🚀 Key Features
👤 Guest Features

Login / Register

View available rooms

Make reservations

View reservation status

Place food orders

View menu

Post complaints

Track complaint status

View bill

Make payment

🧾 Receptionist Features

Login

View check-ins and checkouts

Assign rooms to guests

Generate reservation tokens

Confirm checkout

Notify guests

View room availability

🛠 Manager Features

Advanced dashboard

Monitor total occupancy

Manage rooms (add/update/delete)

Manage food menu

Assign complaints to staff

Generate revenue reports

View all payments

Track staff activity

👷 Hotel Staff

Login

View assigned complaints

Update service/completion status

View food orders to deliver

Update log status for manager monitoring

💻 Technology Stack
Frontend

React.js (Vite)

Axios

TailwindCSS

React Router

React Hooks

Backend

Django

Django REST Framework

Simple JWT Authentication

SQLite (development)

🔐 Authentication

The system uses JWT (JSON Web Token) Authentication for secure login:

POST /api/token/ → returns access + refresh token

GET /api/users/me/ → returns logged-in user details

Tokens must be sent in the header:

Authorization: Bearer <token>

📁 Project Structure
royalstay/
 ├── backend/
 │   ├── core/              # Django project
 │   ├── hotel/             # Main app
 │   ├── db.sqlite3
 │   ├── manage.py
 │
 ├── frontend/
 │   ├── src/
 │   ├── public/
 │   ├── vite.config.js
 │
 └── README.md

⚙️ Backend Setup
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


Backend now runs at:
http://127.0.0.1:8000

🎨 Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs at:
http://localhost:5173

🔗 Important API Endpoints
User / Authentication
Method	Endpoint	Description
POST	/api/users/	Register user
POST	/api/token/	Login (get JWT)
GET	/api/users/me/	Get logged-in user
Rooms
Method	Endpoint	Description
GET	/api/rooms/	List rooms
POST	/api/rooms/	Add room (Manager)
Reservations

| POST | /api/reservations/ | Create reservation |
| GET | /api/reservations/ | List reservations |

Food

| GET | /api/food/ | Menu list |
| POST | /api/food/ | Add food (Manager) |

Billing

| GET | /api/bills/ | View bills |
| POST | /api/bills/ | Create bill (Manager) |

📊 Dashboards Overview
Guest Dashboard

Shows room info, reservation details, food menu, services, complaints, billing.

Manager Dashboard

Occupancy graph

Total room stats

Revenue chart

Room management panel

Food menu editor

Complaint assignment

Payments & bills

Receptionist Dashboard

Check-ins / Check-outs

Room assignment

Token generation

Notifications

Staff Dashboard

Food order handling

Complaint resolution

Status updates

🧑‍💻 Contributors

Name	        Role
P. Hruthika	 Frontend + Backend
T. Mona Sree	Frontend
T. Varshini	 Frontend + Backend
Y. Yamuna	   Frontend

📝 License

This project is created for educational and project-based learning purposes.
