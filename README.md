# Weather Alert System - Adar Abadian Home Assignment

A full-stack application that provides weather monitoring and alerts based on user-defined conditions.

## Features

- **Real-time Weather Monitoring**: View current weather conditions for any location
- **Custom Weather Alerts**: Set up alerts based on specific weather parameters (temperature, humidity, etc.)
- **Email Notifications**: Receive notifications when your alert conditions are met
- **Responsive Design**: User-friendly interface that works on both desktop and mobile devices

## Tech Stack

### Frontend
- React with TypeScript
- Material UI for component styling
- React Router for navigation
- Context API for state management
- Axios for API requests

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL database
- node-cron for scheduled tasks
- Nodemailer for email notifications
- RESTful API architecture

## Project Structure

```
├── frontend/               # React frontend application
│   ├── src/                # Source files
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
└── backend/                # Node.js backend application
    ├── src/                # Source files
    │   ├── config/         # Configuration files
    │   ├── controllers/    # Request handlers
    │   ├── models/         # Data models
    │   ├── repositories/   # Database interaction
    │   ├── routes/         # API route definitions
    │   ├── services/       # Business logic
    │   └── utils/          # Utility functions
    └── .env                # Environment variables
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/tomorrow.git
   cd tomorrow
   ```

2. Install backend dependencies
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend development server
   ```
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `GET /api/weather/current` - Get current weather by location
- `GET /api/weather/default` - Get weather for default location (New York)
- `GET /api/alerts` - Get all alerts for current user
- `POST /api/alerts` - Create a new alert
- `PUT /api/alerts/:id` - Update an existing alert
- `DELETE /api/alerts/:id` - Delete an alert

## Considerations

- I thought adding a feature of updating an alert would be good so I added it
- On startup, the backend will retrieve data from Tomorrow API. Then, it'll fetch data again each 10 minutes (to avoid API limits because it's free tier)
- I added a feature of polling, to refresh data periodically to enhance UX and alert with popup on real time when a alert is newly triggered
- I chose polling over socket.io as I wanted something lightweight
- Regarding bonus app task - I tried working on an app, but I wasn't sure about what I'm doing so I thought investing more in the web app will be better than doing mobile app im not 100% familiar with
- I included .env on purpose so you'll have the .env values I used, including the TOMORROW_API_KEY and Postgres connection string
- I chose to not deploy the app but deploy the DB to Supabase so you'll already have some data to work with and more convenient experience
- Regarding email support - I added the neccessary code but didn't include my Gmail credentials for obvious reasons, regarding SMS support - It was expensive for me 🤣
- Regarding requests to Tomorrow API - I grouped calls by locations so it'll be more effecient
- I thought adding sorting to Alerts Page (A-Z / Triggered first)
- Frontend is caching it's responses to save some api calls and be more effecient
- On homepage it's set by default to New York, so I'm caching it's weather data in backend and refreshing it periodically