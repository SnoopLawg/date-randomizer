import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Default coordinates (can be set to a central location in your target area)
const DEFAULT_COORDINATES = {
  latitude: 40.2338, // Default to UVU's coordinates
  longitude: -111.6585,
};

export const getPlaces = async (query: string) => {
  try {
    // Try to get user's location
    let coordinates;
    try {
      const position = await getCurrentPosition();
      coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (locationError: unknown) {
      if (locationError instanceof Error) {
        console.log('Using default location due to:', locationError.message);
      } else {
        console.log('Using default location due to unknown error');
      }
      coordinates = DEFAULT_COORDINATES;
    }

    const response = await api.get('/api/places', {
      params: {
        query,
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
};

export const getYelpInfo = async (name: string, address: string) => {
  try {
    const response = await api.get('/api/yelp', {
      params: {
        name,
        address,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Yelp data:', error);
    return {};
  }
};

const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => {
        let errorMessage = 'Location access denied. Using default location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Location permission denied. Using default location.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = 'Location information unavailable. Using default location.';
        } else if (error.code === error.TIMEOUT) {
          errorMessage = 'Location request timed out. Using default location.';
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}; 