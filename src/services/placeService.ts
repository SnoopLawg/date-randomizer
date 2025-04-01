import axios from "axios";

// Default coordinates (Lehi, Utah)
const DEFAULT_COORDINATES = {
  latitude: 40.3916,
  longitude: -111.8508,
};

const API_URL = import.meta.env.VITE_API_URL;

interface PlaceSearchParams {
  query: string;
  latitude?: number;
  longitude?: number;
}

export const searchPlaces = async (params: PlaceSearchParams) => {
  try {
    // Try to get user's location if not provided
    let coordinates = {
      latitude: params.latitude,
      longitude: params.longitude,
    };

    if (!coordinates.latitude || !coordinates.longitude) {
      try {
        const position = await getCurrentPosition();
        coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      } catch {
        console.log("Using default location (Lehi, UT)");
        coordinates = DEFAULT_COORDINATES;
      }
    }

    console.log("Making request to /api/places with params:", {
      query: params.query,
      lat: coordinates.latitude,
      lng: coordinates.longitude,
      radius: 10000,
    });

    // Make API call to backend using full URL
    const response = await axios.get(`${API_URL}/api/places`, {
      params: {
        query: params.query,
        lat: coordinates.latitude,
        lng: coordinates.longitude,
        radius: 10000, // 10km radius
      },
    });

    console.log("Response received:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error searching places:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
    }
    throw error;
  }
};

// Helper function to get current position
const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  });
};
