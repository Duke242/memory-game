"use client"

import React, { useState, useEffect } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import { GiBrain } from "react-icons/gi"
import Link from "next/link"

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
      const newNumber = generateRandomNumber(score)
      setCurrentNumber(newNumber)
      setTimeRemaining(100)

      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer)
            setGameState("input")
            return 0
          }
          return prevTime - 100 / selectedTime
        })
      }, 100)

      return () => clearInterval(timer)
    }
  }, [gameState, score, selectedTime])

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
    setScore(startingDigits)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex flex-col items-center justify-center p-4">
      <header className="w-full max-w-4xl mx-auto px-4 py-6 mb-8">
        <nav className="flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-white flex items-center"
          >
            <GiBrain className="mr-2 text-3xl" />
            MemoryMaster
          </Link>
        </nav>
      </header>
      <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-fit">
        {gameState === "setup" && (
          <>
            <h1 className="text-3xl font-extrabold text-blue-600 mb-6">
              Number Memory Game
            </h1>
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Select starting number of digits:
              </label>
              {renderDigitButtons()}
            </div>
            <button
              onClick={handleStartGame}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-full hover:from-blue-700 hover:to-purple-700 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Game
            </button>
            <div className="mt-8">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Select memorization time:
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={selectedTime / 10}
                  onChange={(e) =>
                    setSelectedTime(parseInt(e.target.value) * 10)
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                />
                <span className="text-xl font-bold text-blue-600">
                  {selectedTime / 10}s
                </span>
              </div>
            </div>
          </>
        )}

        {gameState === "memorize" && (
          <div className="text-center w-full max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-blue-600">
              Memorize this number:
            </h2>
            <div className="overflow-x-auto mb-6 py-2">
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-600 whitespace-nowrap inline-block leading-normal">
                {currentNumber}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${timeRemaining}%` }}
              ></div>
            </div>
          </div>
        )}

        {gameState === "input" && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-blue-600">
              Enter the number you memorized:
            </h2>
            <input
              type="number"
              value={userInput}
              onChange={handleInputChange}
              className="w-full p-3 border-2 border-blue-300 rounded-lg mb-6 text-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-full hover:from-blue-700 hover:to-purple-700 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Submit
            </button>
          </div>
        )}

        {gameState === "correct" && (
          <div className="text-center">
            <CheckCircle className="mx-auto text-green-500" size={80} />
            <p className="text-3xl font-bold text-green-600 mt-6">Correct!</p>
          </div>
        )}

        {gameState === "result" && (
          <div className="text-center">
            <XCircle className="mx-auto text-red-500" size={80} />
            <h2 className="text-3xl font-bold text-red-600 mb-6">Game Over!</h2>
            <p className="text-2xl mb-4">
              Your score:{" "}
              <span className="font-bold text-blue-600">{score} digits</span>
            </p>
            <p className="text-xl mb-4">
              The correct number was:{" "}
              <span className="font-bold text-green-600">{currentNumber}</span>
            </p>
            <p className="text-xl mb-6">
              You entered:{" "}
              <span className="font-bold text-red-600">{lastInput}</span>
            </p>
            <button
              onClick={() => setGameState("setup")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-full hover:from-blue-700 hover:to-purple-700 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default GamePage
