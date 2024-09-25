import Link from "next/link"
import ButtonSignin from "@/components/ButtonSignin"

export default function Page() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center justify-center p-4">
        <main className="max-w-4xl w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-6">
            Number Memory Game
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Challenge your brain and improve your memory!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">
                Classic Mode
              </h2>
              <p className="text-gray-600">Remember numbers in order</p>
            </div> */}
            {/* <div className="bg-blue-50 p-4 rounded-lg"> */}
            {/* <h2 className="text-lg font-semibold text-blue-700 mb-2">
                Reverse Mode
              </h2>
              <p className="text-gray-600">Recall numbers backwards</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">
                Sum Mode
              </h2>
              <p className="text-gray-600">Remember the total sum</p>
            </div> */}
          </div>

          <Link
            href="/game"
            className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300"
          >
            Start Playing
          </Link>

          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Benefits
            </h3>
            <ul className="text-left list-disc list-inside text-gray-700">
              <li>Improve short-term memory</li>
              <li>Enhance concentration and focus</li>
              <li>Boost numerical recall abilities</li>
              <li>Exercise your brain in a fun way</li>
            </ul>
          </div>
        </main>
      </div>
    </>
  )
}
