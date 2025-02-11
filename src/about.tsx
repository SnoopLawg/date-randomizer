import React from 'react';

const About: React.FC = () => {
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            <h1>About Date Randomizer</h1>
            <p>
                Welcome to the Date Randomizer app! This app is designed to help you and your partner decide on 
                fun and exciting activities for your dates. Whether you're looking to go out to eat, grab a snack, 
                visit famous places, or play some board games, we've got you covered.
            </p>
            <p>
                Simply use our randomizer feature to get a spontaneous suggestion for your next date. No more 
                indecisiveness or arguments about what to do - let the Date Randomizer make the choice for you!
            </p>
            <p>
                Our app goes beyond simple suggestions by allowing users to filter ideas based on preferences 
                like price, distance, and weather conditions. By integrating with APIs like Yelp, Google Places, 
                and OpenWeather, we ensure every suggestion is personalized and practical for your location.
            </p>
            <p>
                We are also planning interactive features like spin wheels, shuffle animations, and even a way 
                to share pictures and memories from your dates. We hope you enjoy using our app and that it helps 
                you create memorable experiences with your loved ones.
            </p>
            <button 
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        backgroundColor: '#6C757D',
                        color: '#FFF',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                    onClick={() => window.location.href = '/'}
                >
                    Home
                </button>
        </div>
    );
};

export default About;
