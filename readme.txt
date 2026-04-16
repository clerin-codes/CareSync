CareSync360 Setup Guide

Project type: Smart Healthcare Microservices Platform

1. Prerequisites
- Node.js 18+
- npm 9+
- Docker Desktop (recommended for easiest startup)
- kubectl (only if you want Kubernetes deployment)

2. Project location
- Main application folder: CareSync360

3. Quick start (recommended)
- Open terminal in CareSync360
- Run:
  docker compose up --build

4. Access URLs
- Frontend: http://localhost:5173
- API Gateway: http://localhost:4000

5. Main gateway route groups
- /auth
- /doctors
- /appointments
- /patients
- /payments
- /notifications

6. Run without Docker (local development)
- From CareSync360, install dependencies:
  npm install
  npm install --prefix gateway
  npm install --prefix services/auth-service
  npm install --prefix services/doctor-service
  npm install --prefix services/appointment-service
  npm install --prefix services/patient-service
  npm install --prefix services/payment-service
  npm install --prefix services/notification-service
  npm install --prefix frontend

- Start each service in separate terminals:
  npm run dev --prefix gateway
  npm run dev --prefix services/auth-service
  npm run dev --prefix services/doctor-service
  npm run dev --prefix services/appointment-service
  npm run dev --prefix services/patient-service
  npm run dev --prefix services/payment-service
  npm run dev --prefix services/notification-service
  npm run dev --prefix frontend

7. Optional seed data
- From CareSync360:
  node seed-doctors.js

Demo credentials after seed:
- Admin: admin@hospital.com / admin123
- Seeded doctors password: password123

8. Recommended feature demo flow
- Register patient account
- Login as admin and create doctor account/profile
- Login as doctor and set availability
- Login as patient and book appointment
- Login as doctor and accept appointment
- Login as patient and make payment
- Login as doctor and mark appointment completed
- Login as doctor and issue prescription
- Login as patient and view reports/prescriptions

9. Kubernetes deployment
- Deployment files are in CareSync360/k8s
- Read CareSync360/k8s/README.md for deployment order

10. Stop project
- If running with Docker Compose:
  docker compose down