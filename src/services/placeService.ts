import axios from "axios";

// Default coordinates (Lehi, Utah)
const DEFAULT_COORDINATES = {
  latitude: 40.3916,
  longitude: -111.8508,
};

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
      } catch (error) {
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

    // Make API call to your backend - fixed endpoint path
    const response = await axios.get("/api/places", {
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

// Function to get Yelp data for a place
export const getYelpInfo = async (name: string, address: string) => {
  try {
    const response = await axios.get("/api/yelp", {
      params: {
        term: name,
        location: address,
        limit: 1,
      },
    });

    if (response.data.businesses && response.data.businesses.length > 0) {
      const business = response.data.businesses[0];
      return {
        yelpRating: business.rating,
        yelpPrice: business.price,
        yelpUrl: business.url,
      };
    }
    return {};
  } catch (error) {
    console.error("Error fetching Yelp data:", error);
    return {};
  }
};
