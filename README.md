# Date Randomizer

A web application that helps users discover new date ideas and locations in their area. The app uses Google Maps API to find interesting places and provides details about each location.

## Features

- Search for various date locations (restaurants, parks, activities, etc.)
- View locations on an interactive map
- Get detailed information about each location including:
  - Name and address
  - Rating
  - Photos
  - Location type
- Filter results by distance and type

## Tech Stack

- Frontend:

  - React with Vite
  - TypeScript
  - Tailwind CSS
  - Google Maps JavaScript API

- Backend:

  - Node.js
  - Express
  - Google Places API

- Infrastructure:
  - AWS CloudFront for frontend hosting
  - AWS S3 for static file storage
  - AWS EC2 for backend server
  - AWS API Gateway for secure API access

## Local Development Setup

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd date-randomizer
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=http://localhost:3002
   VITE_FRONTEND_URL=http://localhost:5173
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_WEATHER_API_KEY=your_weather_api_key
   ```

4. Create a `server/.env` file:

   ```env
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   PORT=3002
   ALLOWED_ORIGINS=http://localhost:5173
   ```

5. Start the development server:

   ```bash
   # Start the backend server
   cd server
   npm run dev

   # In a new terminal, start the frontend
   cd ..
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## Production Deployment

The application is deployed using AWS services:

- Frontend: Hosted on CloudFront (https://d13swv3yj9soxt.cloudfront.net)
- Backend API: Available through API Gateway (https://qhtyt8bpf2.execute-api.us-west-1.amazonaws.com/prod)
- Server: Running on EC2 with PM2 for process management

### Deployment Steps

1. Build the frontend:

   ```bash
   npm run build
   ```

2. Deploy to S3:

   ```bash
   aws s3 sync dist/ s3://date-randomizer-frontend/ --delete
   ```

3. Backend deployment:

   ```bash
   # SSH into EC2
   ssh -i ./cs3660-backend-key ec2-user@ec2-3-89-231-148.compute-1.amazonaws.com

   # Pull latest changes
   cd date-randomizer
   git pull

   # Restart PM2 process
   pm2 restart date-randomizer-api
   ```

## Environment Variables

### Frontend (.env.production)

```env
VITE_API_URL=https://qhtyt8bpf2.execute-api.us-west-1.amazonaws.com/prod
VITE_FRONTEND_URL=https://d13swv3yj9soxt.cloudfront.net
VITE_WEATHER_API_KEY=your_weather_api_key
```

### Backend (server/.env)

```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
PORT=3001
ALLOWED_ORIGINS=https://d13swv3yj9soxt.cloudfront.net
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
