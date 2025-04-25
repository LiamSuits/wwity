import React, {useEffect, useRef, useState} from 'react'

const QuestionBox = ({attempts, winner}) => {
    const containerRef = useRef(null);
    const [questionBoxHeight, setQuestionBoxHeight] = useState(() => {
        const savedHeight = localStorage.getItem('height');
        return savedHeight ? `${savedHeight}px` : '42px';
    });

    useEffect(() => {
        if (containerRef.current) {
            const currentHeight = containerRef.current.scrollHeight;
            localStorage.setItem('height', currentHeight);
            setQuestionBoxHeight(`${currentHeight}px`);
        }
    }, [attempts, setQuestionBoxHeight]);

    return (
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
    )
}
export default QuestionBox
