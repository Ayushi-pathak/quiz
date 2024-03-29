import React, { useState, useEffect } from "react"

const Quiz = () => {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState("")
  const [score, setScore] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetchRandomQuestions()
  }, [])

  const fetchRandomQuestions = async () => {
    try {
      const response = await fetch("http://localhost:2000/quiz/start", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch questions")
      }
      const data = await response.json()
      setQuestions(data.questions)
    } catch (error) {
      console.error("Error fetching random questions:", error)
    }
  }

  const handleOptionChange = (option) => {
    setSelectedOption(option)
  }

  const handleSubmit = async () => {
    if (!selectedOption) return

    try {
      const response = await fetch("http://localhost:2000/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          answers: [
            { questionId: questions[currentQuestionIndex]._id, selectedOption },
          ],
        }),
      })
      console.log(response)
      if (!response.ok) {
        throw new Error("Failed to submit answer")
      }
      const data = await response.json()
      if (data.status === "success") {
        setScore(score + 1)
        setSubmitted(true)
      }
    } catch (error) {
      console.error("Error submitting answer:", error)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOption("")
      setSubmitted(false)
    }
  }

  return (
    <div>
      {questions.length > 0 && (
        <div>
          <h2>Question {currentQuestionIndex + 1}</h2>
          <p>{questions[currentQuestionIndex].question}</p>
          <ul>
            {questions[currentQuestionIndex].options.map((option, index) => (
              <li key={index}>
                <input
                  type="radio"
                  id={`option${index}`}
                  name="options"
                  value={option}
                  checked={option === selectedOption}
                  onChange={() => handleOptionChange(option)}
                />
                <label htmlFor={`option${index}`}>{option}</label>
              </li>
            ))}
          </ul>
          {submitted ? (
            <div>
              <p>Your answer is submitted!</p>
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
              </button>
            </div>
          ) : (
            <button onClick={handleSubmit}>Submit</button>
          )}
          <p>Score: {score}</p>
        </div>
      )}
    </div>
  )
}

export default Quiz
