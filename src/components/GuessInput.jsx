import React, {useState} from 'react'

const GuessInput = ({setGuess, attempts, setAttempts}) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page refresh

        const trimmedInput = inputValue.trim();
        if (trimmedInput === '') return;// ignore empty input

        const alreadyGuessed = attempts.includes(trimmedInput);
        if (alreadyGuessed) return; // ignore dupes

        setGuess(inputValue); // Update the guess state with submitted value
        setAttempts(prevAttempts => [ inputValue, ...prevAttempts,]); // Add this guess to the list of attempts
        setInputValue(''); // Clear the input field
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                className="text-center border"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="???"
            />
        </form>
    )
}
export default GuessInput
