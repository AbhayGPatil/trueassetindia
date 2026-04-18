'use client'

import { useState, useEffect } from "react"
import { motion, useAnimate } from "framer-motion"
import { debounce } from "lodash"

export function RandomLetterSwapForward({
  label,
  reverse = true,
  transition = {
    type: "spring",
    duration: 0.8,
  },
  staggerDuration = 0.02,
  className,
  onClick,
  ...props
}) {
  const [scope, animate] = useAnimate()
  const [blocked, setBlocked] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const mergeTransition = (transition, i) => ({
    ...transition,
    delay: i * staggerDuration,
  })

  const shuffledIndices = Array.from(
    { length: label.length },
    (_, i) => i
  ).sort(() => Math.random() - 0.5)

  const hoverStart = debounce(
    () => {
      if (blocked || !scope?.current) return
      setBlocked(true)

      for (let i = 0; i < label.length; i++) {
        const randomIndex = shuffledIndices[i]
        const letterElement = scope.current?.querySelector(`.letter-${randomIndex}`)
        const letterSecondaryElement = scope.current?.querySelector(`.letter-secondary-${randomIndex}`)
        
        if (!letterElement || !letterSecondaryElement) continue

        animate(
          letterElement,
          {
            y: reverse ? "100%" : "-100%",
          },
          mergeTransition(transition, i)
        ).then(() => {
          animate(
            letterElement,
            {
              y: 0,
            },
            {
              duration: 0,
            }
          )
        })

        animate(
          letterSecondaryElement,
          {
            top: "0%",
          },
          mergeTransition(transition, i)
        )
          .then(() => {
            animate(
              letterSecondaryElement,
              {
                top: reverse ? "-100%" : "100%",
              },
              {
                duration: 0,
              }
            )
          })
          .then(() => {
            if (i === label.length - 1) {
              setBlocked(false)
            }
          })
      }
    },
    100,
    { leading: true, trailing: true }
  )

  if (!isClient) return null

  return (
    <motion.span
      style={{
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0",
        position: "relative",
        overflow: "visible",
      }}
      className={className}
      onHoverStart={hoverStart}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span style={{ position: "absolute", left: "-9999px" }}>{label}</span>

      {label.split("").map((letter, i) => {
        return (
          <span
            key={i}
            style={{
              position: "relative",
              display: "inline-block",
              overflow: "hidden",
              height: "1.2em",
            }}
          >
            <motion.span
              className={`letter-${i}`}
              style={{
                position: "relative",
                display: "inline-block",
                top: 0,
              }}
            >
              {letter}
            </motion.span>
            <motion.span
              className={`letter-secondary-${i}`}
              aria-hidden={true}
              style={{
                position: "absolute",
                top: reverse ? "-100%" : "100%",
                left: 0,
                display: "inline-block",
              }}
            >
              {letter}
            </motion.span>
          </span>
        )
      })}
    </motion.span>
  )
}

export function RandomLetterSwapPingPong({
  label,
  reverse = true,
  transition = {
    type: "spring",
    duration: 0.8,
  },
  staggerDuration = 0.02,
  className,
  onClick,
  ...props
}) {
  const [scope, animate] = useAnimate()
  const [blocked, setBlocked] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const mergeTransition = (transition, i) => ({
    ...transition,
    delay: i * staggerDuration,
  })

  const shuffledIndices = Array.from(
    { length: label.length },
    (_, i) => i
  ).sort(() => Math.random() - 0.5)

  const hoverStart = debounce(
    () => {
      if (blocked || !scope?.current) return
      setBlocked(true)

      for (let i = 0; i < label.length; i++) {
        const randomIndex = shuffledIndices[i]
        const letterElement = scope.current?.querySelector(`.letter-${randomIndex}`)
        const letterSecondaryElement = scope.current?.querySelector(`.letter-secondary-${randomIndex}`)
        
        if (!letterElement || !letterSecondaryElement) continue

        animate(
          letterElement,
          {
            y: reverse ? "100%" : "-100%",
          },
          mergeTransition(transition, i)
        )

        animate(
          letterSecondaryElement,
          {
            top: "0%",
          },
          mergeTransition(transition, i)
        )
      }
    },
    100,
    { leading: true, trailing: true }
  )

  const hoverEnd = debounce(
    () => {
      if (!scope?.current) return
      setBlocked(false)

      for (let i = 0; i < label.length; i++) {
        const randomIndex = shuffledIndices[i]
        const letterElement = scope.current?.querySelector(`.letter-${randomIndex}`)
        const letterSecondaryElement = scope.current?.querySelector(`.letter-secondary-${randomIndex}`)
        
        if (!letterElement || !letterSecondaryElement) continue

        animate(
          letterElement,
          {
            y: 0,
          },
          mergeTransition(transition, i)
        )

        animate(
          letterSecondaryElement,
          {
            top: reverse ? "-100%" : "100%",
          },
          mergeTransition(transition, i)
        )
      }
    },
    100,
    { leading: true, trailing: true }
  )

  if (!isClient) return null

  return (
    <motion.span
      style={{
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0",
        position: "relative",
        overflow: "visible",
      }}
      className={className}
      onHoverStart={hoverStart}
      onHoverEnd={hoverEnd}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span style={{ position: "absolute", left: "-9999px" }}>{label}</span>

      {label.split("").map((letter, i) => {
        return (
          <span
            key={i}
            style={{
              position: "relative",
              display: "inline-block",
              overflow: "hidden",
              height: "1.2em",
            }}
          >
            <motion.span
              className={`letter-${i}`}
              style={{
                position: "relative",
                display: "inline-block",
                top: 0,
              }}
            >
              {letter}
            </motion.span>
            <motion.span
              className={`letter-secondary-${i}`}
              aria-hidden={true}
              style={{
                position: "absolute",
                top: reverse ? "-100%" : "100%",
                left: 0,
                display: "inline-block",
              }}
            >
              {letter}
            </motion.span>
          </span>
        )
      })}
    </motion.span>
  )
}
