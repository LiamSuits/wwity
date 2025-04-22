import React, {useEffect, useRef, useState} from 'react'
import GuessInput from "./components/GuessInput.jsx";
import Toast from "./components/Toast.jsx";
import { collection, query, where, getDocs } from "firebase/firestore";
import {db} from "./config/firestore.js";
import Guesses from "./components/Guesses.jsx";
import EndGame from "./components/EndGame.jsx";
import Help from "./components/Help.jsx";

const App = () => {
    const today = new Date();
    const todayFormatted = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    // const todayFormatted = '23/4/2025';
    const lastVisit = localStorage.getItem('lastVisitDate');
    let newDay = false;
    if (lastVisit === null || lastVisit !== todayFormatted) {
        // New day detected, clear storage and reset the game
        newDay = true;
        localStorage.clear();
        localStorage.setItem('lastVisitDate', todayFormatted);
    }

    const getWinnerByGameDate = async (gamedate) => {
        try {
            const winnersRef = collection(db, "winners");
            const q = query(winnersRef, where("gamedate", "==", gamedate));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.log("Something went wrong, couldn't find the game for today.");
                return null;
            }
            // Only getting one doc
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() };

        } catch (error) {
            console.error("Error fetching game.", error);
            return null;
        }
    };

    const [winner, setWinner] = useState(() => {
        const storedWinner = localStorage.getItem('winner');
        return storedWinner ? JSON.parse(storedWinner) : null;
    });

    useEffect(() => {
        localStorage.setItem('winner', JSON.stringify(winner));
    }, [winner]);

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

    const [questionBoxHeight, setQuestionBoxHeight] = useState(() => {
        const savedHeight = localStorage.getItem('height');
        return savedHeight ? `${savedHeight}px` : '42px';
    });

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

    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        const fetchWinner = async () => {
            const result = await getWinnerByGameDate(todayFormatted);
            setWinner(result);
        };

        const updateHasLoaded = async () => {
            if (newDay || winner === null) {
                await fetchWinner();  // Ensure fetch finishes before updating state
            }
            setHasLoaded(true);  // Only set hasLoaded to true after async work is done
        };

        updateHasLoaded();
    }, []);

    // Store height in localStorage to reuse later
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            const currentHeight = containerRef.current.scrollHeight;
            // Save height to localStorage to reuse on further renders
            localStorage.setItem('height', currentHeight);
            setQuestionBoxHeight(`${currentHeight}px`);
        }
    }, [attempts, setQuestionBoxHeight]);

    const [showToast, setShowToast] = useState(false);

    if (winner === null || !hasLoaded) return <p>Loading...</p>;

    return (
        <div className="flex flex-col justify-center items-center mt-20 text-center">
            {showToast && (
                <Toast message="Copied to clipboard!" onClose={() => setShowToast(false)} />
            )}
            <Help winner={winner}/>
            <div className="font-bold">Who Won It That Year?</div>
            <div className="font-bold mt-5">In {winner.year}:</div>
            <div id="question" className="transition-all duration-500 ease-in-out overflow-hidden border-2 pt-2 pb-2.5 rounded-md mb-5 w-65"
                 style={{height: questionBoxHeight}} ref={containerRef}>
                Won the {winner.award}
                {attempts.length > 0 && (<div>Was {winner.age} years old</div>)}
                {attempts.length > 1 && (<div>Played in the {winner.conference}</div>)}
                {attempts.length > 2 && (
                    (winner.award === "Norris Trophy" || winner.award === "Vezina Trophy") ? (
                        <div>{winner.success}</div>
                    ) : (
                        <div>Played {winner.position}</div>
                    )
                )}
                {attempts.length > 3 && (<div>Played for the {winner.team}</div>)}
            </div>
            <Guesses attempts={attempts} gameWon={gameWon} winner={winner} />
            <div className="mt-5">
                <EndGame attemptsExhausted={attemptsExhausted} gameWon={gameWon} winner={winner} attempts={attempts}
                         setShowToast={setShowToast} />
                <GuessInput attempts={attempts} setAttempts={setAttempts} gameWon={gameWon} setGameWon={setGameWon}
                            attemptsExhausted={attemptsExhausted} solution={winner.solution}/>
            </div>
        </div>
)
}
export default App
