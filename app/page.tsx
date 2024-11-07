import React from "react"
import Link from "next/link"
import { GiBrain } from "react-icons/gi"
import BenefitsSection from "@/components/BenefitsSection"
import Image from "next/image"
import animationGif from "./anagrams-gif.gif"
import numberGif from "./number-game.gif"
import boxGameGif from "./box-game.gif"

export default function Page() {
  const games = [
    {
      title: "Number Game",
      image: numberGif,
      href: "/game",
      alt: "Number game demo",
    },
    {
      title: "Box Memory",
      image: boxGameGif,
      href: "/box-game",
      alt: "Box game demo",
    },
    {
      title: "Anagrams",
      image: animationGif,
      href: "/anagrams",
      alt: "Anagrams game demo",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <GiBrain className="mr-2 text-2xl" />
            MemoryMaster
          </Link>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {games.map((game) => (
                <Link
                  key={game.href}
                  href={game.href}
                  className="flex flex-col group h-full cursor-pointer"
                >
                  <div className="relative w-full h-48 hidden md:block">
                    <Image
                      src={game.image}
                      alt={game.alt}
                      fill
                      className="rounded-t object-cover transition duration-300 group-hover:scale-105"
                      unoptimized={true}
                    />
                  </div>
                  <div className="bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-full md:rounded-b md:rounded-t-none hover:bg-blue-100 transition duration-300 transform group-hover:scale-105 shadow-lg text-center">
                    Play {game.title}
                  </div>
                </Link>
              ))}
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
