import React, {useState} from 'react'

const GuessInput = ({attempts, setAttempts, gameWon, setGameWon, attemptsExhausted, solution}) => {
    const [inputValue, setInputValue] = useState('');

    // Check if the guess is correct, allowing a difference of one character
    function checkGuess(guess, answer){
        // Ignore case
        const guessLower = guess.toLowerCase();
        const answerLower = answer.toLowerCase();

        if (Math.abs(guessLower.length - answerLower.length) > 1){
            return false;
        }

        let diffs = 0;
        let g = 0;
        let a = 0;

        while (g < guessLower.length && a < answerLower.length) {
            if (guessLower[g] !== answerLower[a]) {
                diffs++;
                if (diffs > 1){
                    return false;
                }
                if (guessLower.length > answerLower.length) {
                    g++;
                } else if (guessLower.length < answerLower.length) {
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

        if (g < guessLower.length || a < answerLower.length) {
            diffs++;
        }

        return diffs <= 1;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedInput = inputValue.trim();
        if (trimmedInput === '') return;

        const alreadyGuessed = attempts.includes(trimmedInput);
        if (alreadyGuessed) return;

        if (checkGuess(trimmedInput.toString(), solution.toString())) {
            setGameWon(true);
        } else {
            setAttempts(prevAttempts => [ ...prevAttempts, inputValue]);
        }
        setInputValue('');
    };

    return (
        <div>
            { attempts.length < 5 && !gameWon &&  (
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
            )}
        </div>
    )
}
export default GuessInput
