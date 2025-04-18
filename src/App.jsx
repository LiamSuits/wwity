import React, {useEffect, useState} from 'react'
import GuessInput from "./components/GuessInput.jsx";
import Toast from "./components/Toast.jsx";
import { collection, query, where, getDocs } from "firebase/firestore";
import {db} from "./config/firestore.js";
import {QuestionBox} from "./components/QuestionBox.jsx";
import Guesses from "./components/Guesses.jsx";
import EndGame from "./components/EndGame.jsx";

const App = () => {
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

    const [winner, setWinner] = useState(null);
    useEffect(() => {
        const today = new Date();
        const todayFormatted = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
        const lastVisit = localStorage.getItem('lastVisitDate');
        if (lastVisit === null || lastVisit !== todayFormatted) {
            // New day detected, clear storage and reset the game
            localStorage.clear();
            localStorage.setItem('lastVisitDate', todayFormatted);
            setAttemptsExhausted(false);
            setGameWon(false);
            setAttempts([]);
            setQuestionBoxHeight('42px');
        }
        const fetchWinner = async () => {
            const result = await getWinnerByGameDate(todayFormatted);
            setWinner(result);
        };
        fetchWinner();
    }, []);

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

    const [showToast, setShowToast] = useState(false);

    if (winner === null) return <p>Loading...</p>;

    return (
        <div className="flex flex-col justify-center items-center mt-20 text-center">
            {showToast && (
                <Toast message="Copied to clipboard!" onClose={() => setShowToast(false)} />
            )}
            <div className="font-bold">Who Won It That Year?</div>
            <div className="font-bold mt-5">In {winner.year}:</div>
            <QuestionBox attempts={attempts} height={questionBoxHeight} setHeight={setQuestionBoxHeight} winner={winner} />
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
