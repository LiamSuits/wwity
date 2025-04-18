import React from 'react'

const Guesses = ({attempts, gameWon, winner}) => {
    return (
        <div>
            <ul>
                {attempts.map((attempt, index) => (
                    <li key={index}>
                        <div>❌ {attempt} ❌</div>
                    </li>
                ))}
            </ul>
            {gameWon && (
                <div>✅ {winner.solution} ✅</div>
            )}
        </div>
    )
}
export default Guesses
