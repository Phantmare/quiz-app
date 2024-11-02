import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import mainLogo from '../images/Kahoot Logo.png'
import { db } from '../config/firebaseConfig'
import { ref, set, push } from "firebase/database" 
//import { ref as sRef } from 'firebase/storage';

export default function EnteringPage() {
    const navigate = useNavigate()
    const [playerName, setPlayerName] = useState('')

    useEffect(() => {
        const savePlayerNames = async () => {
            const newNames = push(ref(db, "quiz-app-data"))
            set(newNames, {
                nickNames: playerName
            }).then(() => {
                alert("Name is saved")
            }).catch((error) => {
                alert("error:", error.message)
            })
        }
        savePlayerNames()
    }, [playerName])

    function handleStart() {
        navigate('/type-selection', { state: { playerName } })
    }

    return (
        <div className='entering-page'>
            <img src={mainLogo} alt="Kahoot's Original Logo" className='kahoot-entering-page-logo' />
            <div className='player-entrance'>
                <input 
                    type="text" 
                    placeholder='Player Name' 
                    value={playerName} 
                    onChange={(e) => setPlayerName(e.target.value)} 
                />
                <button onClick={handleStart}>Start!</button>
            </div>
        </div>
    )
}
