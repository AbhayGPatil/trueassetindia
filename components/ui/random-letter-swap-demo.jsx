'use client'

import { RandomLetterSwapForward, RandomLetterSwapPingPong } from "@/components/ui/random-letter-swap"

export function BasicExample() {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      borderRadius: "0.5rem",
      backgroundColor: "white",
      fontSize: "2rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      <div style={{
        height: "100%",
        color: "#ef4444",
        borderRadius: "0.75rem",
        padding: "3rem 0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.5rem",
      }}>
        <RandomLetterSwapForward
          label="True   Asset   India!"
          reverse={true}
        />
        <RandomLetterSwapForward
          label="True   Asset   India!"
          reverse={false}
          style={{ fontWeight: "bold", fontStyle: "italic", padding: "0 1rem" }}
        />
        <RandomLetterSwapPingPong 
          label="True   Asset   India!" 
        />
        <RandomLetterSwapPingPong
          label="True   Asset   India!"
          reverse={false}
          style={{ fontWeight: "bold" }}
        />
      </div>
    </div>
  )
}

export function CustomStylesExample() {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      borderRadius: "0.5rem",
      backgroundColor: "#0f172a",
      fontSize: "1.5rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        color: "white",
      }}>
        <RandomLetterSwapForward
          label="Hover me!"
          style={{ fontFamily: "monospace" }}
        />
        <RandomLetterSwapPingPong
          label="Or me!"
          style={{ fontFamily: "serif", fontStyle: "italic" }}
        />
      </div>
    </div>
  )
}

export function TimingExample() {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      borderRadius: "0.5rem",
      backgroundColor: "white",
      fontSize: "1.5rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1.5rem",
    }}>
      <RandomLetterSwapForward
        label="Fast Animation"
        transition={{ type: "spring", duration: 0.3 }}
        staggerDuration={0.01}
      />
      <RandomLetterSwapPingPong
        label="Slow Animation"
        transition={{ type: "spring", duration: 1.2 }}
        staggerDuration={0.05}
      />
    </div>
  )
}

export function DirectionExample() {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      borderRadius: "0.5rem",
      backgroundColor: "black",
      fontSize: "1.5rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1.5rem",
      color: "white",
    }}>
      <RandomLetterSwapForward
        label="Up to Down"
        reverse={true}
      />
      <RandomLetterSwapForward
        label="Down to Up"
        reverse={false}
      />
    </div>
  )
}
