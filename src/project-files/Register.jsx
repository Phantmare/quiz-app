import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../config/firebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  function handleRegister() {
    setErrorMessage('')
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.')
      return
    }

    setLoading(true)
    createUserWithEmailAndPassword(auth, email, password).then(function(userCredential) {
      const user = userCredential.user
      const userRef = doc(db, 'users', playerName)

      setDoc(userRef, {
        currentQuizType: '',
        currentLevel: 1,
        playerName: playerName,
        email: email,
        userId: user.uid
      }).then(function() {
        navigate('/type-selection', {
          state: {
            playerName: playerName,
            currentLevel: 1,
            docId: userRef.id
          }
        })
      })
    }).catch(function() {
      setErrorMessage('Error during registration. Please try again.')
    }).finally(function() {
      setLoading(false)
    })
  }

  return (
    <div className="register-page">
      <h1>Register</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={function(e) { setEmail(e.target.value) }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={function(e) { setPassword(e.target.value) }}
      />
      <input
        type="text"
        placeholder="Player Name"
        value={playerName}
        onChange={function(e) { setPlayerName(e.target.value) }}
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <button onClick={handleRegister} disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </div>
  )
}

