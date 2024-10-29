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
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm transform transition-all">
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
