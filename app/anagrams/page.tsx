"use client"

import React, { useState, useEffect } from "react"
import { anagrams } from "./lettersAndWords"
import Link from "next/link"
import { GiBrain } from "react-icons/gi"
import { RiShuffleLine } from "react-icons/ri"
import toast, { Toaster } from "react-hot-toast"

interface GameState {
  letters: string
  shuffledLetters: string
  userGuess: string
  score: number
  message: string
  isCorrect: boolean
  timeLeft: number
  isGameActive: boolean
  hasStarted: boolean
  usedWords: Set<string>
}

const AnimatedScore = ({ value }: { value: number }) => {
  const [displayed, setDisplayed] = useState(value)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (value !== displayed) {
      setScale(1.5)
      setTimeout(() => setScale(1), 100)
      setDisplayed(value)
    }
  }, [value, displayed])

  return (
    <span
      className="inline-block transition-transform duration-300"
      style={{
        transform: `scale(${scale})`,
        color: scale > 1 ? "#4C1D95" : undefined,
      }}
    >
      {displayed.toLocaleString()}
    </span>
  )
}

const Anagrams: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null)

  const shuffleLetters = (letters: string): string => {
    const array = letters.split("")
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array.join("")
  }

  useEffect(() => {
    const initialLetters =
      Object.keys(anagrams)[
        Math.floor(Math.random() * Object.keys(anagrams).length)
      ]
    const initialState: GameState = {
      letters: initialLetters,
      shuffledLetters: shuffleLetters(initialLetters),
      userGuess: "",
      score: 0,
      message: "",
      isCorrect: false,
      timeLeft: 60,
      isGameActive: true,
      hasStarted: false,
      usedWords: new Set<string>(),
    }
    setGameState(initialState)
  }, [])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && gameState?.isGameActive) {
        handleSubmit()
      }
    }

    window.addEventListener("keypress", handleKeyPress)

    return () => {
      window.removeEventListener("keypress", handleKeyPress)
    }
  }, [gameState])

  useEffect(() => {
    if (!gameState?.isGameActive || !gameState?.hasStarted) return

    const timer = setInterval(() => {
      setGameState((prev) => {
        if (!prev) return prev

        const newTimeLeft = prev.timeLeft - 1
        if (newTimeLeft <= 0) {
          clearInterval(timer)
          toast.success(`Game Over! Final Score: ${prev.score}`, {
            duration: 3000,
            style: {
              background: "#DCFCE7",
              color: "#166534",
            },
          })
          return { ...prev, timeLeft: 0, isGameActive: false }
        }
        return { ...prev, timeLeft: newTimeLeft }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState?.isGameActive, gameState?.hasStarted])

  const handleShuffle = (): void => {
    if (!gameState || !gameState.isGameActive) return

    setGameState((prev) => ({
      ...prev!,
      shuffledLetters: shuffleLetters(prev!.letters),
    }))
  }

  const startNewGame = (): void => {
    const newLetters =
      Object.keys(anagrams)[
        Math.floor(Math.random() * Object.keys(anagrams).length)
      ]
    const newState: GameState = {
      letters: newLetters,
      shuffledLetters: shuffleLetters(newLetters),
      userGuess: "",
      score: 0,
      message: "",
      isCorrect: false,
      timeLeft: 60,
      isGameActive: true,
      hasStarted: false,
      usedWords: new Set<string>(),
    }
    setGameState(newState)
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

  const getWordScore = (length: number): number => {
    switch (length) {
      case 3:
        return 100
      case 4:
        return 400
      case 5:
        return 1200
      case 6:
        return 2000
      default:
        return 0
    }
  }

  const isValidWord = (word: string): boolean => {
    return word.length >= 3 && word.length <= 6
  }

  const handleSubmit = (): void => {
    if (!gameState || !gameState.isGameActive) return

    const guess: string = gameState.userGuess.toUpperCase()

    if (!guess.trim()) return

    if (gameState.usedWords.has(guess)) {
      toast.error("You've already used this word! 🔄", {
        duration: 2000,
        style: {
          background: "#FEE2E2",
          color: "#991B1B",
        },
      })
      setGameState((prev) => ({
        ...prev!,
        message: "Word already used! 🔄",
        isCorrect: false,
        userGuess: "",
      }))
      return
    }

    if (guess.length < 3) {
      toast.error("Word must be at least 3 letters long! 📏", {
        duration: 2000,
        style: {
          background: "#FEE2E2",
          color: "#991B1B",
        },
      })
      setGameState((prev) => ({
        ...prev!,
        message: "Word must be at least 3 letters long! 📏",
        isCorrect: false,
      }))
      return
    }

    if (!checkWord(guess)) {
      toast.error("Incorrect word! 🤔", {
        duration: 2000,
        style: {
          background: "#FEE2E2",
          color: "#991B1B",
        },
      })
      setGameState((prev) => ({
        ...prev!,
        message: "Incorrect word! 🤔",
        isCorrect: false,
      }))
      return
    }

    if (isValidWord(guess)) {
      const pointsEarned = getWordScore(guess.length)
      toast.success(`${guess} is correct! +${pointsEarned} points!`, {
        duration: 2000,
        style: {
          background: "#DCFCE7",
          color: "#166534",
        },
      })

      setGameState((prev) => ({
        ...prev!,
        score: prev!.score + pointsEarned,
        message: "Correct! 🎉",
        isCorrect: true,
        userGuess: "",
        usedWords: new Set([...prev!.usedWords, guess]),
      }))
    } else {
      toast.error("Incorrect word! 🤔", {
        duration: 2000,
        style: {
          background: "#FEE2E2",
          color: "#991B1B",
        },
      })
      setGameState((prev) => ({
        ...prev!,
        message: "Incorrect word! 🤔",
        isCorrect: false,
      }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!gameState || !gameState.isGameActive) return

    const newValue = e.target.value.toUpperCase()

    if (newValue.length === 1 && !gameState.hasStarted) {
      setGameState((prev) => ({
        ...prev!,
        userGuess: newValue,
        hasStarted: true,
      }))
    } else {
      setGameState((prev) => ({
        ...prev!,
        userGuess: newValue,
      }))
    }
  }

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
      <Toaster position="top-center" />
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
          <div className="flex flex-col items-end">
            <span className="text-xl font-bold text-purple-600">
              Score: <AnimatedScore value={gameState.score} />
            </span>
            <span className="text-sm text-gray-600">
              Words found: {gameState.usedWords.size}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-lg font-semibold text-gray-700">
              Make words using these letters:
            </p>
            <button
              onClick={handleShuffle}
              className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
              disabled={!gameState.isGameActive}
              title="Shuffle Letters"
            >
              <RiShuffleLine className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {gameState.shuffledLetters
              .split("")
              .map((letter: string, index: number) => (
                <div
                  key={index}
                  className="w-9 h-9 bg-blue-200 rounded-lg flex items-center justify-center text-2xl font-bold text-blue-800 transform hover:scale-110 transition-transform md:w-12 md:h-12"
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
          placeholder="Type to start the game!"
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          maxLength={6}
          disabled={!gameState.isGameActive}
        />
        <span className="flex text-lg font-semibold text-gray-600 mb-4 justify-center text-purple-500">
          {!gameState.hasStarted
            ? "Type your first letter to start the timer!"
            : `Time: ${gameState.timeLeft}s`}
        </span>

        <div className="space-y-4">
          {gameState.isGameActive ? (
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-full hover:from-blue-700 hover:to-purple-700 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={startNewGame}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-6 rounded-full hover:from-green-600 hover:to-green-700 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Play Again
            </button>
          )}
        </div>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Make words of 3-6 letters.
          <br />
          Points: 3️⃣=100pts, 4️⃣=400pts, 5️⃣=1200pts, 6️⃣=2000pts!
        </p>
      </div>
    </div>
  )
}

export default Anagrams
