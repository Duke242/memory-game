"use client"

import React, { useState, useEffect } from "react"

function Page() {
  const [gameState, setGameState] = useState("display") // "display", "recall", "result"
  const [coloredBoxes, setColoredBoxes] = useState<boolean[]>([])
  const [userSelection, setUserSelection] = useState<boolean[]>([])
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (gameState === "display") {
      const newColoredBoxes = Array(16)
        .fill(false)
        .map(() => Math.random() < 0.5)
      setColoredBoxes(newColoredBoxes)
      setTimeout(() => setGameState("recall"), 3000) // Show for 3 seconds
    }
  }, [gameState])

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
    setScore(newScore)
    setGameState("result")
  }

  const handlePlayAgain = () => {
    setUserSelection([])
    setGameState("display")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          Box Memory Game
        </h1>

        {gameState === "display" && (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {coloredBoxes.map((isColored, index) => (
              <div
                key={index}
                className={`w-16 h-16 rounded-md ${
                  isColored ? "bg-blue-500" : "bg-gray-200"
                }`}
              ></div>
            ))}
          </div>
        )}

        {gameState === "recall" && (
          <>
            <p className="mb-4">Click on the boxes you remember being blue:</p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {Array(16)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className={`w-16 h-16 rounded-md ${
                      userSelection[index] ? "bg-blue-500" : "bg-gray-200"
                    } cursor-pointer`}
                    onClick={() => handleBoxClick(index)}
                  ></div>
                ))}
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            >
              Submit
            </button>
          </>
        )}

        {gameState === "result" && (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Game Over!</h2>
            <p className="text-lg mb-4">Your score: {score} out of 16</p>
            <button
              onClick={handlePlayAgain}
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
