import React from 'react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-header" style={{ backgroundColor: 'var(--primary)' }}>
                            <h1 className="mb-0 text-white">About Date Randomizer</h1>
                        </div>
                        <div className="card-body" style={{ opacity: 0.9 }}>
                            <div className="mb-4">
                                <p style={{ color: 'var(--primary-dark)' }}>
                                    Welcome to the Date Randomizer app! This app is designed to help you and your partner decide on
                                    fun and exciting activities for your dates. Whether you're looking to go out to eat, grab a snack,
                                    visit famous places, or play some board games, we've got you covered.
                                </p>
                                <p style={{ color: 'var(--primary-dark)' }}>
                                    Simply use our randomizer feature to get a spontaneous suggestion for your next date. No more
                                    indecisiveness or arguments about what to do - let the Date Randomizer make the choice for you!
                                </p>
                            </div>

                            <div className="mb-4">
                                <h2 style={{ color: 'var(--primary-darkest)' }}>Project Roadmap</h2>
                                <div className="list-group">
                                    <div className="list-group-item" style={{ backgroundColor: 'transparent' }}>
                                        <h5 className="mb-1" style={{ color: 'var(--primary-darkest)' }}>Phase 1: Yelp Integration</h5>
                                        <p className="mb-1" style={{ color: 'var(--primary-dark)' }}>Connect with Yelp API to provide real reviews and ratings for date locations</p>
                                    </div>
                                    <div className="list-group-item" style={{ backgroundColor: 'transparent' }}>
                                        <h5 className="mb-1" style={{ color: 'var(--primary-darkest)' }}>Phase 2: Google Maps</h5>
                                        <p className="mb-1" style={{ color: 'var(--primary-dark)' }}>Integrate Google Maps for directions and location visualization</p>
                                    </div>
                                    <div className="list-group-item" style={{ backgroundColor: 'transparent' }}>
                                        <h5 className="mb-1" style={{ color: 'var(--primary-darkest)' }}>Phase 3: Price Filtering</h5>
                                        <p className="mb-1" style={{ color: 'var(--primary-dark)' }}>Add price range filters and budget-friendly options</p>
                                    </div>
                                    <div className="list-group-item" style={{ backgroundColor: 'transparent' }}>
                                        <h5 className="mb-1" style={{ color: 'var(--primary-darkest)' }}>Phase 4: Weather API</h5>
                                        <p className="mb-1" style={{ color: 'var(--primary-dark)' }}>Weather-based date suggestions and alternative indoor/outdoor options</p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <button
                                    className="btn"
                                    onClick={() => navigate('/')}
                                    style={{
                                        backgroundColor: 'var(--primary-light)',
                                        color: 'var(--primary-darkest)',
                                        border: '1px solid var(--primary)',
                                    }}
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
