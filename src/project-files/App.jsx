import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import '../css/style.css'
import EnteringPage from './entering-page'
import TypeSelectionPage from './TypeSelectionPage'
import QuizPage from './QuizPage'
import RegisterPage from './Register'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EnteringPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/type-selection" element={<TypeSelectionPage />} />
        <Route path="/quiz" element={<QuizPage />} />
      </Routes>
    </Router>
  )
}

