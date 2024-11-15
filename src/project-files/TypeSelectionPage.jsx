import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { collection, doc, setDoc } from 'firebase/firestore'
import { db } from '../config/firebaseConfig'

export default function TypeSelectionPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const playerName = location.state?.playerName || 'Player'
  const currentLevel = location.state?.currentLevel || 0
  const userDocId = location.state?.docId
  const currentQuizType = location.state?.currentQuizType || ''

  const [quizType, setQuizType] = useState(currentQuizType)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (quizType) {
      const userRef = doc(db, 'users', userDocId)

      setDoc(userRef, {
        currentQuizType: quizType
      }, { merge: true })
    }
  }, [quizType, userDocId])

  function handleCategorySelection(category, categoryName) {
    setQuizType(categoryName)
    setLoading(true)
    const myApi = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=medium&type=multiple`

    axios.get(myApi).then(function(response) {
      if (response.data.results) {
        const questions = response.data.results
        const quizData = {
          questions,
          category,
          timestamp: new Date()
        }

        const userQuizCollection = collection(db, 'users', userDocId, 'quiz-questions')
        const categoryDocId = `${categoryName}-questions`

        const docRef = doc(userQuizCollection, categoryDocId)
        setDoc(docRef, quizData).then(function() {
          setLoading(false)
          navigate('/quiz', {
            state: {
              questions,
              playerName,
              currentLevel,
              docId: userDocId,
              categoryDocId
            }
          })
        })
      }
    })
  }

  return (
    <div>
      <h1>Type Selection Page</h1>
      <p>Welcome, {playerName}!</p>
      <p>Please select the type of quiz you would like to take:</p>
      <div>
        <button onClick={function() { handleCategorySelection(27, 'animals') }}>Animals</button>
        <button onClick={function() { handleCategorySelection(28, 'vehicles') }}>Vehicles</button>
        <button onClick={function() { handleCategorySelection(11, 'films') }}>Films</button>
      </div>
      {loading && <p>Loading...</p>}
    </div>
  )
}
