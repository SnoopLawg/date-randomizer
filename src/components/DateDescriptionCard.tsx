import React from 'react';

interface DateDescriptionCardProps {
    dateIdea: string;
}

const DateDescriptionCard: React.FC<DateDescriptionCardProps> = ({ dateIdea }) => {
    // Object mapping date ideas to their descriptions and tips
    const dateDescriptions: Record<string, { description: string; tips: string[] }> = {
        "Dinner Date": {
            description: "A classic dining experience to enjoy delicious food and great conversation.",
            tips: [
                "Make reservations in advance for popular restaurants",
                "Try a cuisine you've never had before",
                "Consider a restaurant with a view or unique atmosphere"
            ]
        },
        "Movie Night": {
            description: "Enjoy the latest films or timeless classics for a relaxed evening together.",
            tips: [
                "Check film ratings and reviews beforehand",
                "Consider movies that spark meaningful conversations",
                "Don't forget to grab some popcorn and snacks"
            ]
        },
        "Hiking Adventure": {
            description: "Connect with nature and each other while exploring scenic trails and viewpoints.",
            tips: [
                "Check weather conditions before heading out",
                "Pack water, snacks, and appropriate footwear",
                "Choose a trail that matches your fitness levels"
            ]
        },
        "Picnic in the Park": {
            description: "A charming outdoor meal surrounded by nature's beauty.",
            tips: [
                "Pack easy-to-eat foods and a blanket",
                "Bring games or cards for entertainment",
                "Choose a scenic spot with shade"
            ]
        },
        "Coffee Shop": {
            description: "A casual and cozy setting for meaningful conversations over a warm drink.",
            tips: [
                "Try a local specialty coffee or tea",
                "Consider bringing a book or game to share",
                "Ask the barista for recommendations"
            ]
        },
        "Museum": {
            description: "Explore art, history, and culture together while expanding your horizons.",
            tips: [
                "Check for special exhibitions or events",
                "Consider guided tours for deeper insights",
                "Take your time to discuss pieces that interest you both"
            ]
        },
        "Park": {
            description: "Enjoy the outdoors and fresh air in a relaxing green space.",
            tips: [
                "Bring a frisbee or ball for active fun",
                "Check if there are any events happening",
                "Find a quiet spot for relaxation"
            ]
        },
        "Amusement Park": {
            description: "Thrill-seeking fun and excitement to create lasting memories together.",
            tips: [
                "Research ride wait times and get there early",
                "Take photos of your reactions on rides",
                "Try unique park foods and treats"
            ]
        },
        "Bowling": {
            description: "A light-hearted competitive activity that's perfect for laughs and casual fun.",
            tips: [
                "Consider renting shoes ahead of time",
                "Make it interesting with friendly wagers",
                "Celebrate strikes with signature moves"
            ]
        },
        "Concert": {
            description: "Share your love of music while experiencing the energy of a live performance.",
            tips: [
                "Buy tickets early for better seats",
                "Check the venue's rules about bags and cameras",
                "Create a playlist of the artist's songs to enjoy beforehand"
            ]
        },
        "Zoo": {
            description: "Discover fascinating wildlife together and learn about conservation efforts.",
            tips: [
                "Check feeding times for popular animals",
                "Visit early in the day when animals are most active",
                "Support conservation efforts through zoo donations"
            ]
        },
        "Aquarium": {
            description: "Explore the mesmerizing underwater world and marine life together.",
            tips: [
                "Look for special exhibits or touch tanks",
                "Take time to watch the hypnotic jellyfish",
                "Learn about ocean conservation together"
            ]
        },
        "Art Gallery": {
            description: "Stimulate conversation and appreciation for creativity and artistic expression.",
            tips: [
                "Read about current exhibitions before visiting",
                "Discuss your interpretations of abstract pieces",
                "Support local artists by checking out smaller galleries too"
            ]
        },
        "Cooking Class": {
            description: "Learn new culinary skills together while creating a delicious meal.",
            tips: [
                "Choose cuisines you both want to explore",
                "Take photos of the process for your recipe collection",
                "Recreate your favorite dishes at home afterward"
            ]
        },
        "Farmers Market": {
            description: "Browse local produce and artisanal goods in a vibrant community atmosphere.",
            tips: [
                "Go early for the best selection",
                "Sample unique foods and drinks",
                "Talk to vendors about their products and get cooking tips"
            ]
        },
        "Bookstore": {
            description: "Browse literary treasures together and share your favorite books and authors.",
            tips: [
                "Choose books for each other to read",
                "Check if the bookstore has a café for reading",
                "Look for author events or readings"
            ]
        },
        "Ice Cream Shop": {
            description: "Indulge in sweet treats and try unique flavors together.",
            tips: [
                "Ask for samples of unfamiliar flavors",
                "Create a flavor ranking system together",
                "Take a walk while enjoying your treats"
            ]
        },
        "Board Game Cafe": {
            description: "Enjoy friendly competition and strategy in a cozy gaming atmosphere.",
            tips: [
                "Try games you've never played before",
                "Ask staff for recommendations based on your interests",
                "Order snacks to share while playing"
            ]
        },
        "Botanical Garden": {
            description: "Stroll among beautiful plants and flowers in a serene natural setting.",
            tips: [
                "Check for seasonal blooms or special exhibits",
                "Bring a camera for close-up flower photography",
                "Find a quiet bench to sit and enjoy the surroundings"
            ]
        },
        "Dance Class": {
            description: "Learn new moves together while having fun and getting closer physically.",
            tips: [
                "Choose a dance style you're both interested in trying",
                "Wear comfortable clothes and shoes",
                "Don't worry about perfection—focus on having fun"
            ]
        }
    };

    // Default description for any date idea not in our mapping
    const defaultDescription = {
        description: `Explore this exciting "${dateIdea}" date together and create memorable experiences.`,
        tips: [
            "Research locations beforehand for the best experience",
            "Be open to spontaneous moments and detours",
            "Take photos to capture your memories"
        ]
    };

    // Get the description for the current date idea or use default
    const dateInfo = dateDescriptions[dateIdea] || defaultDescription;

    // For debugging
    console.log("Rendering DateDescriptionCard for:", dateIdea);
    console.log("Using description:", dateInfo.description === defaultDescription.description ? "DEFAULT" : "CUSTOM");

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header" style={{ backgroundColor: 'var(--primary)' }}>
                <h5 className="mb-0 text-white">{dateIdea} - Date Details</h5>
            </div>
            <div className="card-body">
                <p className="lead">{dateInfo.description}</p>

                <h6 className="mt-3">Tips for a Great Experience:</h6>
                <ul className="list-group list-group-flush">
                    {dateInfo.tips.map((tip, index) => (
                        <li key={index} className="list-group-item bg-transparent">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            {tip}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DateDescriptionCard; 