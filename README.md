# Weather Alert System

A full-stack application that monitors weather conditions and sends alerts based on user-defined thresholds.

## Features

- Real-time weather data integration with Tomorrow.io API
- Customizable weather alerts with various conditions
- Scheduled alert evaluation service
- RESTful API for alert management
- Modern React frontend

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Tomorrow.io API key

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` in the backend directory
   - Add your Tomorrow.io API key

4. Start MongoDB

5. Run the application:
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend
   cd frontend
   npm start
   ```

## API Endpoints

### Weather
- `GET /api/weather/current` - Get current weather data

### Alerts
- `POST /api/alerts` - Create a new alert
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/:id` - Get alert by ID
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert

## Alert Schema

```typescript
{
  name: string;
  location: {
    city?: string;
    coordinates?: {
      lat: number;
      lon: number;
    };
  };
  parameter: string;
  threshold: number;
  condition: '>' | '<' | '>=' | '<=' | '==';
  description?: string;
  isTriggered: boolean;
  lastChecked: Date;
}
```

## License

MIT 