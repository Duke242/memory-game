import React from "react"
import Link from "next/link"
import { GiBrain } from "react-icons/gi"
import BenefitsSection from "@/components/BenefitsSection"

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
              memory games.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/game"
                className="inline-block bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-full hover:bg-blue-100 transition duration-300 transform hover:scale-105 shadow-lg text-center"
              >
                Play Number Memory
              </Link>
              <Link
                href="/box-game"
                className="inline-block text-blue-600 hover:bg-blue-100 bg-white font-bold text-lg px-8 py-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg text-center"
              >
                Play Box Memory
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center animate-fade-in">
            <GiBrain className="text-white text-[300px] opacity-80" />
          </div>
        </div>
      </main>

      <BenefitsSection />
    </div>
  )
}
