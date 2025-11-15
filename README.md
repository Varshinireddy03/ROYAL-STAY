# RoyalStay — Hotel Automation System

A full-stack Hotel Management & Automation System that digitalizes hotel operations for Guests, Receptionists, Managers, and Staff. Handles reservations, billing, food services, complaints, room management, occupancy monitoring, and more.

## Table of Contents
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Environment Configuration](#environment-configuration)
- [API Overview](#api-overview)
- [Authentication](#authentication)
- [Dashboards & Roles](#dashboards--roles)
- [Contributing](#contributing)
- [License](#license)
- [Contributors](#contributors)
- [Contact](#contact)

## Key Features
Guest
- Register / Login
- View available rooms
- Make and view reservations
- Place food orders and view menu
- Post and track complaints
- View bill and make payments

Receptionist
- Login
- View check-ins / check-outs
- Assign rooms and confirm checkouts
- Generate reservation tokens
- Notify guests and view availability

Manager
- Advanced dashboard (occupancy, revenue)
- Manage rooms and food menu (add/update/delete)
- Assign complaints to staff
- View all payments and generate reports
- Track staff activity

Hotel Staff
- Login
- View assigned complaints
- Update service/completion status
- View and deliver food orders
- Update logs for manager monitoring

## Technology Stack
- Frontend: React (Vite), Axios, TailwindCSS, React Router, React Hooks
- Backend: Django, Django REST Framework, Simple JWT Authentication
- Database: SQLite (development)

## Project Structure
royalstay/
 ├── backend/
 │   ├── core/              # Django project
 │   ├── hotel/             # Main app (models, serializers, views)
 │   ├── db.sqlite3
 │   ├── manage.py
 ├── frontend/
 │   ├── src/               # React source
 │   ├── public/
 │   ├── vite.config.js
 └── README.md

## Prerequisites
- Python 3.8+
- Node.js 14+ / npm or yarn
- Git

## Backend Setup (local development)
1. Open a terminal and navigate into the backend folder:
   ```
   cd backend
   ```
2. Create and activate a virtual environment:
   ```
   python3 -m venv venv
   source venv/bin/activate    # macOS / Linux
   # or
   venv\Scripts\activate       # Windows (PowerShell)
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Apply migrations and create superuser:
   ```
   python manage.py migrate
   python manage.py createsuperuser
   ```
5. Run the server:
   ```
   python manage.py runserver
   ```
6. Backend runs at: http://127.0.0.1:8000

## Frontend Setup
1. Open a terminal and navigate into the frontend folder:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the dev server:
   ```
   npm run dev
   ```
4. Frontend runs at: http://localhost:5173

## Environment Configuration
Example backend environment variables (.env or Django settings):
- SECRET_KEY=your_django_secret_key
- DEBUG=True
- ALLOWED_HOSTS=localhost,127.0.0.1
- DATABASE_URL=sqlite:///db.sqlite3 (if using dj-database-url)
- SIMPLE_JWT settings if customized
- CORS_ORIGIN_WHITELIST or CORS_ALLOWED_ORIGINS to include the frontend URL

Place any frontend environment variables in `frontend/.env` as required (e.g., REACT_APP_API_URL).

## API Overview
Authentication
- POST /api/users/ — Register user
- POST /api/token/ — Obtain JWT access and refresh tokens
- GET /api/users/me/ — Get current logged-in user

Rooms
- GET /api/rooms/ — List rooms
- POST /api/rooms/ — Add room (Manager)

Reservations
- POST /api/reservations/ — Create reservation
- GET /api/reservations/ — List reservations

Food / Menu
- GET /api/food/ — Menu list
- POST /api/food/ — Add food (Manager)

Billing
- GET /api/bills/ — View bills
- POST /api/bills/ — Create bill (Manager)

Complaints / Staff / Payments
- Endpoints for complaints, staff assignment, orders, and payments follow similar REST patterns; consult the backend `hotel` app views/serializers for exact routes.

## Authentication (JWT)
- Obtain tokens:
  ```
  POST /api/token/
  {
    "username": "user",
    "password": "pass"
  }
  ```
- Use the access token in the Authorization header:
  ```
  Authorization: Bearer <access_token>
  ```

Example curl:
```
curl -H "Authorization: Bearer <token>" http://127.0.0.1:8000/api/rooms/
```

## Dashboards & Roles
- Guest Dashboard: reservation details, room info, menu, complaints, billing.
- Manager Dashboard: occupancy graph, revenue chart, room & menu management, complaint assignment.
- Receptionist Dashboard: check-ins/check-outs, room assignment, token generation.
- Staff Dashboard: assigned complaints, food order handling, status updates.

## Testing
- Add and run Django tests:
  ```
  python manage.py test
  ```

## Contributing
- Fork the repository and create feature branches.
- Use descriptive commit messages and open pull requests against the main branch.
- Report issues or feature requests in the Issues tab.
- Include tests for new functionality where appropriate.

## License
This project is created for educational and project-based learning purposes.

## Contributors
Name | Role
--- | ---
P. Hruthika | Frontend + Backend
T. Mona Sree | Frontend
T. Varshini | Frontend + Backend
Y. Yamuna | Frontend

## Contact
Project owner: Varshinireddy03 (GitHub)
For questions or help: open an issue in this repository.
