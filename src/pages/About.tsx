import React from 'react';

const About: React.FC = () => {
    return (
        <div className="container mt-5">
            <h1>About Date Randomizer</h1>

            <div className="card shadow-sm mb-4">
                <div className="card-header" style={{ backgroundColor: 'var(--primary)' }}>
                    <h5 className="mb-0 text-white">Project Overview</h5>
                </div>
                <div className="card-body">
                    <p>
                        Date Randomizer is a web application designed to help couples and friends find
                        interesting date ideas and nearby places to visit. Simply spin the wheel to get a
                        random date idea, then explore places in your area matching that activity.
                    </p>

                    <p>
                        The application uses your location (with permission) to find relevant places in
                        your area, and provides weather information to help you plan accordingly.
                    </p>
                </div>
            </div>

            <div className="card shadow-sm mb-4">
                <div className="card-header" style={{ backgroundColor: 'var(--primary)' }}>
                    <h5 className="mb-0 text-white">Project Phases</h5>
                </div>
                <div className="card-body">
                    <ul className="list-group">
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            ✅ Phase 1: UI Design and Core Functionality
                            <span className="badge bg-success">Completed</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            ✅ Phase 2: Integration with Location Services
                            <span className="badge bg-success">Completed</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            ✅ Phase 3: Weather API Integration
                            <span className="badge bg-success">Completed</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            ✅ Phase 4: User Authentication and Preferences
                            <span className="badge bg-success">Completed</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            ⏳ Phase 5: Advanced Recommendations and Analytics
                            <span className="badge bg-warning">In Progress</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-header" style={{ backgroundColor: 'var(--primary)' }}>
                    <h5 className="mb-0 text-white">Technologies Used</h5>
                </div>
                <div className="card-body">
                    <ul className="list-group">
                        <li className="list-group-item">React with TypeScript</li>
                        <li className="list-group-item">Bootstrap 5 for styling</li>
                        <li className="list-group-item">Google Maps API for location services</li>
                        <li className="list-group-item">OpenWeatherMap API for weather data</li>
                        <li className="list-group-item">Firebase Authentication</li>
                        <li className="list-group-item">Express.js backend</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default About;
