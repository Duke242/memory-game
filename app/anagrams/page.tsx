"use client"

import React, { useState, useEffect } from "react"
import { anagrams } from "./lettersAndWords"
import Link from "next/link"
import { GiBrain } from "react-icons/gi"

interface GameState {
  letters: string
  userGuess: string
  score: number
  message: string
  isCorrect: boolean
}

const Anagrams: React.FC = () => {
  // Use null as initial state
  const [gameState, setGameState] = useState<GameState | null>(null)

  // Initialize game state after component mounts
  useEffect(() => {
    const initialState: GameState = {
      letters:
        Object.keys(anagrams)[
          Math.floor(Math.random() * Object.keys(anagrams).length)
        ],
      userGuess: "",
      score: 0,
      message: "",
      isCorrect: false,
    }
    setGameState(initialState)
  }, [])

  const getNewLetters = (): void => {
    if (!gameState) return

    setGameState((prev) => ({
      ...prev!,
      letters:
        Object.keys(anagrams)[
          Math.floor(Math.random() * Object.keys(anagrams).length)
        ],
      userGuess: "",
      message: "",
      isCorrect: false,
    }))
  }

  const checkWord = (word: string): boolean => {
    const lowerCaseWord = word.toLowerCase()
    if (lowerCaseWord.length >= 3 && lowerCaseWord.length <= 6) {
      return Object.values(anagrams).some((words) =>
        words.includes(lowerCaseWord)
      )
    }
    return false
  }

  const isValidWord = (word: string): boolean => {
    return word.length >= 3 && word.length <= 6
  }

  const handleSubmit = (): void => {
    if (!gameState) return

    const guess: string = gameState.userGuess.toUpperCase()

    if (guess.length < 3) {
      setGameState((prev) => ({
        ...prev!,
        message: "Word must be at least 3 letters long! 📏",
        isCorrect: false,
      }))
      return
    }

    if (!checkWord(guess)) {
      setGameState((prev) => ({
        ...prev!,
        message: "Word not found in the list of valid anagrams! 🔍",
        isCorrect: false,
      }))
      return
    }

    if (isValidWord(guess)) {
      setGameState((prev) => ({
        ...prev!,
        score: prev!.score + guess.length,
        message: "Valid word! 🎉",
        isCorrect: true,
      }))
    } else {
      setGameState((prev) => ({
        ...prev!,
        message: "Not a valid word! 🤔",
        isCorrect: false,
      }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!gameState) return

    setGameState((prev) => ({
      ...prev!,
      userGuess: e.target.value.toUpperCase(),
    }))
  }

  // Show loading state while initializing
  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
          <p className="text-xl font-bold text-blue-600">Loading...</p>
        </div>
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-600">Anagrams</h1>
          <span className="text-xl font-bold text-purple-600">
            Score: {gameState.score}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-700">
            Make words using these letters:
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {gameState.letters
              .split("")
              .map((letter: string, index: number) => (
                <div
                  key={index}
                  className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center text-2xl font-bold text-blue-800 transform hover:scale-110 transition-transform"
                >
                  {letter.toUpperCase()}
                </div>
              ))}
          </div>
        </div>

        <input
          type="text"
          value={gameState.userGuess}
          onChange={handleInputChange}
          placeholder="Enter a 3-6 letter word"
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          maxLength={6}
        />

        <div className="space-y-4">
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-full hover:from-blue-700 hover:to-purple-700 transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Submit
          </button>

          <button
            onClick={getNewLetters}
            className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold py-2 px-6 rounded-full hover:from-gray-500 hover:to-gray-600 transition duration-300 transform hover:scale-105 shadow-lg"
          >
            New Letters
          </button>
        </div>

        {gameState.message && (
          <p
            className={`mt-4 text-center text-lg font-bold ${
              gameState.isCorrect ? "text-green-600" : "text-red-500"
            }`}
          >
            {gameState.message}
          </p>
        )}

        <p className="mt-4 text-sm text-gray-600 text-center">
          Make words of 3-6 letters. Score points based on word length!
        </p>
      </div>
    </div>
  )
}

export default Anagrams
