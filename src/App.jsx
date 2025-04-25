import React, {useEffect, useState} from 'react'
import GuessInput from "./components/GuessInput.jsx";
import Toast from "./components/Toast.jsx";
import { collection, query, where, getDocs } from "firebase/firestore";
import {db} from "./config/firestore.js";
import Guesses from "./components/Guesses.jsx";
import EndGame from "./components/EndGame.jsx";
import Help from "./components/Help.jsx";
import QuestionBox from "./components/QuestionBox.jsx";

const App = () => {
    const today = new Date();
    const todayFormatted = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    // Quick and dirty way to test out dates in production
    // const todayFormatted = '26/4/2025';
    const lastVisit = localStorage.getItem('lastVisitDate');
    let newDay = false;
    if (lastVisit === null || lastVisit !== todayFormatted) {
        // New day, reset the game
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
                console.log("Whoops, there's not a game for today's date.");
                return null;
            }
            // Assume only one doc has this date
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
            // If there's more than 5 attempts, game over
            setAttemptsExhausted(true);
        }
        localStorage.setItem('attempts', JSON.stringify(attempts));
    }, [attempts]);

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

    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        // This is the only place we can update winner
        const fetchWinner = async () => {
            const result = await getWinnerByGameDate(todayFormatted);
            setWinner(result);
        };

        const loadGame = async () => {
            if (newDay || winner === null) {
                await fetchWinner();  // Ensure fetch finishes before updating state
            }
            setHasLoaded(true);  // Only set hasLoaded to true after async work is done
        };

        loadGame().catch((err) => {
            console.error('Error loading the game: ', err);
        });
    }, []);

    const [showToast, setShowToast] = useState(false);

    // Loading icon
    if (winner === null || !hasLoaded) return (
        <div className="flex flex-col justify-center items-center text-center bg-white mt-20">
            <div className="text-6xl animate-pulse text-gray-800">?</div>
        </div>
    )

    return (
        <div className="flex flex-col justify-center items-center mt-15 text-center">
            {showToast && (
                <Toast message="Copied to clipboard!" onClose={() => setShowToast(false)} />
            )}
            <Help winner={winner}/>
            <div className="font-bold">Who Won It That Year?</div>
            <div className="font-bold mt-5">In {winner.year}:</div>
            <QuestionBox attempts={attempts} winner={winner} />
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
