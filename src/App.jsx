import React, {useEffect, useRef, useState} from 'react'
import GuessInput from "./components/GuessInput.jsx";
import Toast from "./components/Toast.jsx";
import { collection, query, where, getDocs } from "firebase/firestore";
import {db} from "./config/firestore.js";

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
            setHeight('42px');
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

    // Store height in localStorage to reuse later
    const containerRef = useRef(null);
    const [height, setHeight] = useState(() => {
        const savedHeight = localStorage.getItem('height');
        return savedHeight ? `${savedHeight}px` : '42px';
    });

    useEffect(() => {
        if (containerRef.current) {
            const currentHeight = containerRef.current.scrollHeight;
            // Save height to localStorage to reuse on further renders
            localStorage.setItem('height', currentHeight);
            setHeight(`${currentHeight}px`);
        }
    }, [attempts]);

    const gameLink = "https://who-won-it-that-year.web.app"
    const [showToast, setShowToast] = useState(false);
    const handleCopy = (e) => {
        e.preventDefault(); // prevent link navigation
        let shareText;
        const guesses = attempts.length + 1;
        const awardText = winner.year + " " + winner.award;
        if (!gameWon) {
            shareText = "I didn't know who won the " + awardText + " 😢"
            + "\n\nYou can try here:" + "\n" + gameLink;
        } else {
            shareText = "I knew who won the " + awardText
                + " in " + guesses + (guesses === 1 ? " guess! 😎" : " guesses! 😎")
                + "\n\nYou can try here:" + "\n" + gameLink;
        }
        navigator.clipboard.writeText(shareText).then(() => {
            setShowToast(true);
        }).catch(err => {
            console.error("Failed to copy: ", err);
        });
    };

    if (winner === null) return <p>Loading...</p>;

    return (
        <div className="flex flex-col justify-center items-center mt-20 text-center">
            {showToast && (
                <Toast message="Copied to clipboard!" onClose={() => setShowToast(false)} />
            )}
            <div className="font-bold">Who Won It That Year?</div>
            <div className="font-bold mt-5">In {winner.year}:</div>
            <div id="question" className="transition-all duration-500 ease-in-out overflow-hidden border-2 pt-2 pb-2.5 rounded-md mb-5 w-65"
                 style={{height}} ref={containerRef}>
                Won the {winner.award}
                {attempts.length > 0 && (<div>Was {winner.age} years old</div>)}
                {attempts.length > 1 && (<div>Had {winner.statline}</div>)}
                {attempts.length > 2 && (<div>Played {winner.position}</div>)}
                {attempts.length > 3 && (<div>Played for the {winner.team}</div>)}
            </div>
            <div>
                <ul>
                    {attempts.map((attempt, index) => (
                        <li key={index}>
                            <div>❌ {attempt} ❌</div>
                        </li>
                    ))}
                </ul>
                {gameWon && (
                    <div>✅ {winner.solution} ✅</div>
                )}
            </div>
            <div className="mt-5">
                {attemptsExhausted && !gameWon && (
                    <div>
                        <div>
                            Sorry, you didn't know who won it that year.<br/>
                            The answer was {winner.solution}.
                        </div>
                    </div>
                )}
                {gameWon && (
                    <div>
                        Nice work, you know ball.
                    </div>
                )}
                {(gameWon || attemptsExhausted) && (
                    <div>
                        <a href="#"
                           className="text-blue-600 underline hover:text-blue-800 hover:no-underline"
                           onClick={handleCopy}>
                            Share Result
                        </a>
                    </div>
                )}
                { attempts.length < 5 && !gameWon &&  (
                    <GuessInput attempts={attempts} setAttempts={setAttempts} gameWon={gameWon}
                                setGameWon={setGameWon} attemptsExhausted={attemptsExhausted}
                                solution={winner.solution}/>
                )}
            </div>
        </div>
)
}
export default App
