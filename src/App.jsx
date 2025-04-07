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
    }, [attempts]);

    const baseballSolution = {
        name: 'Albert Pujols',
        age: 28,
        position: '1st Base',
        statline: '.357/.462/.653 37HR 44SB',
        team: 'St. Louis Cardinals'
    }

    return (
        <div className="flex flex-col justify-center items-center mt-20">
            <div className="mb-5 font-bold">Who Won It That Year?</div>
            <div>National League MVP</div>
            <div>2008</div>
            <GuessInput setGuess={setGuess} attempts={attempts} setAttempts={setAttempts} />
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
