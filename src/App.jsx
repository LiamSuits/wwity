import React, {useEffect, useState} from 'react'
import GuessInput from "./components/GuessInput.jsx";

const App = () => {
    const [guess, setGuess] = useState('');

    const [attempts, setAttempts] = useState(() => {
        const savedAttempts = localStorage.getItem('attempts');
        if (savedAttempts === null) {
            return [];
        } else {
            return JSON.parse(savedAttempts);
        }
    });

    useEffect(() => {
        localStorage.setItem('attempts', JSON.stringify(attempts));
        if (attempts.length >= 5) {
            setAttemptsExhausted(true); // If there's more than 5 attempts, set the this flag to true
        }
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

    const baseballSolution = 'Albert Pujols';

    const baseballClues = {
        age: 28,
        position: '1st Base',
        statline: '.357/.462/.653 37HR 44SB',
        team: 'St. Louis Cardinals'
    }

    useEffect(() => {
        if (guess === baseballSolution){
            setGameWon(true);
        }
    }, [guess]);

    return (
        <div className="flex flex-col justify-center items-center mt-20">
            <div className="mb-5 font-bold">Who Won It That Year?</div>
            <div>National League MVP</div>
            <div>2008</div>
            {attempts.length > 0 && (
                <div>{baseballClues.age}</div>
            )}
            {attempts.length > 1 && (
                <div>{baseballClues.position}</div>
            )}
            {attempts.length > 2 && (
                <div>{baseballClues.statline}</div>
            )}
            {attempts.length > 3 && (
                <div>{baseballClues.team}</div>
            )}
            <GuessInput setGuess={setGuess} attempts={attempts} setAttempts={setAttempts}
                        gameWon={gameWon} attemptsExhausted={attemptsExhausted} />
            <ul>
                {attempts.map((attempt, index) => (
                    <li key={index}>
                        <div className="text-center">
                            {attempt}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
)
}
export default App
