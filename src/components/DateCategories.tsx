import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface DateCategoriesProps {
    onAddIdea: (idea: string) => void;
    customIdeas: string[];
}

const DateCategories: React.FC<DateCategoriesProps> = ({ onAddIdea, customIdeas }) => {
    const [addedIdeas, setAddedIdeas] = useState<Set<string>>(new Set(customIdeas));

    const categories = [
        {
            name: 'Food & Dining',
            icon: 'bi-cup-hot',
            ideas: [
                'Coffee Shop', 'Fine Dining', 'Food Truck', 'Brunch', 'Dessert Date',
                'Cooking Class', 'Wine Tasting', 'Picnic', 'Farmers Market', 'Bakery Tour'
            ]
        },
        {
            name: 'Active & Outdoors',
            icon: 'bi-bicycle',
            ideas: [
                'Hiking', 'Pickleball', 'Bike Ride', 'Rock Climbing', 'Kayaking',
                'Go on a Jog', 'Mini Golf', 'Bowling', 'Tennis', 'Frisbee Golf'
            ]
        },
        {
            name: 'Entertainment',
            icon: 'bi-film',
            ideas: [
                'Movie Theater', 'Concert', 'Comedy Show', 'Theater Play', 'Karaoke',
                'Arcade', 'Escape Room', 'Board Game Cafe', 'Trivia Night', 'Drive-in Movie'
            ]
        },
        {
            name: 'Cultural',
            icon: 'bi-building',
            ideas: [
                'Museum', 'Art Gallery', 'Historical Site', 'Botanical Garden', 'Zoo',
                'Aquarium', 'Cultural Festival', 'Bookstore', 'Poetry Reading', 'Architecture Tour'
            ]
        },
        {
            name: 'Relaxation',
            icon: 'bi-umbrella',
            ideas: [
                'Spa Day', 'Beach Day', 'Stargazing', 'Sunset Watching', 'Massage',
                'Hot Springs', 'Meditation Class', 'Yoga Session', 'Park Stroll', 'Hammocking'
            ]
        },
        {
            name: 'Adventure',
            icon: 'bi-compass',
            ideas: [
                'Skydiving', 'Hot Air Balloon', 'Zip Lining', 'Bungee Jumping', 'Helicopter Tour',
                'ATV Riding', 'Horseback Riding', 'Paragliding', 'White Water Rafting', 'Scuba Diving'
            ]
        },
        {
            name: 'Seasonal',
            icon: 'bi-calendar-event',
            ideas: [
                'Ice Skating', 'Pumpkin Patch', 'Christmas Lights', 'Apple Picking', 'Sledding',
                'Beach Bonfire', 'Haunted House', 'Corn Maze', 'Berry Picking', 'Festival'
            ]
        },
        {
            name: 'Creative',
            icon: 'bi-palette',
            ideas: [
                'Pottery Class', 'Paint Night', 'DIY Workshop', 'Photography Walk', 'Dance Lesson',
                'Music Lesson', 'Craft Fair', 'Candle Making', 'Flower Arranging', 'Glass Blowing'
            ]
        }
    ];

    const handleIdeaClick = (e: React.MouseEvent, idea: string) => {
        e.preventDefault();

        onAddIdea(idea);

        setAddedIdeas(prev => new Set([...prev, idea]));
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header" style={{ backgroundColor: 'var(--primary)' }}>
                <h5 className="mb-0 text-white">Date Categories</h5>
            </div>
            <div className="card-body p-0">
                <div className="accordion" id="dateCategories">
                    {categories.map((category, index) => (
                        <div className="accordion-item" key={index}>
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#category-${index}`}
                                    aria-expanded="false"
                                    aria-controls={`category-${index}`}
                                >
                                    <i className={`bi ${category.icon} me-2`}></i>
                                    {category.name}
                                </button>
                            </h2>
                            <div
                                id={`category-${index}`}
                                className="accordion-collapse collapse"
                                data-bs-parent="#dateCategories"
                            >
                                <div className="accordion-body">
                                    <div className="row g-2">
                                        {category.ideas.map((idea, ideaIndex) => {
                                            const isAdded = addedIdeas.has(idea) || customIdeas.includes(idea);
                                            return (
                                                <div className="col-md-6" key={ideaIndex}>
                                                    <button
                                                        className={`btn ${isAdded ? 'btn-success' : 'btn-outline-secondary'} w-100 text-start`}
                                                        onClick={(e) => handleIdeaClick(e, idea)}
                                                    >
                                                        {idea}
                                                        {isAdded && <i className="bi bi-check-circle-fill ms-2"></i>}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DateCategories; 