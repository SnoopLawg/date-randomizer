import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { searchPlaces, getYelpInfo } from '../services/placeService';
import { useAuth } from '../context/AuthContext';

interface Place {
  id: string;
  name: string;
  address: string;
  rating: number;
  price_level?: number;
  photos?: string[];
  yelpRating?: number;
  yelpPrice?: string;
  yelpUrl?: string;
  distance?: number;
}

interface UserPreferences {
  priceRange: [number, number];
  distance: number; // in miles
}

const NearbyPlaces: React.FC = () => {
  const { dateIdea } = useParams<{ dateIdea: string }>();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingDefaultLocation, setUsingDefaultLocation] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<Place[]>([]);
  const placesPerPage = 6;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    priceRange: [0, 200],
    distance: 50
  });

  useEffect(() => {
    if (user) {
      const savedFavorites = localStorage.getItem(`favorites_${user.uid}_${dateIdea}`);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, [user, dateIdea]);

  useEffect(() => {
    if (user) {
      const savedPreferences = localStorage.getItem(`preferences_${user.uid}`);
      if (savedPreferences) {
        setUserPreferences(JSON.parse(savedPreferences));
      }
    }
  }, [user]);

  const sortPlaces = (placesToSort: Place[]) => {
    // First filter places based on preferences
    const filteredPlaces = placesToSort.filter(place => {
      const estimatedPrice = place.yelpPrice ?
        (place.yelpPrice.length * 15) : // Estimate $=15, $$=30, $$$=45, $$$$=60
        (place.price_level ? place.price_level * 15 : 0);

      const distanceInMiles = place.distance ? place.distance / 1609.34 : 0; // Convert meters to miles

      return (
        estimatedPrice >= userPreferences.priceRange[0] &&
        estimatedPrice <= userPreferences.priceRange[1] &&
        (distanceInMiles <= userPreferences.distance || distanceInMiles === 0)
      );
    });

    // Then sort remaining places
    return filteredPlaces.sort((a, b) => {
      // First, check if either place is in favorites
      const aIsFavorite = favorites.some(fav => fav.id === a.id);
      const bIsFavorite = favorites.some(fav => fav.id === b.id);

      // If one is favorite and other isn't, favorite goes first
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;

      // If neither is favorite or both are favorites, sort by distance
      if (a.distance && b.distance) {
        return a.distance - b.distance;
      }

      // If distance is missing for either, put them at the end
      if (!a.distance) return 1;
      if (!b.distance) return -1;

      return 0;
    });
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
      setUsingDefaultLocation(false);

      try {
        // Determine search query based on date idea
        let searchQuery = '';

        if (!dateIdea) {
          throw new Error('No date idea specified');
        }

        // Map date ideas to appropriate search queries
        if (dateIdea.toLowerCase().includes('dinner')) {
          searchQuery = 'restaurant fine dining';
        } else if (dateIdea.toLowerCase().includes('movie')) {
          searchQuery = 'movie theater cinema';
        } else if (dateIdea.toLowerCase().includes('hiking')) {
          searchQuery = 'hiking trail park nature';
        } else if (dateIdea.toLowerCase().includes('picnic')) {
          searchQuery = 'park garden picnic area';
        } else {
          // Default search using the date idea itself
          searchQuery = dateIdea;
        }

        console.log(`Searching for: ${searchQuery}`);

        try {
          // Get places from API
          const placesData = await searchPlaces({ query: searchQuery });

          // Sort places before setting them
          const sortedPlaces = sortPlaces(placesData);
          setPlaces(sortedPlaces);

          // Check if we're using default location
          if (placesData.usingDefaultLocation) {
            setUsingDefaultLocation(true);
          }
        } catch (error) {
          console.error('Error fetching places:', error);
          throw new Error('Failed to fetch places from API');
        }

        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || 'Failed to load nearby places');
        } else {
          setError('Failed to load nearby places');
        }
        setLoading(false);
      }
    };

    if (dateIdea) {
      fetchPlaces();
    }
  }, [dateIdea, favorites, userPreferences]);

  // Calculate current places to display
  const indexOfLastPlace = currentPage * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const currentPlaces = places.slice(indexOfFirstPlace, indexOfLastPlace);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleGoBack = () => {
    navigate('/');
  };

  // Toggle favorite status of a place
  const toggleFavorite = (place: Place) => {
    const isFavorite = favorites.some(fav => fav.id === place.id);
    let newFavorites: Place[];

    if (isFavorite) {
      newFavorites = favorites.filter(fav => fav.id !== place.id);
    } else {
      newFavorites = [...favorites, place];
    }

    setFavorites(newFavorites);

    // Resort places after updating favorites
    const sortedPlaces = sortPlaces(places);
    setPlaces(sortedPlaces);

    // Save to localStorage if user is logged in
    if (user) {
      localStorage.setItem(`favorites_${user.uid}_${dateIdea}`, JSON.stringify(newFavorites));
    } else {
      alert('Log in to save your favorite places!');
    }
  };

  // Check if a place is in favorites
  const isFavorite = (placeId: string) => {
    return favorites.some(fav => fav.id === placeId);
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Finding the best places for your {dateIdea} date...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Nearby Places for {dateIdea}</h1>
        <button
          className="btn"
          onClick={handleGoBack}
          style={{
            backgroundColor: 'var(--accent)',
            color: 'white',
            border: '1px solid var(--accent-dark)',
          }}
        >
          Back to Wheel
        </button>
      </div>

      {usingDefaultLocation && (
        <div className="alert alert-warning mb-4">
          <i className="bi bi-info-circle me-2"></i>
          Using default location. Enable location services for personalized results.
        </div>
      )}

      <div className="row">
        <div className="col-md-8">
          {places.length > 0 ? (
            <>
              {currentPlaces.map(place => (
                <div key={place.id} className="card mb-4 shadow-sm">
                  <div className="row g-0">
                    <div className="col-md-4" style={{ maxHeight: '200px' }}>
                      {place.photos && place.photos[0] ? (
                        <img
                          src={place.photos[0]}
                          className="img-fluid rounded-start"
                          alt={place.name}
                          style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '200px'
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://placehold.co/400x300/cccccc/666666?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="bg-light d-flex align-items-center justify-content-center rounded-start"
                          style={{ height: '200px' }}>
                          <span className="text-muted">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="col-md-8">
                      <div className="card-body d-flex flex-column h-100">
                        <div className="d-flex justify-content-between align-items-start">
                          <h5 className="card-title text-truncate mb-1">{place.name}</h5>
                          <button
                            className="btn btn-sm p-0 ms-2"
                            onClick={() => toggleFavorite(place)}
                            aria-label={isFavorite(place.id) ? "Remove from favorites" : "Add to favorites"}
                          >
                            <i className={`bi ${isFavorite(place.id) ? "bi-heart-fill text-danger" : "bi-heart"}`}
                              style={{ fontSize: '1.2rem' }}></i>
                          </button>
                        </div>
                        <p className="card-text text-muted small text-truncate mb-2">{place.address}</p>

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
                            {place.yelpPrice || (place.price_level ? '$'.repeat(place.price_level) : 'N/A')}
                          </div>
                        </div>

                        {place.distance && (
                          <p className="card-text small mb-2">
                            {(place.distance / 1000).toFixed(1)} km away
                          </p>
                        )}

                        <div className="mt-auto">
                          <a
                            href={`https://maps.google.com/?q=${place.name} ${place.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary"
                          >
                            View on Map
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                  {Array.from({ length: Math.ceil(places.length / placesPerPage) }).map((_, index) => (
                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </>
          ) : (
            <div className="alert alert-info">
              No places found for "{dateIdea}" in your area. Try a different date idea or expand your search radius.
            </div>
          )}
        </div>

        <div className="col-md-4">
          {/* Favorites Section */}
          <div className="card shadow-sm mb-4">
            <div className="card-header" style={{ backgroundColor: 'var(--accent)' }}>
              <h5 className="mb-0 text-white">Your Favorites</h5>
            </div>
            <div className="card-body">
              {user ? (
                favorites.length > 0 ? (
                  <div className="list-group">
                    {favorites.map(fav => (
                      <div key={fav.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{fav.name}</h6>
                          <small className="text-muted">{fav.rating} ★</small>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => toggleFavorite(fav)}
                          aria-label="Remove from favorites"
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted">
                    Click the heart icon on any place to add it to your favorites.
                  </p>
                )
              ) : (
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  Log in to save your favorite places.
                </div>
              )}
            </div>
          </div>

          {/* Price Guide Card */}
          <div className="card shadow-sm mb-4">
            <div className="card-header" style={{ backgroundColor: 'var(--primary)' }}>
              <h5 className="mb-0 text-white">Price Guide</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between">
                  <span>$</span>
                  <span className="text-muted">Under $15 per person</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>$$</span>
                  <span className="text-muted">About $15-$30 per person</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>$$$</span>
                  <span className="text-muted">$31-$60 per person</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>$$$$</span>
                  <span className="text-muted">Over $60 per person</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Date Tips Card */}
          <div className="card shadow-sm">
            <div className="card-header" style={{ backgroundColor: 'var(--primary)' }}>
              <h5 className="mb-0 text-white">Date Tips</h5>
            </div>
            <div className="card-body">
              <h6>Making the Most of Your {dateIdea}</h6>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Check reviews before you go</li>
                <li className="list-group-item">Make reservations if possible</li>
                <li className="list-group-item">Consider the ambiance for your date</li>
                <li className="list-group-item">Have a backup plan just in case</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyPlaces; 