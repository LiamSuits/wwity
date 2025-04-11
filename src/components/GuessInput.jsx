import React, {useState} from 'react'

const GuessInput = ({attempts, setAttempts, gameWon, setGameWon, attemptsExhausted, solution}) => {
    const [inputValue, setInputValue] = useState('');

    // This function returns true if the guess is within one character of the answer
    function checkGuess(guess, answer){
        // Ignore Case
        const guessLower = guess.toLowerCase();
        const answerLower = answer.toLowerCase();
        // Ensure that the lengths do not differ by more than one
        if (Math.abs(guessLower.length - answerLower.length) > 1){
            return false;
        }

        let diffs = 0;
        let g = 0;
        let a = 0;

        // Check for an extra character
        if (guessLower.length !== answerLower.length){
            diffs++;
        }

        while (g < guessLower.length && a < answerLower.length) {
            if (guessLower[g] !== answerLower[a]) {
                diffs++;
                if (diffs > 1){
                    return false;
                }
                // Handle longer and shorter cases
                if (guessLower.length > answerLower.length) {
                    // There's an extra character in the guess, so just increase the guess index
                    g++;
                } else if (guessLower.length < answerLower.length) {
                    // There's an extra character in the answer, so just increase the answer index
                    a++;
                } else {
                    g++;
                    a++;
                }
            } else {
                g++;
                a++;
            }
        }

        return diffs <= 1;
    }

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page refresh

        const trimmedInput = inputValue.trim();
        if (trimmedInput === '') return;// ignore empty input

        const alreadyGuessed = attempts.includes(trimmedInput);
        if (alreadyGuessed) return; // ignore dupes

        if (checkGuess(trimmedInput.toString(), solution.toString())) {
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
                focus:outline-none focus:ring-0 w-55"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Who do you think won it?"
            />
        </form>
    )
}
export default GuessInput
