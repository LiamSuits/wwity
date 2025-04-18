import React from 'react'

const EndGame = ({attemptsExhausted, gameWon, winner, attempts, setShowToast}) => {
    const gameLink = "https://who-won-it-that-year.web.app";

    const handleCopy = (e) => {
        e.preventDefault(); // prevent link navigation
        let shareText;
        const guesses = attempts.length + 1;
        const awardText = winner.year + " " + winner.award;
        if (!gameWon) {
            shareText = "I didn't know who won the " + awardText + " 😢"
                + "\n\nYou can try here:" + "\n" + gameLink;
        } else {
            shareText = "I knew who won the " + awardText
                + " in " + guesses + (guesses === 1 ? " guess! 😎" : " guesses! 😎")
                + "\n\nYou can try here:" + "\n" + gameLink;
        }
        navigator.clipboard.writeText(shareText).then(() => {
            setShowToast(true);
        }).catch(err => {
            console.error("Failed to copy: ", err);
        });
    };

    return (
        <div>
            {attemptsExhausted && !gameWon && (
                <div>
                    <div>
                        Sorry, you didn't know who won it that year.<br/>
                        The answer was {winner.solution}.
                    </div>
                </div>
            )}
            {gameWon && (
                <div>
                    Nice work, you know ball.
                </div>
            )}
            {(gameWon || attemptsExhausted) && (
                <div>
                    <a href="#"
                       className="text-blue-600 underline hover:text-blue-800 hover:no-underline"
                       onClick={handleCopy}>
                        Share Result
                    </a>
                </div>
            )}
        </div>
    )
}
export default EndGame
