import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function TypeSelectionPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const playerName = location.state?.playerName || 'Player'
  const currentLevel = location.state?.currentLevel || 0
  const userDocId = location.state?.docId

  function handleCategorySelection(category) {
    const myApi = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=medium&type=multiple`

    axios.get(myApi)
      .then(function (response) {
        if (response.data.results) {
          navigate('/quiz', {
            state: {
              questions: response.data.results,
              playerName,
              currentLevel,
              docId: userDocId
            }
          })
        } else {
          console.error('No questions found in response.')
        }
      })
      .catch(function (error) {
        console.error('Error fetching questions:', error)
      })
  }

  return (
    <div>
      <h1>Type Selection Page</h1>
      <p>Welcome, {playerName}!</p>
      <p>Please select the type of quiz you would like to take:</p>
      <div>
        <button onClick={function () { handleCategorySelection(27) }}>Animals</button>
        <button onClick={function () { handleCategorySelection(28) }}>Vehicles</button>
        <button onClick={function () { handleCategorySelection(11) }}>Films</button>
      </div>
    </div>
  )
}
