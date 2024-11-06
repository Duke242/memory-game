import React from "react"
import Link from "next/link"
import { GiBrain } from "react-icons/gi"
import BenefitsSection from "@/components/BenefitsSection"
import Image from "next/image"
import animationGif from "./anagrams-gif.gif"
import numberGif from "./number-game.gif"
import boxGameGif from "./box-game.gif"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <GiBrain className="mr-2 text-2xl" />
            MemoryMaster
          </Link>
          {/* <Link
            href="/login"
            className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-opacity-90 transition duration-300"
          >
            Sign In
          </Link> */}
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-fit mb-12 md:mb-0 animate-fade-in-up">
            <h1 className="text-5xl md:text-5xl font-extrabold mb-6 leading-tight">
              Unlock Your Brain&apos;s Potential
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Challenge your mind and improve your memory with our exciting
              memory games.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col group h-fit">
                <div className="flex-1">
                  <Image
                    src={numberGif}
                    alt="Number game demo"
                    width={300}
                    height={200}
                    className="rounded-t w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    unoptimized={true}
                  />
                </div>
                <Link
                  href="/game"
                  className="bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-b hover:bg-blue-100 transition duration-300 transform group-hover:scale-105 shadow-lg text-center"
                >
                  Play Number Game
                </Link>
              </div>
              <div className="flex flex-col group h-fit">
                <div className="flex-1">
                  <Image
                    src={boxGameGif}
                    alt="Box game demo"
                    width={300}
                    height={200}
                    className="rounded-t w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    unoptimized={true}
                  />
                </div>
                <Link
                  href="/box-game"
                  className="bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-b hover:bg-blue-100 transition duration-300 transform group-hover:scale-105 shadow-lg text-center"
                >
                  Play Box Memory
                </Link>
              </div>
              <div className="flex flex-col group h-fit">
                <div className="flex-1">
                  <Image
                    src={animationGif}
                    alt="Anagrams game demo"
                    width={300}
                    height={200}
                    className="rounded-t w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    unoptimized={true}
                  />
                </div>
                <Link
                  href="/anagrams"
                  className="bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-b hover:bg-blue-100 transition duration-300 transform group-hover:scale-105 shadow-lg text-center"
                >
                  Play Anagrams
                </Link>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center animate-fade-in">
            <GiBrain className="text-white text-[300px] opacity-80 hidden lg:block" />
          </div>
        </div>
      </main>

      <BenefitsSection />
    </div>
  )
}
