"use client"

import React, { useState, useEffect } from "react"
import { Check, X } from "lucide-react"
import { GiBrain } from "react-icons/gi"
import Link from "next/link"
import toast from "react-hot-toast"

type GameState = "setup" | "display" | "recall" | "result"

const BoxGamePage: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>("setup")
  const [coloredBoxes, setColoredBoxes] = useState<boolean[]>([])
  const [userSelection, setUserSelection] = useState<boolean[]>([])
  const [difficulty, setDifficulty] = useState<number>(4)
  const [numColoredBoxes, setNumColoredBoxes] = useState<number>(3)
  const [timeRemaining, setTimeRemaining] = useState<number>(100)
  const [displayTime, setDisplayTime] = useState<number>(3)
  const [score, setScore] = useState<number>(0)
  const [stats, setStats] = useState<{
    correct: number
    incorrect: number
    missed: number
  }>({
    correct: 0,
    incorrect: 0,
    missed: 0,
  })

  const getMaxColoredBoxes = (gridSize: number) => {
    return Math.min(Math.floor(gridSize * gridSize * 0.8), 20)
  }

  useEffect(() => {
    if (gameState === "display") {
      const newColoredBoxes = Array(difficulty * difficulty).fill(false)

      let remainingBoxes = numColoredBoxes
      while (remainingBoxes > 0) {
        const randomIndex = Math.floor(
          Math.random() * (difficulty * difficulty)
        )
        if (!newColoredBoxes[randomIndex]) {
          newColoredBoxes[randomIndex] = true
          remainingBoxes--
        }
      }

      setColoredBoxes(newColoredBoxes)
      setUserSelection(Array(difficulty * difficulty).fill(false))
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
  }, [gameState, difficulty, displayTime, numColoredBoxes])

  const handleStartGame = () => {
    setGameState("display")
  }

  const handleBoxClick = (index: number) => {
    if (gameState === "recall") {
      setUserSelection((prev) => {
        const newSelection = [...prev]
        newSelection[index] = !newSelection[index]
        return newSelection
      })
    }
  }

  const handleSubmit = () => {
    let correct = 0
    let incorrect = 0
    let missed = 0

    coloredBoxes.forEach((isColored, index) => {
      if (isColored) {
        if (userSelection[index]) {
          correct++
        } else {
          missed++
        }
      } else {
        if (userSelection[index]) {
          incorrect++
        }
      }
    })

    const percentage = Math.round((correct / numColoredBoxes) * 100)
    setScore(percentage)
    setStats({ correct, incorrect, missed })

    setGameState("result")
  }

  const nextLevelPressed = () => {
    let newDifficulty = difficulty
    let newNumColoredBoxes = numColoredBoxes + 1

    if (difficulty === 3 && numColoredBoxes >= 7) {
      newDifficulty = 4
    } else if (difficulty === 4 && numColoredBoxes >= 12) {
      newDifficulty = 5
    } else if (difficulty === 5 && numColoredBoxes >= 20) {
      toast.success("Congratulations! You've beaten the highest level!", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#4CAF50",
          color: "#fff",
        },
      })

      setGameState("setup")
      return
    }

    setDifficulty(newDifficulty)
    setNumColoredBoxes(newNumColoredBoxes)

    setGameState("display")
  }

  const renderGrid = (boxes: boolean[]) => {
    return (
      <div
        className="grid gap-2 mb-4"
        style={{
          gridTemplateColumns: `repeat(${difficulty}, minmax(0, 1fr))`,
        }}
      >
        {boxes.map((isColored, index) => {
          const isCorrect = coloredBoxes[index] === userSelection[index]
          const showFeedback = gameState === "result"

          return (
            <div
              key={index}
              className={`aspect-square rounded-md flex items-center justify-center relative ${
                gameState === "display" && isColored
                  ? "bg-blue-500"
                  : gameState === "recall"
                  ? userSelection[index]
                    ? "bg-blue-300"
                    : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
                  : gameState === "result"
                  ? isCorrect
                    ? userSelection[index]
                      ? "bg-green-200"
                      : "bg-gray-200"
                    : userSelection[index]
                    ? "bg-red-200"
                    : coloredBoxes[index]
                    ? "bg-blue-200"
                    : "bg-gray-200"
                  : "bg-gray-200"
              }`}
              onClick={() => handleBoxClick(index)}
            >
              {showFeedback && (
                <>
                  {userSelection[index] !== coloredBoxes[index] && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {userSelection[index] ? (
                        <X className="text-red-500" size={24} />
                      ) : coloredBoxes[index] ? (
                        <div className="w-4 h-4 rounded-full border-2 border-blue-500" />
                      ) : null}
                    </div>
                  )}
                  {isCorrect && userSelection[index] && (
                    <Check className="text-green-500" size={24} />
                  )}
                </>
              )}
            </div>
          )
        })}
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
                    onClick={() => {
                      setDifficulty(size)
                      setNumColoredBoxes(Math.min(3, getMaxColoredBoxes(size)))
                    }}
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
                Number of colored boxes:
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min={1}
                  max={getMaxColoredBoxes(difficulty)}
                  value={numColoredBoxes}
                  onChange={(e) => setNumColoredBoxes(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                />
                <span className="text-xl font-bold text-blue-600">
                  {numColoredBoxes}
                </span>
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
              Memorize blue boxes:
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
              Select the blue boxes:
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

        {gameState === "result" && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-6">
              {score === 100 ? "Perfect Score!" : "Results"}
            </h2>
            {renderGrid(userSelection)}
            <div className="mb-6">
              <p className="text-xl font-semibold text-gray-700 mb-2">
                Score: {score}%
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Correct selections: {stats.correct}</p>
                <p>Incorrect selections: {stats.incorrect}</p>
                <p>Missed boxes: {stats.missed}</p>
              </div>
              {score === 100 && (
                <p className="text-green-600 font-semibold mt-2">
                  Great job! Next level will have {numColoredBoxes + 1} boxes to
                  remember.
                </p>
              )}
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 mt-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-200 rounded-md mr-2"></div>
                  <span>Correct</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-200 rounded-md mr-2"></div>
                  <span>Incorrect</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-200 rounded-md mr-2"></div>
                  <span>Missed</span>
                </div>
              </div>
            </div>
            {score === 100 ? (
              <button
                onClick={nextLevelPressed}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-full hover:from-blue-700 hover:to-purple-700 transition duration-300 transform hover:scale-105 shadow-lg"
              >
                Next Level
              </button>
            ) : (
              <button
                onClick={() => setGameState("setup")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-full hover:from-blue-700 hover:to-purple-700 transition duration-300 transform hover:scale-105 shadow-lg"
              >
                Play Again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default BoxGamePage
