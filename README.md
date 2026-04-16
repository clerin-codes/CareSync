# Smart Healthcare Microservices Platform

Smart Healthcare is a university microservices telemedicine platform built with Node.js, React, MongoDB Atlas, Docker Compose, and Kubernetes. The system preserves a clear microservice split while supporting the full healthcare workflow:

- patient registration and login
- doctor account creation, profile setup, verification, and availability management
- doctor browsing and search
- appointment booking, modify, cancel, accept, reject, and complete
- payment only for accepted or completed appointments
- patient profiles, medical reports, prescriptions, notifications, and Jitsi consultation links

This README is the common project guide for:

- service responsibilities
- public API endpoints
- local run commands
- Docker and Kubernetes commands
- smoke testing and validation commands

## Quick Start

### Run with Docker Compose (recommended)

```bash
cd CareSync360
docker compose up --build
```

- Frontend: http://localhost:5173
- Gateway API: http://localhost:4000

### Run services locally (without Docker)

Install dependencies first:

```bash
cd CareSync360
npm install
npm install --prefix gateway
npm install --prefix services/auth-service
npm install --prefix services/doctor-service
npm install --prefix services/appointment-service
npm install --prefix services/patient-service
npm install --prefix services/payment-service
npm install --prefix services/notification-service
npm install --prefix frontend
```

Then open one terminal per service and run:

```bash
npm run dev --prefix gateway
npm run dev --prefix services/auth-service
npm run dev --prefix services/doctor-service
npm run dev --prefix services/appointment-service
npm run dev --prefix services/patient-service
npm run dev --prefix services/payment-service
npm run dev --prefix services/notification-service
npm run dev --prefix frontend
```

### Optional: seed demo data

```bash
node seed-doctors.js
```

Demo credentials after seeding:

| Role    | Email                         | Password      |
| ------- | ----------------------------- | ------------- |
| Admin   | `admin@hospital.com`          | `admin123`    |
| Doctors | _(see seeded list)_           | `password123` |
| Patient | register via `/auth/register` | —             |

## Architecture

### Services

| Component            | Port   | Database         | Purpose                                                             | Health URL               |
| -------------------- | ------ | ---------------- | ------------------------------------------------------------------- | ------------------------ |
| Frontend             | `5173` | None             | React app for patient, doctor, and admin flows                      | `http://localhost:5173`  |
| Gateway              | `4000` | None             | Single API entry point and reverse proxy                            | `http://localhost:4000/` |
| Auth Service         | `4001` | `auth-db`        | JWT auth, patient registration, doctor/admin account creation       | `http://localhost:4001/` |
| Doctor Service       | `4002` | `doctor-db`      | Doctor profiles, specialization listing, availability, verification | `http://localhost:4002/` |
| Appointment Service  | `4003` | `appointment-db` | Slots, bookings, appointment lifecycle, Jitsi meeting link creation | `http://localhost:4003/` |
| Patient Service      | `4004` | `patient-db`     | Patient profiles, reports, prescriptions                            | `http://localhost:4004/` |
| Payment Service      | `4005` | `payment-db`     | Mock payment records and Stripe Checkout integration                | `http://localhost:4005/` |
| Notification Service | `4006` | None             | Email notifications via SMTP or JSON transport fallback             | `http://localhost:4006/` |

### MongoDB Atlas configuration

Base cluster:

```text
mongodb+srv://teacups:teacups@teacups.cajbnbv.mongodb.net/
```

Per-service databases:

- `auth-service` -> `auth-db`
- `doctor-service` -> `doctor-db`
- `appointment-service` -> `appointment-db`
- `patient-service` -> `patient-db`
- `payment-service` -> `payment-db`

### Public API entry point

All client-facing API requests should go through the gateway:

```text
http://localhost:4000
```

Gateway route prefixes:

- `/auth`
- `/doctors`
- `/appointments`
- `/patients`
- `/payments`
- `/notifications`

### Authentication model

- JWT header format: `Authorization: Bearer <token>`
- Roles used by the platform:
  - `PATIENT`
  - `DOCTOR`
  - `ADMIN`
- Most error responses use:

```json
{
  "message": "Human readable error"
}
```

### Important workflow notes

- patient self-registration creates only `PATIENT` accounts
- admin creates doctor login accounts in `auth-service`
- admin creates doctor profiles in `doctor-service`
- admin verifies doctors in `doctor-service`
- appointment booking requires a doctor profile id, not the auth user id
- payment is allowed only when appointment status is `ACCEPTED` or `COMPLETED`
- accepted appointments get a Jitsi `meetingLink`
- prescriptions can be issued only by doctors and can optionally be tied to an accepted or completed appointment

## Project structure

```text
frontend/
gateway/
services/
  auth-service/
  doctor-service/
  appointment-service/
  patient-service/
  payment-service/
  notification-service/
k8s/
docker-compose.yml
seed-doctors.js
```

## Local setup

### Prerequisites

- Node.js 18+ recommended
- npm 9+ recommended
- Docker Desktop for Compose-based startup
- `kubectl` for Kubernetes deployment
- internet access to reach MongoDB Atlas

### Install dependencies

Run from the project root:

```bash
npm install
npm install --prefix gateway
npm install --prefix services/auth-service
npm install --prefix services/doctor-service
npm install --prefix services/appointment-service
npm install --prefix services/patient-service
npm install --prefix services/payment-service
npm install --prefix services/notification-service
npm install --prefix frontend
```

Notes:

- the root `npm install` is for `seed-doctors.js`
- each service and the frontend have their own `package.json`
- if you want Stripe Checkout to work, set a valid `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in `services/payment-service/.env`
- if SMTP credentials are missing or invalid, the notification service falls back to JSON transport instead of real email delivery

## Run commands

### Option 1: Run the full system with Docker Compose

From the project root:

```bash
docker compose up --build
```

Useful Compose commands:

```bash
docker compose up --build -d
docker compose logs -f
docker compose down
docker compose config
```

After startup:

- frontend: `http://localhost:5173`
- gateway: `http://localhost:4000`

### Option 2: Run all services locally in separate terminals

Open one terminal per service and run these commands from the project root:

```bash
npm run dev --prefix gateway
npm run dev --prefix services/auth-service
npm run dev --prefix services/doctor-service
npm run dev --prefix services/appointment-service
npm run dev --prefix services/patient-service
npm run dev --prefix services/payment-service
npm run dev --prefix services/notification-service
npm run dev --prefix frontend
```

Production-style local commands:

```bash
npm run start --prefix gateway
npm run start --prefix services/auth-service
npm run start --prefix services/doctor-service
npm run start --prefix services/appointment-service
npm run start --prefix services/patient-service
npm run start --prefix services/payment-service
npm run start --prefix services/notification-service
npm run preview --prefix frontend
```

### Service command reference

| Component            | Working directory               | Dev command                                          | Start command                                          |
| -------------------- | ------------------------------- | ---------------------------------------------------- | ------------------------------------------------------ |
| Gateway              | `gateway`                       | `npm run dev --prefix gateway`                       | `npm run start --prefix gateway`                       |
| Auth Service         | `services/auth-service`         | `npm run dev --prefix services/auth-service`         | `npm run start --prefix services/auth-service`         |
| Doctor Service       | `services/doctor-service`       | `npm run dev --prefix services/doctor-service`       | `npm run start --prefix services/doctor-service`       |
| Appointment Service  | `services/appointment-service`  | `npm run dev --prefix services/appointment-service`  | `npm run start --prefix services/appointment-service`  |
| Patient Service      | `services/patient-service`      | `npm run dev --prefix services/patient-service`      | `npm run start --prefix services/patient-service`      |
| Payment Service      | `services/payment-service`      | `npm run dev --prefix services/payment-service`      | `npm run start --prefix services/payment-service`      |
| Notification Service | `services/notification-service` | `npm run dev --prefix services/notification-service` | `npm run start --prefix services/notification-service` |
| Frontend             | `frontend`                      | `npm run dev --prefix frontend`                      | `npm run preview --prefix frontend`                    |

### Optional seed command

The project includes a helper script that creates an admin account and several doctors.

```bash
node seed-doctors.js
```

Seeded demo credentials:

- Admin:
  - email: `admin@hospital.com`
  - password: `admin123`
- Seeded doctors:
  - password: `password123`
- Patients:
  - register through `/auth/register`

## Testing and validation commands

### Automated test suite status

There is no dedicated application test suite checked into this repository. Use the build, syntax, config, and API smoke-test commands below.

### Validation commands used for this project

```bash
docker compose config
node --check gateway/server.js
node --check services/appointment-service/controllers/appointmentController.js
node --check services/patient-service/controllers/patientController.js
node --check services/payment-service/controllers/paymentController.js
npm run build --prefix frontend
```

### Basic health checks

```bash
curl http://localhost:4000/
curl http://localhost:4001/
curl http://localhost:4002/
curl http://localhost:4003/
curl http://localhost:4004/
curl http://localhost:4005/
curl http://localhost:4006/
```

### API smoke-test sequence

1. Create an admin account:

```bash
curl -X POST http://localhost:4000/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@hospital.com",
    "password": "admin123"
  }'
```

2. Login as admin and copy the `token` value:

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hospital.com",
    "password": "admin123"
  }'
```

3. Register a patient and copy the `token` value:

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Patient One",
    "email": "patient1@example.com",
    "password": "patient123"
  }'
```

4. Seed doctors with the helper script, or create one manually with the admin token:

```bash
node seed-doctors.js
```

5. Verify doctor discovery:

```bash
curl http://localhost:4000/doctors
curl "http://localhost:4000/doctors?specialization=Cardiology"
```

6. With the patient token, inspect available slots:

```bash
curl "http://localhost:4000/appointments/available-slots?doctorProfileId=<DOCTOR_PROFILE_ID>&appointmentDate=2026-04-20" \
  -H "Authorization: Bearer <PATIENT_TOKEN>"
```

7. Book an appointment:

```bash
curl -X POST http://localhost:4000/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <PATIENT_TOKEN>" \
  -d '{
    "doctorProfileId": "<DOCTOR_PROFILE_ID>",
    "reason": "Follow-up consultation",
    "appointmentDate": "2026-04-20",
    "timeSlot": "09:00 AM"
  }'
```

8. With the doctor token, accept the appointment:

```bash
curl -X PATCH http://localhost:4000/appointments/doctor/<APPOINTMENT_ID>/accept \
  -H "Authorization: Bearer <DOCTOR_TOKEN>"
```

9. Pay for the accepted appointment using the mock payment route:

```bash
curl -X POST http://localhost:4000/payments/pay \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <PATIENT_TOKEN>" \
  -d '{
    "appointmentId": "<APPOINTMENT_ID>",
    "amount": 5000,
    "method": "MOCK_CARD"
  }'
```

10. Verify reports and prescriptions after the consultation:

```bash
curl http://localhost:4000/patients/me/reports \
  -H "Authorization: Bearer <PATIENT_TOKEN>"

curl http://localhost:4000/patients/me/prescriptions \
  -H "Authorization: Bearer <PATIENT_TOKEN>"
```

### Manual UI checklist

- patient can register and log in
- admin can create doctor accounts and doctor profiles
- admin can verify doctors
- patient can browse and filter doctors
- patient can book, edit, and cancel pending appointments
- doctor can accept, reject, and complete appointments
- patient can pay only for accepted or completed appointments
- patient can upload reports and view prescriptions
- doctor can view patient reports and issue prescriptions
- accepted appointments expose a Jitsi meeting link
- notifications are triggered for booking, status changes, and prescriptions

## Kubernetes commands

The deployment manifests are in `k8s/`. This project now uses MongoDB Atlas, so the legacy `mongo-*` manifests are not required for the current configuration.

Example apply sequence:

```bash
kubectl apply -f k8s/app-secret.yaml
kubectl apply -f k8s/auth-deployment.yaml
kubectl apply -f k8s/auth-service.yaml
kubectl apply -f k8s/doctor-deployment.yaml
kubectl apply -f k8s/doctor-service.yaml
kubectl apply -f k8s/appointment-deployment.yaml
kubectl apply -f k8s/appointment-service.yaml
kubectl apply -f k8s/patient-deployment.yaml
kubectl apply -f k8s/patient-service.yaml
kubectl apply -f k8s/payment-deployment.yaml
kubectl apply -f k8s/payment-service.yaml
kubectl apply -f k8s/notification-deployment.yaml
kubectl apply -f k8s/notification-service.yaml
kubectl apply -f k8s/gateway-deployment.yaml
kubectl apply -f k8s/gateway-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

Verification:

```bash
kubectl get pods
kubectl get svc
kubectl describe deployment gateway
```

Deployment notes:

- update image names before applying
- keep `JWT_SECRET` aligned across services
- set browser-reachable public URLs in `frontend-deployment.yaml` and payment service `FRONTEND_URL`
- keep the gateway reachable from the frontend at port `4000`

## Endpoint reference

All paths below are shown relative to the gateway base URL:

```text
http://localhost:4000
```

### Gateway routes

| Method | Path               | Auth   | Purpose                           | Notes                                            |
| ------ | ------------------ | ------ | --------------------------------- | ------------------------------------------------ |
| `GET`  | `/`                | Public | Gateway status and route map      | Returns available route prefixes                 |
| `ANY`  | `/auth/*`          | Mixed  | Proxies to `auth-service`         | Public and protected routes                      |
| `ANY`  | `/doctors/*`       | Mixed  | Proxies to `doctor-service`       | Public and protected routes                      |
| `ANY`  | `/appointments/*`  | Mixed  | Proxies to `appointment-service`  | Patient and doctor routes                        |
| `ANY`  | `/patients/*`      | Mixed  | Proxies to `patient-service`      | Patient, doctor, and admin routes                |
| `ANY`  | `/payments/*`      | Mixed  | Proxies to `payment-service`      | Includes Stripe Checkout and mock payment routes |
| `ANY`  | `/notifications/*` | Public | Proxies to `notification-service` | Used internally by services                      |

### Auth service endpoints

| Method | Path                    | Auth                         | Request                     | Response summary                                                 |
| ------ | ----------------------- | ---------------------------- | --------------------------- | ---------------------------------------------------------------- |
| `POST` | `/auth/register`        | Public                       | `{ name, email, password }` | Creates a patient account and returns `{ message, token, user }` |
| `POST` | `/auth/login`           | Public                       | `{ email, password }`       | Returns `{ message, token, user }`                               |
| `GET`  | `/auth/me`              | `PATIENT`, `DOCTOR`, `ADMIN` | None                        | Returns current user profile without password                    |
| `GET`  | `/auth/doctor-accounts` | `ADMIN`                      | None                        | Returns all doctor login accounts                                |
| `POST` | `/auth/create-doctor`   | `ADMIN`                      | `{ name, email, password }` | Creates a doctor login account                                   |
| `POST` | `/auth/create-admin`    | Public                       | `{ name, email, password }` | Creates an admin account                                         |

### Doctor service endpoints

| Method  | Path                       | Auth     | Request                                                                                           | Response summary                                 |
| ------- | -------------------------- | -------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------ |
| `GET`   | `/doctors`                 | Public   | Optional query: `specialization`                                                                  | Returns doctor profiles                          |
| `GET`   | `/doctors/:id`             | Public   | Path param: doctor profile id                                                                     | Returns a single doctor profile                  |
| `GET`   | `/doctors/me/profile`      | `DOCTOR` | None                                                                                              | Returns the logged-in doctor's profile           |
| `PUT`   | `/doctors/me/profile`      | `DOCTOR` | Any of `{ specialization, experience, hospital, consultationFee }`                                | Updates doctor profile fields                    |
| `POST`  | `/doctors/me/availability` | `DOCTOR` | `{ availability: [{ date?, day?, slots: [] }] }`                                                  | Replaces doctor availability                     |
| `POST`  | `/doctors`                 | `ADMIN`  | `{ userId, name, email, specialization, experience?, hospital?, consultationFee?, availability }` | Creates a doctor profile linked to a doctor user |
| `PATCH` | `/doctors/:id/verify`      | `ADMIN`  | `{ verified: true                                                                                 | false }`                                         | Marks a doctor profile as verified or unverified |

### Appointment service endpoints

| Method  | Path                                | Auth      | Request                                                  | Response summary                                                     |
| ------- | ----------------------------------- | --------- | -------------------------------------------------------- | -------------------------------------------------------------------- |
| `GET`   | `/appointments/available-slots`     | `PATIENT` | Query: `doctorProfileId`, `appointmentDate`              | Returns `availableSlots` and `blockedSlots` for that doctor and date |
| `POST`  | `/appointments`                     | `PATIENT` | `{ doctorProfileId, reason, appointmentDate, timeSlot }` | Creates a pending appointment                                        |
| `GET`   | `/appointments/my`                  | `PATIENT` | Optional query: `status`                                 | Returns patient appointments                                         |
| `GET`   | `/appointments/my/:id`              | `PATIENT` | Path param: appointment id                               | Returns one patient appointment                                      |
| `PUT`   | `/appointments/my/:id`              | `PATIENT` | Any of `{ reason, appointmentDate, timeSlot }`           | Updates only pending appointments                                    |
| `PATCH` | `/appointments/my/:id/cancel`       | `PATIENT` | None                                                     | Cancels the appointment unless already cancelled or completed        |
| `GET`   | `/appointments/doctor`              | `DOCTOR`  | Optional query: `status`                                 | Returns doctor-owned appointments                                    |
| `GET`   | `/appointments/doctor/:id`          | `DOCTOR`  | Path param: appointment id                               | Returns one doctor-owned appointment                                 |
| `PATCH` | `/appointments/doctor/:id/accept`   | `DOCTOR`  | None                                                     | Accepts a pending appointment and generates a Jitsi link             |
| `PATCH` | `/appointments/doctor/:id/reject`   | `DOCTOR`  | Optional `{ rejectionReason }`                           | Rejects a pending appointment                                        |
| `PATCH` | `/appointments/doctor/:id/complete` | `DOCTOR`  | None                                                     | Marks an accepted appointment as completed                           |

Appointment status values:

- `PENDING`
- `ACCEPTED`
- `REJECTED`
- `CANCELLED`
- `COMPLETED`

### Patient service endpoints

| Method | Path                                   | Auth                         | Request                                                                | Response summary                                               |
| ------ | -------------------------------------- | ---------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| `GET`  | `/patients/me/profile`                 | `PATIENT`                    | None                                                                   | Returns patient profile, creating it on first access if needed |
| `PUT`  | `/patients/me/profile`                 | `PATIENT`                    | Any of `{ name, phone, dateOfBirth, gender, address, medicalHistory }` | Updates patient profile                                        |
| `POST` | `/patients/me/reports`                 | `PATIENT`                    | `multipart/form-data` with `file`, optional `title`, `description`     | Uploads a medical report                                       |
| `GET`  | `/patients/me/reports`                 | `PATIENT`                    | None                                                                   | Returns current patient's reports                              |
| `GET`  | `/patients/:patientId/reports`         | `DOCTOR`, `ADMIN`            | Path param: patient auth user id                                       | Returns reports for a patient                                  |
| `GET`  | `/patients/reports/:reportId/download` | `PATIENT`, `DOCTOR`, `ADMIN` | Path param: report id                                                  | Downloads the stored report file                               |
| `POST` | `/patients/doctor/prescriptions`       | `DOCTOR`                     | `{ patientId, appointmentId?, medicines, notes? }`                     | Creates a prescription and notifies the patient                |
| `GET`  | `/patients/doctor/prescriptions`       | `DOCTOR`                     | Optional query: `patientId`                                            | Returns prescriptions issued by the logged-in doctor           |
| `GET`  | `/patients/me/prescriptions`           | `PATIENT`                    | None                                                                   | Returns prescriptions for the patient                          |

Prescription payload shape:

```json
{
  "patientId": "<PATIENT_AUTH_USER_ID>",
  "appointmentId": "<OPTIONAL_APPOINTMENT_ID>",
  "medicines": [
    {
      "name": "Amoxicillin",
      "dosage": "500mg",
      "instructions": "Twice daily after meals"
    }
  ],
  "notes": "Complete the full course."
}
```

### Payment service endpoints

| Method | Path                                    | Auth                         | Request                                                 | Response summary                                                           |
| ------ | --------------------------------------- | ---------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------- |
| `POST` | `/payments/checkout-session`            | `PATIENT`                    | `{ appointmentId, amount? }`                            | Creates a Stripe Checkout session for an accepted or completed appointment |
| `GET`  | `/payments/checkout-session/:sessionId` | `PATIENT`                    | Path param: Stripe Checkout session id                  | Returns Checkout status plus synced payment record                         |
| `POST` | `/payments/pay`                         | `PATIENT`                    | `{ appointmentId, amount?, method?, simulateFailure? }` | Creates or updates a mock payment record                                   |
| `GET`  | `/payments/my`                          | `PATIENT`                    | None                                                    | Returns the current patient's payments                                     |
| `GET`  | `/payments`                             | `ADMIN`                      | None                                                    | Returns all payment records                                                |
| `GET`  | `/payments/appointment/:appointmentId`  | `PATIENT`, `DOCTOR`, `ADMIN` | Path param: appointment id                              | Returns the payment record for a specific appointment                      |
| `POST` | `/payments/webhook`                     | Public                       | Stripe raw webhook body                                 | Processes Stripe webhook events                                            |

Payment status values:

- `PENDING`
- `PAID`
- `FAILED`

Mock payment notes:

- `method` defaults to `MOCK_CARD`
- `simulateFailure: true` forces a failed mock payment
- mock payment is useful when Stripe is not configured

### Notification service endpoints

| Method | Path                   | Auth   | Request                    | Response summary                                       |
| ------ | ---------------------- | ------ | -------------------------- | ------------------------------------------------------ |
| `POST` | `/notifications/email` | Public | `{ to, subject, message }` | Sends an email through SMTP or JSON transport fallback |

## Service-by-service behavior summary

### Gateway

- reverse-proxies all services behind one API base URL
- returns a route map from `GET /`
- does not change request or response structure

### Auth service

- stores platform users in `auth-db`
- signs JWTs with `JWT_SECRET`
- supports patient registration and login
- supports admin creation of doctor login accounts

### Doctor service

- stores doctor profile data in `doctor-db`
- supports public doctor discovery and specialization filtering
- separates doctor profile creation from doctor login account creation
- supports admin-driven verification

### Appointment service

- stores appointments in `appointment-db`
- validates availability against doctor profiles
- locks time slots for `PENDING`, `ACCEPTED`, and `COMPLETED` appointments
- creates Jitsi meeting links when an appointment is accepted

### Patient service

- stores patient profiles, reports, and prescriptions in `patient-db`
- auto-creates a patient profile on first access
- supports report uploads and secure report download access
- allows doctors to issue prescriptions

### Payment service

- stores payment records in `payment-db`
- supports both Stripe Checkout and mock payments
- blocks payment attempts unless the appointment is accepted or completed

### Notification service

- sends email notifications used by appointment and prescription flows
- supports SMTP and mock JSON transport fallback

## Environment notes

- service `.env` files already point to the required Atlas cluster and the `4000`-range ports
- keep the same `JWT_SECRET` across services that validate tokens
- for browser access, the frontend should keep `VITE_API_BASE_URL=http://localhost:4000`
- for production deployment, rotate credentials and avoid committing live secrets
