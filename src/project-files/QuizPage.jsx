import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { collection, doc, updateDoc, getDocs, where, query } from 'firebase/firestore'
import { db } from '../config/firebaseConfig'

export default function QuizPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const playerName = location.state?.playerName
  const currentLevel = location.state?.currentLevel
  const docId = location.state?.docId
  const currentQuizType = location.state?.currentQuizType
  const initialQuestions = location.state?.questions || []

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questions, setQuestions] = useState(initialQuestions) 
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    if (currentLevel && currentQuizType) {
      continueFromLevel()
    }
  })  

  function continueFromLevel() {
    if (currentLevel && currentQuizType) {
      const usersCollectionRef = collection(db, 'users')
      const userQuery = query(usersCollectionRef, where('userId', '==', docId))

      getDocs(userQuery)
        .then(function(querySnapshot) {
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0]
            console.log('User Document:', userDoc.id, userDoc.data())

            const playersPrevQuestionsRef = collection(db, 'users', userDoc.id, 'quiz-questions')

            const quizQuery = query(playersPrevQuestionsRef, where('category', '==', currentQuizType))

            getDocs(quizQuery)
              .then(function(subCollectionSnapshot) {
                if (!subCollectionSnapshot.empty) {
                  const fetchedQuestions = []
                  subCollectionSnapshot.forEach(function(doc) {
                    const questionData = doc.data()
                    console.log('Quiz Data:', questionData)
                    fetchedQuestions.push(questionData)  
                  })
                  setQuestions(fetchedQuestions) 
                  setCurrentQuestionIndex(0) 
                  setFeedback('')  
                } else {
                  console.log('No quiz document found for this category and level.')
                }
              })
              .catch(function(error) {
                console.error('Error fetching quiz document:', error)
              })
          } else {
            console.log('No user found with the given ID.')
          }
        })
        .catch(function(error) {
          console.error('Error fetching user:', error)
        })
    }
  }

  function handleAnswerSubmit(answer) {
    const currentQuestion = questions[currentQuestionIndex]
    if (answer === currentQuestion.correct_answer) {
      setFeedback('Correct!')
    } else {
      setFeedback(`Wrong! The correct answer was: ${currentQuestion.correct_answer}`)
    }

    setTimeout(function() {
      setFeedback('')
      const newLevel = currentQuestionIndex + 1
      const userDocRef = doc(db, 'users', docId)
      updateDoc(userDocRef, { currentLevel: newLevel })

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        navigate('/type-selection', {
          state: {
            playerName,
            currentLevel: newLevel,
            docId
          }
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
  const shuffledAnswers = answers.sort(function() { return Math.random() - 0.5 })

  return (
    <div>
      <h1>Question {currentQuestionIndex + 1} of {questions.length}</h1>
      <h2>{currentQuestion.question}</h2>
      <div>
        {shuffledAnswers.map(function(answer, index) {
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
