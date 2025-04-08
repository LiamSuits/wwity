import React, {useState} from 'react'

const GuessInput = ({attempts, setAttempts, gameWon, setGameWon, attemptsExhausted, baseballSolution}) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page refresh

        const trimmedInput = inputValue.trim();
        if (trimmedInput === '') return;// ignore empty input

        const alreadyGuessed = attempts.includes(trimmedInput);
        if (alreadyGuessed) return; // ignore dupes

        if (trimmedInput === baseballSolution){
            setGameWon(true);
        } else {
            setAttempts(prevAttempts => [ ...prevAttempts, inputValue]); // Add this guess to the list of attempts
        }
        setInputValue(''); // Clear the input field
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                disabled={attemptsExhausted || gameWon}
                className="text-center border-0 border-b-2 border-black
                focus:outline-none focus:ring-0 w-55 mt-5"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Who do you think won it?"
            />
        </form>
    )
}
export default GuessInput
