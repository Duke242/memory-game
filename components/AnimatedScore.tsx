import { useState, useEffect } from "react"

export default function AnimatedScore({ value }: { value: number }) {
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
