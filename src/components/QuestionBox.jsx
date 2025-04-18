import React, {useEffect, useRef} from 'react'

export const QuestionBox = ({attempts, height, setHeight, winner}) => {
    // Store height in localStorage to reuse later
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            const currentHeight = containerRef.current.scrollHeight;
            // Save height to localStorage to reuse on further renders
            localStorage.setItem('height', currentHeight);
            setHeight(`${currentHeight}px`);
        }
    }, [attempts, setHeight]);

    return (
        <div id="question" className="transition-all duration-500 ease-in-out overflow-hidden border-2 pt-2 pb-2.5 rounded-md mb-5 w-65"
             style={{height}} ref={containerRef}>
            Won the {winner.award}
            {attempts.length > 0 && (<div>Was {winner.age} years old</div>)}
            {attempts.length > 1 && (<div>Had {winner.statline}</div>)}
            {attempts.length > 2 && (<div>Played {winner.position}</div>)}
            {attempts.length > 3 && (<div>Played for the {winner.team}</div>)}
        </div>
    )
}
