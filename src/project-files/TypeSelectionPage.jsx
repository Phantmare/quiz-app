import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function TypeSelectionPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const playerName = location.state?.playerName || "Player"

    function handleCategorySelection(category) {
        const myApi = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=medium&type=multiple`
        
        axios.get(myApi)
            .then(response =>  {
                navigate('/quiz', { state: { questions: response.data.results, playerName } })
                console.log(response)
            })
            .catch(error => {
                console.error('Error fetching questions:', error)
            })
    }

    return (
        <div>
            <h1>Type Selection Page</h1>
            <p>Welcome, {playerName}!</p>
            <p>Please select the type of quiz you would like to take:</p>
            <div>
                <button onClick={() => handleCategorySelection(27)}>Animals</button>
                <button onClick={() => handleCategorySelection(28)}>Vehicles</button>
                <button onClick={() => handleCategorySelection(11)}>Films</button>
            </div>
        </div>
    )
}
