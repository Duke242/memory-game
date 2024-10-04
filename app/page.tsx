import React from "react"
import Link from "next/link"
import { GiBrain } from "react-icons/gi"

const benefits = [
  {
    title: "Improve Memory",
    icon: "🧠",
    description: "Enhance your ability to retain and recall information.",
  },
  {
    title: "Enhance Focus",
    icon: "🎯",
    description: "Sharpen your concentration and attention to detail.",
  },
  {
    title: "Boost Recall",
    icon: "💡",
    description: "Quickly retrieve information from your memory.",
  },
  {
    title: "Fun Exercise",
    icon: "🏋️‍♂️",
    description: "Enjoy a challenging and entertaining mental workout.",
  },
]

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <GiBrain className="mr-2 text-3xl" />
            MemoryMaster
          </Link>
          <Link
            href="/login"
            className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-opacity-90 transition duration-300"
          >
            Sign In
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-12 md:mb-0 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Unlock Your Brain&apos;s Potential
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Challenge your mind and improve your memory with our exciting
              Number Memory Game.
            </p>
            <Link
              href="/game"
              className="inline-block bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-full hover:bg-blue-100 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Playing Now
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center animate-fade-in">
            <GiBrain className="text-white text-[300px] opacity-80" />
          </div>
        </div>
      </main>

      <section className="bg-white text-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Benefits of Playing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-blue-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
