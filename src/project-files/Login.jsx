import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../config/firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { query, collection, where, getDocs } from 'firebase/firestore'

export default function LoginPage() {
  const navigate = useNavigate()
  const [playerName, setPlayerName] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  function handleLogin() {
    if (!playerName || !password) {
      setErrorMessage('Please enter both username and password.')
      return
    }

    setLoading(true)
    setErrorMessage('')

    signInWithEmailAndPassword(auth, playerName, password)
      .then(function() {
        const user = auth.currentUser
        if (user) {
          const userDocId = user.uid
          const q = query(collection(db, 'users'), where('userId', '==', userDocId))
          getDocs(q)
            .then(function(querySnapshot) {
              if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0]
                const userData = userDoc.data()
                const currentLevel = userData.currentLevel
                const continueFromLevel = window.confirm(`Your last saved level is ${currentLevel}. Do you want to continue from there?`)
                if (continueFromLevel) {
                  navigate('/quiz', {
                    state: {
                      playerName,
                      currentLevel,
                      docId: userDocId
                    }
                  })
                } else {
                  navigate('/type-selection', {
                    state: {
                      playerName,
                      currentLevel: 0,
                      docId: userDocId
                    }
                  })
                }
              } else {
                navigate('/type-selection', {
                  state: {
                    playerName,
                    currentLevel: 0,
                    docId: userDocId
                  }
                })
              }
            })
        }
      })
      .catch(function() {
        setErrorMessage('Invalid username or password.')
      })
      .finally(function() {
        setLoading(false)
      })
  }

  return (
    <div className="login-page">
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={playerName}
        onChange={function(e) { setPlayerName(e.target.value) }}
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={function(e) { setPassword(e.target.value) }}
        disabled={loading}
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <div className="redirect-link">
        <span>Don't have an account? </span><a href="/register">Register</a>
      </div>
    </div>
  )
}
