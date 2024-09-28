"use client"

import React, { useState, useEffect } from "react"
import { CheckCircle, XCircle } from "lucide-react"

const GamePage = () => {
  const [startingDigits, setStartingDigits] = useState(1)
  const [currentNumber, setCurrentNumber] = useState("")
  const [userInput, setUserInput] = useState("")
  const [lastInput, setLastInput] = useState("")
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState("setup") // 'setup', 'memorize', 'input', 'result', 'correct'
  const [timeRemaining, setTimeRemaining] = useState(100) // Percentage of time remaining
  const [selectedTime, setSelectedTime] = useState(70)

  useEffect(() => {
    if (gameState === "memorize") {
      const newNumber = generateRandomNumber(
        Math.min(startingDigits + score, 20)
      )
      setCurrentNumber(newNumber)
      setTimeRemaining(100)

      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer)
            setGameState("input")
            return 0
          }
          return prevTime - 100 / selectedTime // Decrease by 1.428% every 100ms to complete in 7 seconds
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

  const handleSubmit = () => {
    setLastInput(userInput)
    if (userInput === currentNumber) {
      setScore((prevScore) => prevScore + 1)
      setGameState("correct")
    } else {
      setGameState("result")
    }
    setUserInput("")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value)
  }

  const renderDigitButtons = () => {
    return (
      <div className="grid grid-cols-5 gap-2">
        {[...Array(15)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setStartingDigits(i + 1)}
            className={`py-2 px-4 rounded font-bold ${
              startingDigits === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    )
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select starting number of digits:
              </label>
              {renderDigitButtons()}
            </div>
            <button
              onClick={handleStartGame}
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300 mt-4"
            >
              Start Game
            </button>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select memorization time:
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="time"
                    value="30"
                    checked={selectedTime === 30}
                    onChange={(e) => setSelectedTime(parseInt(e.target.value))}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2">3 seconds</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="time"
                    value="50"
                    checked={selectedTime === 50}
                    onChange={(e) => setSelectedTime(parseInt(e.target.value))}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2">5 seconds</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="time"
                    value="70"
                    checked={selectedTime === 70}
                    onChange={(e) => setSelectedTime(parseInt(e.target.value))}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2">7 seconds</span>
                </label>
              </div>
            </div>
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
              type="number"
              value={userInput}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
            <XCircle className="mx-auto text-red-500" size={64} />
            <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
            <p className="text-xl mb-4">Your score: {score}</p>
            <p className="text-lg mb-4">
              The correct number was:{" "}
              <span className="font-bold text-green-600">{currentNumber}</span>
            </p>
            <p className="text-lg mb-4">
              You entered:{" "}
              <span className="font-bold text-red-600">{lastInput}</span>
            </p>
            <button
              onClick={() => setGameState("setup")}
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300 mt-4"
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
