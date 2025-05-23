import React, {useEffect, useRef, useState} from 'react'

const Help = ({winner}) => {
    const [isOpen, setIsOpen] = useState(false);
    const infoRef = useRef(null);

    const awardDetails = {
        "Art Ross Trophy": "The Art Ross Trophy is given to the player who leads the NHL in points.",
        "Hart Trophy": "The Hart Trophy is given to the NHL's most valuable player.",
        "Ted Lindsay Award": "The Ted Lindsay Award is given to NHL's most outstanding player.",
        "Lester B. Pearson Award": "The Lester B. Pearson Award is given to NHL's most outstanding player.",
        "Lady Byng Trophy": "The Lady Byng trophy is given to an NHL player adjudged to have exhibited the best type of" +
            "sportsmanship and gentlemanly conduct combined with a high standard of playing ability.",
        "Vezina Trophy": "The Vezina Trophy is given to the NHL's best goaltender.",
        "Calder Trophy": "The Calder Trophy is given to the NHL's best rookie.",
        "Norris Trophy": "The Norris Trophy is given to the NHL's best defenseman.",
        "Conn Smythe Trophy": "The Conn Smythe Trophy is given to the most valuable player of the NHL playoffs.",
        "Selke Trophy": "The Selke Trophy is to the NHL forward who demonstrates the most skill in the defensive component of the game.",
        "Rocket Richard Trophy": "The Rocket Richard Trophy is given to the player who leads the NHL in goals."
    }

    // Close info box when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (infoRef.current && !infoRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative inline-block" ref={infoRef}>
            <button
                className="fixed bottom-15 left-1/2 transform -translate-x-1/2 w-66 bg-gray-500 hover:bg-gray-400
                text-white px-2 py-3 rounded-md shadow-lg cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                How do I play?
            </button>
            {isOpen && (
                <div className="fixed bottom-30 left-1/2 transform -translate-x-1/2 w-66 bg-gray-500 py-2 px-3 shadow-2xl rounded-md">
                    <p className="text-sm text-white text-left">
                        {awardDetails[winner.award]}
                        <br/>
                        <br/>
                        Enter the full name of the player who you think won the {winner.award} in {winner.year}.
                        <br/>
                        <br/>
                        You get five guesses and you get a new clue for every incorrect guess.
                        <br/>
                        <br/>
                        For the clue that says what conference the player played in, assume that current conference alignment applies to all past seasons.
                    </p>
                </div>
            )}
        </div>
    );
}

export default Help
