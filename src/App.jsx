import React, {useState} from 'react'
import GuessInput from "./components/GuessInput.jsx";

const App = () => {
    const [guess, setGuess] = useState('');
    const [attempts, setAttempts] = useState([]);

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
