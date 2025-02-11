import React, { useEffect, useState } from 'react';
import { getPlaces, getYelpInfo } from '../services/api';

interface Place {
  id: string;
  name: string;
  address: string;
  rating: number;
  price_level?: number;
  photos?: string[];
  yelpRating?: number;
  yelpReviews?: number;
  yelpPrice?: string;
  distance?: number;
}

interface NearbyPlacesProps {
  dateIdea: string;
}

const NearbyPlaces: React.FC<NearbyPlacesProps> = ({ dateIdea }) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingDefaultLocation, setUsingDefaultLocation] = useState(false);

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
      setUsingDefaultLocation(false);
      
      try {
        const googleData = await getPlaces(dateIdea);
        const placesWithYelp = await Promise.all(
          googleData.map(async (place: Place) => {
            const yelpData = await getYelpInfo(place.name, place.address);
            return { ...place, ...yelpData };
          })
        );

        setPlaces(placesWithYelp);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes('default location')) {
            setUsingDefaultLocation(true);
          } else {
            setError(err.message || 'Failed to load nearby places. Please try again later.');
          }
        } else {
          setError('Failed to load nearby places. Please try again later.');
        }
        console.error('Error fetching places:', err);
      } finally {
        setLoading(false);
      }
    };

    if (dateIdea) {
      fetchPlaces();
    }
  }, [dateIdea]);

  if (loading) {
    return (
      <div className="text-center mt-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-4 pt-4" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-5">
      {usingDefaultLocation && (
        <div className="alert alert-warning mb-4" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          Using default location (UVU area). Enable location services for personalized results.
        </div>
      )}
      
      <h4 className="mb-4">Nearby Places for {dateIdea}</h4>
      <div className="row g-4">
        {places.map((place) => (
          <div key={place.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              {place.photos?.[0] && (
                <img 
                  src={place.photos[0]} 
                  className="card-img-top" 
                  alt={place.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{place.name}</h5>
                <p className="card-text small text-muted">{place.address}</p>
                
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <span className="badge bg-primary me-2">
                      Google: {place.rating} ★
                    </span>
                    {place.yelpRating && (
                      <span className="badge bg-danger">
                        Yelp: {place.yelpRating} ★
                      </span>
                    )}
                  </div>
                  <div>
                    {place.yelpPrice || ''.repeat(place.price_level || 0).replace(/./g, '$')}
                  </div>
                </div>

                {place.distance && (
                  <p className="card-text small mb-0">
                    {(place.distance / 1000).toFixed(1)} km away
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyPlaces; 