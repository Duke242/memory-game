"use client"
import React, { useState, useEffect } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import { GiBrain } from "react-icons/gi"
import Link from "next/link"

const BoxGamePage = () => {
  const [gameState, setGameState] = useState("setup") // 'setup', 'display', 'recall', 'result', 'correct'
  const [coloredBoxes, setColoredBoxes] = useState<boolean[]>([])
  const [userSelection, setUserSelection] = useState<boolean[]>([])
  const [score, setScore] = useState(0)
  const [difficulty, setDifficulty] = useState(4) // 4x4 grid by default
  const [timeRemaining, setTimeRemaining] = useState(100) // Percentage of time remaining
  const [displayTime, setDisplayTime] = useState(3) // 3 seconds display time by default

  useEffect(() => {
    if (gameState === "display") {
      const newColoredBoxes = Array(difficulty * difficulty)
        .fill(false)
        .map(() => Math.random() < 0.5)
      setColoredBoxes(newColoredBoxes)
      setTimeRemaining(100)

      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer)
            setGameState("recall")
            return 0
          }
          return prevTime - 100 / (displayTime * 10)
        })
      }, 100)

      return () => clearInterval(timer)
    }
  }, [gameState, difficulty, displayTime])

  const handleStartGame = () => {
    setScore(0)
    setGameState("display")
  }

  const handleBoxClick = (index: number) => {
    if (gameState === "recall") {
      const newSelection = [...userSelection]
      newSelection[index] = !newSelection[index]
      setUserSelection(newSelection)
    }
  }

  const handleSubmit = () => {
    const newScore = coloredBoxes.reduce((acc, box, index) => {
      return box === userSelection[index] ? acc + 1 : acc
    }, 0)
    setScore((prevScore) => prevScore + newScore)
    if (newScore === coloredBoxes.length) {
      setGameState("correct")
    } else {
      setGameState("result")
    }
  }

  useEffect(() => {
    if (gameState === "correct") {
      const timer = setTimeout(() => {
        setGameState("display")
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [gameState])

  const renderGrid = (boxes: boolean[]) => {
    return (
      <div
        className={`grid gap-2 mb-4`}
        style={{
          gridTemplateColumns: `repeat(${difficulty}, minmax(0, 1fr))`,
        }}
      >
        {boxes.map((isColored, index) => (
          <div
            key={index}
            className={`aspect-square rounded-md ${
              isColored
                ? "bg-blue-500"
                : gameState === "recall"
                ? "bg-gray-200 hover:bg-gray-300 cursor-pointer"
                : "bg-gray-200"
            }`}
            onClick={() => handleBoxClick(index)}
          ></div>
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
      <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {gameState === "setup" && (
          <>
            <h1 className="text-3xl font-extrabold text-blue-600 mb-6">
              Box Memory Game
            </h1>
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Select grid size:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 4, 5].map((size) => (
                  <button
                    key={size}
                    onClick={() => setDifficulty(size)}
                    className={`py-2 px-4 rounded font-bold ${
                      difficulty === size
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {size}x{size}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Select display time:
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={displayTime}
                  onChange={(e) => setDisplayTime(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                />
                <span className="text-xl font-bold text-blue-600">
                  {displayTime}s
                </span>
              </div>
            </div>
            <button
              onClick={handleStartGame}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-full hover:from-blue-700 hover:to-purple-700 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Game
            </button>
          </>
        )}

        {gameState === "display" && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 text-blue-600">
              Memorize the blue boxes:
            </h2>
            {renderGrid(coloredBoxes)}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${timeRemaining}%` }}
              ></div>
            </div>
          </div>
        )}

        {gameState === "recall" && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-blue-600">
              Select the boxes you remember being blue:
            </h2>
            {renderGrid(userSelection)}
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
              <span className="font-bold text-blue-600">{score}</span>
            </p>
            <button
              onClick={() => setGameState("setup")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-full hover:from-blue-700 hover:to-purple-700 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Play Again
            </button>
          </div>
        )}

        {gameState !== "setup" && gameState !== "result" && (
          <div className="mt-6 text-center">
            <p className="text-2xl font-bold text-blue-600">Score: {score}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BoxGamePage
