import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebaseConfig'

export default function QuizPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const playerName = location.state?.playerName || 'Player'
  const questions = location.state?.questions || []
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [feedback, setFeedback] = useState('')
  const currentLevel = location.state?.currentLevel || 0
  const docId = location.state?.docId

  function handleAnswerSubmit(answer) {
    const currentQuestion = questions[currentQuestionIndex]

    if (answer === currentQuestion.correct_answer) {
      setFeedback('Correct!')
    } else {
      setFeedback(`Wrong! The correct answer was: ${currentQuestion.correct_answer}`)
    }

    setTimeout(function () {
      setFeedback('')
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        const newLevel = currentLevel + 1
        const userDocRef = doc(db, 'quiz-app-data', docId)

        updateDoc(userDocRef, {
          currentLevel: newLevel
        }).then(function () {
          navigate('/type-selection', {
            state: {
              playerName,
              currentLevel: newLevel,
              docId: docId
            }
          })
        }).catch(function (error) {
          console.error("Error updating level in Firestore:", error)
        })
      }
    }, 2000)
  }

  function handlePlayAgain() {
    navigate('/type-selection')
  }

  if (questions.length === 0) {
    return (
      <div>
        <h1>Thanks for playing, {playerName}!</h1>
        <button onClick={handlePlayAgain}>Play Again</button>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const answers = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers]

  const shuffledAnswers = answers.sort(function () {
    return Math.random() - 0.5
  })

  return (
    <div>
      <h1>Question {currentQuestionIndex + 1} of {questions.length}</h1>
      <h2>{currentQuestion.question}</h2>
      <div>
        {shuffledAnswers.map(function (answer, index) {
          return (
            <button key={index} onClick={function () { handleAnswerSubmit(answer)}}>
              {answer}
            </button>
          )
        })}
      </div>
      {feedback && <p>{feedback}</p>}
    </div>
  )
}

