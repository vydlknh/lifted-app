# Lifted - Personalized Cycle-Based Wellness App
Lifted is an AI-powered web application that generates personalized fitness training plans and meal recommendations tailored to women's menstrual cycle phases. The system analyzes individual wellness goals and cycle data to optimize nutrition and exercise routines, supporting women in achieving sustainable health outcomes through science-based, hormonally-informed guidance.

## Tech Stack
* **Frontend:** React (Vite), React Router, Tailwind CSS
* **Backend:** Netlify Serverless Functions (Node.js)
* **Database:** Google Firestore
* **APIs:** Firebase Authentication, OpenAI API
* **Deployment:** Netlify

## Local Development Setup
### 1. Clone the repository
```
git clone https://github.com/vydlknh/lifted-app
cd lifted-app
```

### 2. Install dependencies
All dependencies are in the `frontend` directory.
```
cd frontend
npm install
```

### 3. Set Up Environment Variables
This project requires two sets of environment variables, all stored in one file.
1. From the `frontend` directory, create a new file named `.env`:
```
touch .env
```
2. Add the following variables to your `frontend/.env` file:
```
# ----------------------------------------
# 1. FRONTEND KEYS (VITE)
# These are prefixed with VITE_ to be exposed to the browser
# ----------------------------------------
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...

# ----------------------------------------
# 2. BACKEND KEYS (NETLIFY FUNCTIONS)
# These have NO prefix and are kept secret
# ----------------------------------------
OPENAI_API_KEY=sk-...

# Get this by generating a private key from your
# Firebase Project Settings > Service Accounts.
# You must Base64-encode the entire contents of the downloaded JSON file.
FIREBASE_SERVICE_ACCOUNT_KEY=...
```
### 4. Run the Development Server
The Netlify CLI is required to run the frontend and the serverless functions together.
```
cd ..
npx netlify dev --env-file=frontend/.env
```
Open the application in your browser at the URL provided (usually `http://localhost:8888`).
## Deployment
This application is configured for continuous deployment on Netlify.
1. Connect your repository to a new Netlify site.
2. All build settings are automatically loaded from `netlify.toml`.
3. You must add all the environment variables from your `frontend/.env` file to the Netlify UI at **Site settings > Build & deploy > Environment**.
