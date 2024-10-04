import React from "react"
import {
  GiBrain,
  GiMagnifyingGlass,
  GiLightningArc,
  GiPuzzle,
} from "react-icons/gi"

const benefits = [
  {
    title: "Boost Visual Memory",
    icon: GiBrain,
    description:
      "Enhance your ability to recall visual patterns and spatial information.",
  },
  {
    title: "Sharpen Focus",
    icon: GiMagnifyingGlass,
    description:
      "Improve concentration and attention to detail through engaging challenges.",
  },
  {
    title: "Quick Thinking",
    icon: GiLightningArc,
    description:
      "Develop faster cognitive processing and decision-making skills.",
  },
  {
    title: "Mental Flexibility",
    icon: GiPuzzle,
    description:
      "Adapt to varying difficulty levels, improving your cognitive adaptability.",
  },
]

const BenefitsSection = () => {
  return (
    <section className="bg-white text-gray-800 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-blue-600">
          Unlock Your Mind&apos;s Potential
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-5xl mb-4 text-blue-600">
                <benefit.icon />
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-700">
                {benefit.title}
              </h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection
