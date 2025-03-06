import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpinWheel from '../components/SpinWheel';
import DateIdeasCard from '../components/DateIdeasCard';
import WeatherWidget from '../components/WeatherWidget';
import { useAuth } from '../context/AuthContext';
import DateCategories from '../components/DateCategories';

const Home: React.FC = () => {
    const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
    const [customIdeas, setCustomIdeas] = useState<string[]>([
        "Dinner Date",
        "Movie Night",
        "Hiking Adventure",
        "Picnic in the Park"
    ]);
    const [showWelcome, setShowWelcome] = useState(true);
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const handleAddIdea = (idea: string) => {
        setCustomIdeas([...customIdeas, idea]);
    };

    const handleRemoveIdea = (index: number) => {
        const updatedIdeas = [...customIdeas];
        updatedIdeas.splice(index, 1);
        setCustomIdeas(updatedIdeas);
    };

    const handleSpinAgain = () => {
        // This will trigger the wheel to spin again
        const spinButton = document.querySelector('.spin-wheel-container button') as HTMLButtonElement;
        if (spinButton) {
            spinButton.click();
        }
    };

    const handleLetsGoOut = () => {
        if (selectedIdea) {
            navigate(`/nearby-places/${encodeURIComponent(selectedIdea)}`);
        }
    };

    return (
        <div className="container-fluid mt-4">
            {isAuthenticated && user && showWelcome && (
                <div className="alert alert-success mb-4 alert-dismissible fade show">
                    <h4 className="alert-heading">Welcome, {user.name}!</h4>
                    <p>You're logged in and ready to plan your perfect date.</p>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowWelcome(false)}
                        aria-label="Close"
                    ></button>
                </div>
            )}

            <div className="row">
                <div className="col-md-8">
                    <div className="card shadow-sm mb-4" style={{ height: 'var(--randomizer-card-height)', overflow: 'hidden' }}>
                        <div className="card-header text-white">
                            <h5 className="mb-0">Date Night Randomizer</h5>
                        </div>
                        <div className="card-body d-flex flex-column">
                            <div className="text-center mb-2">
                                <h2 style={{ color: 'var(--primary-dark)' }}>Spin the wheel for your next date idea!</h2>
                                <p className="lead" style={{ color: 'var(--neutral)' }}>Let fate decide your perfect date</p>
                            </div>
                            <div className="d-flex justify-content-center align-items-center" style={{ flex: '1 1 auto' }}>
                                <SpinWheel options={customIdeas} onSelect={setSelectedIdea} />
                            </div>
                        </div>
                    </div>

                    {selectedIdea && (
                        <div className="mt-4">
                            <div className="card shadow-sm">
                                <div className="card-header text-white">
                                    <h5 className="mb-0">Selected Date Idea</h5>
                                </div>
                                <div className="card-body" style={{ backgroundColor: 'var(--neutral-lightest)' }}>
                                    <h2 className="card-title" style={{ color: 'var(--primary)' }}>{selectedIdea}</h2>
                                    <p className="card-text" style={{ color: 'var(--neutral-dark)' }}>
                                        Get ready for a wonderful time with your special someone!
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <button
                                            className="btn"
                                            onClick={handleLetsGoOut}
                                            style={{
                                                backgroundColor: 'var(--secondary)',
                                                color: 'white',
                                                border: '1px solid var(--secondary-dark)',
                                            }}
                                        >
                                            Let's Go Out
                                        </button>
                                        <button
                                            className="btn"
                                            onClick={handleSpinAgain}
                                            style={{
                                                backgroundColor: 'var(--accent)',
                                                color: 'white',
                                                border: '1px solid var(--accent-dark)',
                                            }}
                                        >
                                            Spin Again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="col-md-4">
                    <div style={{ height: 'var(--date-ideas-card-height)' }}>
                        <DateIdeasCard
                            onAddIdea={handleAddIdea}
                            ideas={customIdeas}
                            onRemoveIdea={handleRemoveIdea}
                        />
                    </div>
                    <div className="mt-4">
                        <WeatherWidget />
                    </div>
                </div>
            </div>

            {/* Date Categories */}
            <DateCategories onAddIdea={handleAddIdea} customIdeas={customIdeas} />
        </div>
    );
};

export default Home;
