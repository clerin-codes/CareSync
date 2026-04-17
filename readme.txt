CareSync360 Deployment Guide (SE3020 Assignment 1)

1. Prerequisites
- Node.js 18+
- npm 9+
- Docker Desktop (with Docker Compose)
- Optional: Kubernetes cluster (Docker Desktop K8s / Minikube)

2. Project Structure
- Root deliverables: submission.txt, readme.txt, members.txt
- Application source: CareSync360/

3. Configure Environment Variables
Update the following files before running:
- CareSync360/services/auth-service/.env
- CareSync360/services/doctor-service/.env
- CareSync360/services/appointment-service/.env
- CareSync360/services/patient-service/.env
- CareSync360/services/payment-service/.env
- CareSync360/services/notification-service/.env

Important values:
- MONGO_URI
- JWT_SECRET
- STRIPE_SECRET_KEY (payment-service)
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM (notification-service)
- SMSLENZ_USER_ID, SMSLENZ_API_KEY, SMSLENZ_SENDER_ID (notification-service)

4. Run with Docker Compose
From CareSync360/ run:
- docker-compose up --build

Expected ports:
- Frontend: 5173
- API Gateway: 4000
- Auth: 4001
- Doctor: 4002
- Appointment: 4003
- Patient: 4004
- Payment: 4005
- Notification: 4006

5. Application Access
- Open frontend: http://localhost:5173
- API gateway health: http://localhost:4000/

6. Feature Verification Checklist
- Auth: patient register/login, admin login
- Admin: create doctor account + doctor profile, verify doctor
- Patient: browse doctors, book appointment, upload/download reports, view prescriptions
- Doctor: manage profile + availability, accept/reject/complete appointments, issue prescriptions
- Telemedicine: consultation room opens Jitsi meeting link from accepted appointment
- Payment: checkout session and payment records
- Notifications: email and SMS endpoints available via notification service

7. Kubernetes Deployment (Optional)
Manifests are in CareSync360/k8s/
Apply in order:
- kubectl apply -f CareSync360/k8s/app-secret.yaml
- kubectl apply -f CareSync360/k8s/mongo-pvc.yaml
- kubectl apply -f CareSync360/k8s/mongo-deployment.yaml
- kubectl apply -f CareSync360/k8s/mongo-service.yaml
- kubectl apply -f CareSync360/k8s/auth-deployment.yaml
- kubectl apply -f CareSync360/k8s/auth-service.yaml
- kubectl apply -f CareSync360/k8s/doctor-deployment.yaml
- kubectl apply -f CareSync360/k8s/doctor-service.yaml
- kubectl apply -f CareSync360/k8s/appointment-deployment.yaml
- kubectl apply -f CareSync360/k8s/appointment-service.yaml
- kubectl apply -f CareSync360/k8s/patient-deployment.yaml
- kubectl apply -f CareSync360/k8s/patient-service.yaml
- kubectl apply -f CareSync360/k8s/payment-deployment.yaml
- kubectl apply -f CareSync360/k8s/payment-service.yaml
- kubectl apply -f CareSync360/k8s/notification-deployment.yaml
- kubectl apply -f CareSync360/k8s/notification-service.yaml
- kubectl apply -f CareSync360/k8s/gateway-deployment.yaml
- kubectl apply -f CareSync360/k8s/gateway-service.yaml
- kubectl apply -f CareSync360/k8s/frontend-deployment.yaml
- kubectl apply -f CareSync360/k8s/frontend-service.yaml

8. Notes
- This project follows microservices architecture with API gateway routing.
- For final submission, ensure submission.txt contains valid GitHub and YouTube links.
