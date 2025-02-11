import React, { useState } from 'react';
import SpinWheel from '../components/SpinWheel';
import DateIdeasCard from '../components/DateIdeasCard';

const Home: React.FC = () => {
    const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
    const [customIdeas, setCustomIdeas] = useState<string[]>([
        "Dinner Date",
        "Movie Night",
        "Hiking Adventure",
        "Picnic in the Park"
    ]);

    const handleAddIdea = (idea: string) => {
        setCustomIdeas([...customIdeas, idea]);
    };

    const handleRemoveIdea = (index: number) => {
        setCustomIdeas(customIdeas.filter((_, i) => i !== index));
    };

    return (
        <div className="container-fluid mt-4">
            <div className="row">
                <div className="col-md-8">
                    <div className="text-center mb-4">
                        <h1 className="display-4" style={{ color: '#040f0f' }}>Date Night Randomizer</h1>
                        <p className="lead" style={{ color: '#57737a' }}>Spin the wheel to get your next date idea!</p>
                    </div>
                    <div className="d-flex justify-content-center">
                        <SpinWheel options={customIdeas} onSelect={setSelectedIdea} />
                    </div>
                </div>
                
                <div className="col-md-4">
                    <DateIdeasCard
                        onAddIdea={handleAddIdea}
                        ideas={customIdeas}
                        onRemoveIdea={handleRemoveIdea}
                    />
                </div>
            </div>

            {selectedIdea && (
                <div className="mt-4">
                    <div className="card shadow-sm">
                        <div className="card-header text-white" style={{ backgroundColor: '#85bdbf' }}>
                            <h5 className="mb-0">Selected Date Idea</h5>
                        </div>
                        <div className="card-body" style={{ backgroundColor: '#c9fbff10' }}>
                            <h2 className="card-title" style={{ color: '#040f0f' }}>{selectedIdea}</h2>
                            <p className="card-text" style={{ color: '#57737a' }}>
                                Get ready for a wonderful time with your special someone!
                            </p>
                            <div className="d-flex justify-content-end">
                                <button 
                                    className="btn"
                                    onClick={() => setSelectedIdea(null)}
                                    style={{
                                        backgroundColor: '#c2fcf7',
                                        color: '#040f0f',
                                        border: '1px solid #85bdbf',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = '#85bdbf';
                                        e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = '#c2fcf7';
                                        e.currentTarget.style.color = '#040f0f';
                                    }}
                                >
                                    Choose Another
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
