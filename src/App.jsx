import React, {useEffect, useRef, useState} from 'react'
import GuessInput from "./components/GuessInput.jsx";

const App = () => {
    const [attempts, setAttempts] = useState(() => {
        const savedAttempts = localStorage.getItem('attempts');
        if (savedAttempts === null) {
            return [];
        } else {
            return JSON.parse(savedAttempts);
        }
    });

    useEffect(() => {
        if (attempts.length >= 5) {
            setAttemptsExhausted(true); // If there's more than 5 attempts, set this flag to true
        }
        localStorage.setItem('attempts', JSON.stringify(attempts));
    }, [attempts]); // When the attempts array is updated, add the new array to localStorage

    const [gameWon, setGameWon] = useState(() => {
       const savedGameWon = localStorage.getItem('gameWon');
       if (savedGameWon === null) {
           return false;
       } else {
           return savedGameWon === 'true';
       }
    });

    useEffect(() => {
        localStorage.setItem('gameWon', JSON.stringify(gameWon));
    }, [gameWon]);

    const [attemptsExhausted, setAttemptsExhausted] = useState(() => {
        const savedAttemptsExhausted = localStorage.getItem('attemptsExhausted');
        if (savedAttemptsExhausted === null) {
            return false;
        } else {
            return savedAttemptsExhausted === 'true';
        }
    });

    useEffect(() => {
        localStorage.setItem('attemptsExhausted', JSON.stringify(attemptsExhausted));
    }, [attemptsExhausted]);

    const award = 'National League MVP';
    const year = '2008';

    const baseballSolution = 'Albert Pujols';
    const baseballClues = {
        age: 28,
        position: '1st Base',
        statline: '.357/.462/.653 37HR 44SB',
        team: 'St. Louis Cardinals'
    }

    const ageClue = baseballClues.age + ' years old';
    const positionClue = 'Played ' + baseballClues.position;
    const statlineClue = 'Had ' + baseballClues.statline;
    const teamClue = 'Played for the ' + baseballClues.team;

    // Style Logic
    const containerRef = useRef(null);
    const [height, setHeight] = useState('auto'); // Start with 'auto' height

    useEffect(() => {
        // Recalculate height when attempts array changes
        if (containerRef.current) {
            // Set the height based on the scrollHeight of the container
            setHeight(`${containerRef.current.scrollHeight}px`);
        }
    }, [attempts]); // Run effect when the 'attempts' array changes

    return (
        <div className="flex flex-col justify-center items-center mt-20 text-center">
            <div className="font-bold">Who Won It That Year?</div>
            <div className="font-bold mt-5">In {year}:</div>
            <div id="question" className="transition-all duration-500 ease-in-out overflow-hidden border-2 pt-2 pb-3 rounded-md mb-5 w-65"
                 style={{height}} ref={containerRef}>
                {award}
                {attempts.length > 0 && (<div>{ageClue}</div>)}
                {attempts.length > 1 && (<div>{positionClue}</div>)}
                {attempts.length > 2 && (<div>{statlineClue}</div>)}
                {attempts.length > 3 && (<div>{teamClue}</div>)}
            </div>
            <div className="text-left">
                <ul>
                    {attempts.map((attempt, index) => (
                        <li key={index}>
                            <div>❌ {attempt}</div>
                        </li>
                    ))}
                </ul>
                {gameWon && (
                    <div>✔ {baseballSolution}</div>
                )}
            </div>
            { attempts.length < 5 && !gameWon &&  (
                <GuessInput attempts={attempts} setAttempts={setAttempts} gameWon={gameWon}
                            setGameWon={setGameWon} attemptsExhausted={attemptsExhausted}
                            baseballSolution={baseballSolution}/>
            )}
        </div>
)
}
export default App
