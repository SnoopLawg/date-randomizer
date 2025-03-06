import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlaces } from '../services/api';
import PlaceCard from '../components/PlaceCard';
import DateDescriptionCard from '../components/DateDescriptionCard';
import { useAuth } from '../context/AuthContext';

// Add Place interface if it's not imported elsewhere
interface Place {
    id: string;
    name: string;
    address: string;
    rating: number;
    isFavorite?: boolean;
    // Add other fields as needed
}

const NearbyPlaces: React.FC = () => {
    const { dateIdea } = useParams<{ dateIdea: string }>();
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<Place[]>([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Make sure we decode the URL parameter
    const decodedDateIdea = dateIdea ? decodeURIComponent(dateIdea) : '';

    useEffect(() => {
        console.log("Current date idea:", decodedDateIdea); // Debugging log

        const fetchPlaces = async () => {
            try {
                // Pass the date idea as the query parameter
                const data = await getPlaces(decodedDateIdea);
                setPlaces(data);

                // Set favorites if any
                if (user) {
                    const savedFavorites = localStorage.getItem(`favorites_${user.uid}_${decodedDateIdea}`);
                    if (savedFavorites) {
                        setFavorites(JSON.parse(savedFavorites));
                    }
                }
            } catch (error) {
                console.error('Error fetching places:', error);
            } finally {
                setLoading(false);
            }
        };

        if (decodedDateIdea) {
            fetchPlaces();
        } else {
            // Redirect to home if no date idea
            navigate('/');
        }
    }, [decodedDateIdea, user, navigate]);

    // Early return to prevent rendering with empty dateIdea
    if (!decodedDateIdea) {
        return <div className="container mt-4">Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Places for {decodedDateIdea}</h1>

            {/* Date Description Card - ensure it receives the decoded date idea */}
            <DateDescriptionCard dateIdea={decodedDateIdea} />

            {favorites.length > 0 && (
                <div className="mb-4">
                    <h2>Favorites</h2>
                    <div className="row">
                        {favorites.map(place => (
                            <div key={place.id} className="col-md-4 mb-3">
                                <PlaceCard place={place} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <h2>Nearby Locations</h2>
            {loading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="row">
                    {places.map(place => (
                        <div key={place.id} className="col-md-4 mb-3">
                            <PlaceCard place={place} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NearbyPlaces; 