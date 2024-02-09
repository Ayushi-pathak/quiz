import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const App = () => {
  const navigate = useNavigate()
  const [rollNo, setRollNo] = useState("")
  const [name, setName] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleSignOut = () => {
    const confirm = window.confirm("Are you sure you want to signout?")
    if (confirm) {
      localStorage.removeItem("token")
      alert("Signed Out")
      setIsLoggedIn(false)
    } else {
      return
    }
  }

  useEffect(() => {
    if (isLoggedIn === true) {
      const token = localStorage.getItem("token")
      fetch("http://localhost:2000/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "error") {
            alert(data.message)
            navigate("/sign-in")
          } else {
            setRollNo(data.user.rollNo)
            setName(data.user.name)
          }
        })
    } else {
      return
    }
  })

  return (
    <div>
      <h1>Quiz App</h1>
      {isLoggedIn ? (
        <>
          <h1>Welcome back, {name}!</h1>
          {rollNo && <h2>Roll No: {rollNo}</h2>}
          <Link to="/attempts">Your attempts</Link>
          <Link to="/quiz">Take Quiz</Link>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <>
          <Link to="/sign-up">Sign Up</Link>
          <Link to="/sign-in">Sign In</Link>
        </>
      )}
    </div>
  )
}

export default App
