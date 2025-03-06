import React, { useState, useEffect } from 'react';
import { getCurrentPosition } from '../services/api'; // Import this if it exists, otherwise we'll implement it

interface WeatherData {
    location: string;
    temperature: number;
    description: string;
    icon: string;
}

// Default coordinates (can be set to a central location like in api.ts)
const DEFAULT_COORDINATES = {
    latitude: 40.2338, // Default to UVU's coordinates
    longitude: -111.6585,
};

const WeatherWidget: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [usingDefaultLocation, setUsingDefaultLocation] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchWeather = async () => {
            try {
                // Try to get user's location
                let coordinates;
                try {
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            enableHighAccuracy: true,
                            timeout: 5000,
                            maximumAge: 0
                        });
                    });

                    coordinates = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                } catch (locationError) {
                    console.log('Using default location for weather:', locationError);
                    coordinates = DEFAULT_COORDINATES;
                    setUsingDefaultLocation(true);
                }

                // Make API call to OpenWeatherMap 
                const OPEN_WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&units=imperial&appid=${OPEN_WEATHER_API_KEY}`
                );

                if (!response.ok) {
                    throw new Error('Weather data not available');
                }

                const data = await response.json();

                if (isMounted) {
                    setWeather({
                        location: data.name,
                        temperature: Math.round(data.main.temp),
                        description: data.weather[0].description,
                        icon: data.weather[0].icon,
                    });
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching weather:', error);
                if (isMounted) {
                    setError('Unable to fetch weather data');
                    setLoading(false);

                    // Fallback to mock data if API call fails
                    setWeather({
                        location: usingDefaultLocation ? 'Lehi, Utah' : 'Your Location',
                        temperature: 72,
                        description: 'clear sky',
                        icon: '01d',
                    });
                }
            }
        };

        fetchWeather();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="card shadow-sm">
                <div className="card-header" style={{ backgroundColor: 'var(--primary)' }}>
                    <h5 className="mb-0 text-white">Weather for Date Planning</h5>
                </div>
                <div className="card-body text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading weather data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card shadow-sm">
                <div className="card-header" style={{ backgroundColor: 'var(--primary)' }}>
                    <h5 className="mb-0 text-white">Weather for Date Planning</h5>
                </div>
                <div className="card-body">
                    <div className="alert alert-warning">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {error}
                    </div>
                    {weather && (
                        <div className="text-center mt-3">
                            <h3>{weather.location}</h3>
                            <div className="display-4">{weather.temperature}°F</div>
                            <p>{weather.description}</p>
                            {usingDefaultLocation && (
                                <p className="text-muted small">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Using default location. Enable location services for your area.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="card shadow-sm">
            <div className="card-header" style={{ backgroundColor: 'var(--primary)' }}>
                <h5 className="mb-0 text-white">Weather for Date Planning</h5>
            </div>
            <div className="card-body text-center">
                {weather && (
                    <>
                        <h3>{weather.location}</h3>
                        <div className="d-flex justify-content-center align-items-center">
                            <img
                                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                                alt={weather.description}
                                style={{ width: '80px', height: '80px' }}
                            />
                            <div className="display-4 ms-2">{weather.temperature}°F</div>
                        </div>
                        <p className="lead">{weather.description}</p>
                        {usingDefaultLocation && (
                            <div className="alert alert-warning mt-3">
                                <i className="bi bi-info-circle me-2"></i>
                                Using default location. Enable location services for personalized weather.
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default WeatherWidget; 