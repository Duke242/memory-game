const GameOverModal = ({
  isOpen,
  score,
  wordsFound,
  onPlayAgain,
}: {
  isOpen: boolean
  score: number
  wordsFound: number
  onPlayAgain: () => void
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm transform transition-all relative">
        <button
          onClick={onPlayAgain}
          className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-200"
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Game Over!</h2>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
            <p className="text-xl font-semibold text-gray-800 mb-2">
              Final Score
            </p>
            <p className="text-4xl font-bold text-purple-600">{score}</p>
            <p className="text-sm text-gray-600 mt-2">
              Words Found: {wordsFound}
            </p>
          </div>

          <button
            onClick={onPlayAgain}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-full hover:from-blue-700 hover:to-purple-700 transition duration-300 transform hover:scale-105"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameOverModal
