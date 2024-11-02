import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function QuizPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const playerName = location.state?.playerName || "Player"
    const questions = location.state?.questions || []
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [feedback, setFeedback] = useState('')

    function handleAnswerSubmit(answer) {
        if (answer === questions[currentQuestionIndex].correct_answer) {
            setFeedback('Congrats! You answered correctly!')
        } else {
            setFeedback('You answered wrong :(')
        }

        setTimeout(function() {
            setFeedback('')
            setCurrentQuestionIndex(currentQuestionIndex + 1)
        }, 2000)
    }

    function handlePlayAgain() {
        navigate('/type-selection')
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]
        }
        return array
    }

    if (currentQuestionIndex >= questions.length) {
        return (
            <div>
                <h1>Quiz Complete! Thanks for playing, {playerName}!</h1>
                <button onClick={handlePlayAgain}>Play Again</button>
            </div>
        )
    }

    const currentQuestion = questions[currentQuestionIndex]
    const answers = shuffleArray([...currentQuestion.incorrect_answers, currentQuestion.correct_answer])

    return (
        <div>
            <h1>Question {currentQuestionIndex + 1}</h1>
            <h2>{currentQuestion.question}</h2>
            <div>
                {answers.map(function(answer, index) {
                    return (
                        <button key={index} onClick={function() { handleAnswerSubmit(answer) }}>
                            {answer}
                        </button>
                    )
                })}
            </div>
            {feedback && <p>{feedback}</p>}
        </div>
    )
}
