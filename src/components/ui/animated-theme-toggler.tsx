/**
 * AnimatedThemeToggler con duración dinámica según dispositivo
 */

import { useEffect, useRef, useState, useMemo } from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AnimatedThemeTogglerProps } from "@/models/AnimatedThemeTogglerProps"

export const AnimatedThemeToggler = ({
  className,
  duration, // ignoramos este valor si viene
  ...props
}: AnimatedThemeTogglerProps) => {
  const [isDark, setIsDark] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // ======== 💡 Duración dinámica según dispositivo ========
  const smartDuration = useMemo(() => {
    const w = window.innerWidth
    const h = window.innerHeight
    const area = w * h

    // Potencia del dispositivo
    const ram = navigator.deviceMemory || 4

    let base = 1000 // duración base

    // Ajuste por tamaño de pantalla
    if (area < 800 * 800) base = 600          // móvil pequeño
    else if (area < 1400 * 900) base = 900     // tablet / portátil
    else if (area < 1920 * 1080) base = 1000   // full HD
    else base = 900                            // pantallas enormes → más corto

    // Ajuste por memoria RAM
    if (ram <= 3) base *= 0.70   // dispositivos débiles → más rápida
    else if (ram >= 8) base *= 1.10 // dispositivos muy potentes

    return Math.round(base)
  }, [])

  // =========================================================

  /** Detectar estado inicial del tema */
  useEffect(() => {
    const html = document.documentElement
    const stored = localStorage.getItem("theme")

    if (stored === "dark") html.classList.add("dark")
    if (stored === "light") html.classList.remove("dark")

    setIsDark(html.classList.contains("dark"))
  }, [])

  /** Alternar tema */
  const toggleTheme = async () => {
    if (!buttonRef.current) return

    const newTheme = !isDark

    await document.startViewTransition(() => {
      const html = document.documentElement

      if (newTheme) html.classList.add("dark")
      else html.classList.remove("dark")

      localStorage.setItem("theme", newTheme ? "dark" : "light")
      setIsDark(newTheme)
    }).ready

    // Posición del botón
    const rect = buttonRef.current.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    // Radio fijo y eficiente
    const radius = 1400

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${radius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: smartDuration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn("relative", className)}
      {...props}
    >
      {isDark ? <Sun /> : <Moon />}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
