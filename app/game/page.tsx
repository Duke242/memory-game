"use client"

import React, { useState, useEffect } from "react"
import { CheckCircle } from "lucide-react"

const GamePage = () => {
  const [startingDigits, setStartingDigits] = useState(1)
  const [currentNumber, setCurrentNumber] = useState("")
  const [userInput, setUserInput] = useState("")
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState("setup") // 'setup', 'memorize', 'input', 'result', 'correct'
  const [timeRemaining, setTimeRemaining] = useState(100) // Percentage of time remaining

  useEffect(() => {
    if (gameState === "memorize") {
      const newNumber = generateRandomNumber(startingDigits + score)
      setCurrentNumber(newNumber)
      setTimeRemaining(100)

      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer)
            setGameState("input")
            return 0
          }
          return prevTime - 100 / 70 // Decrease by 1.428% every 100ms to complete in 7 seconds
        })
      }, 100)

      return () => clearInterval(timer)
    }
  }, [gameState, score, startingDigits])

  useEffect(() => {
    if (gameState === "correct") {
      const timer = setTimeout(() => {
        setGameState("memorize")
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [gameState])

  const generateRandomNumber = (digits: number): string => {
    return Math.floor(Math.random() * 10 ** digits)
      .toString()
      .padStart(digits, "0")
  }

  const handleStartGame = () => {
    setScore(0)
    setGameState("memorize")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value)
  }

  const handleSubmit = () => {
    if (userInput === currentNumber) {
      setScore(score + 1)
      setGameState("correct")
    } else {
      setGameState("result")
    }
    setUserInput("")
  }

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        {gameState === "setup" && (
          <>
            <h1 className="text-2xl font-bold text-blue-600 mb-4">
              Number Memory Game
            </h1>
            <div className="mb-4">
              <label
                htmlFor="startingDigits"
                className="block text-sm font-medium text-gray-700"
              >
                Starting number of digits:
              </label>
              <input
                type="number"
                id="startingDigits"
                value={startingDigits}
                onChange={(e) => setStartingDigits(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                min="1"
                max="10"
              />
            </div>
            <button
              onClick={handleStartGame}
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            >
              Start Game
            </button>
          </>
        )}

        {gameState === "memorize" && (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Memorize this number:</h2>
            <p className="text-4xl font-bold text-blue-600 mb-4">
              {currentNumber}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${timeRemaining}%` }}
              ></div>
            </div>
          </div>
        )}

        {gameState === "input" && (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Enter the number you memorized:
            </h2>
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-4"
              autoFocus
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            >
              Submit
            </button>
          </div>
        )}

        {gameState === "correct" && (
          <div className="text-center">
            <CheckCircle className="mx-auto text-green-500" size={64} />
            <p className="text-xl font-bold text-green-600 mt-4">Correct!</p>
          </div>
        )}

        {gameState === "result" && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
            <p className="text-xl mb-4">Your score: {score}</p>
            <button
              onClick={() => setGameState("setup")}
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            >
              Play Again
            </button>
          </div>
        )}

        {gameState !== "setup" && (
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold">Score: {score}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GamePage
