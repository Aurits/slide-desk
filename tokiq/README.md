# TOKIQ — Social Precision Timing Game

**Beat Time. Win Together.**

An interactive, front-end-only MVP prototype of *Tokiq*: a real-time multiplayer
social game where players stop a counting timer as close as possible to a visible
target time. Closest player wins the round's prize pool.

This build is designed for **investor demos and MVP validation** — it looks and
feels like a live multiplayer product, but there is **no backend**.

---

## What's real vs. simulated

| Real (actual code) | Simulated (faked client-side) |
| --- | --- |
| The timer (`requestAnimationFrame` + `performance.now()`) | Other players' stop times |
| Your STOP tap and your accuracy | Live chat messages |
| Winner calculation (closest to target) | Winners activity feed |
| Round prize math | Mega Jackpot growth |
| Your stats / streak | Leaderboard standings |

> The only genuinely interactive part is **the timer and your tap** — which is
> exactly the hook the demo needs to prove ("I was *so* close"). Everything else
> is theatre to make the screen feel alive.

Opponent times are generated with bell-ish noise clustered around the target, so
they read as *skill*, not random. The table is kept to 8–14 players so a human can
realistically win during a demo (a real game with hundreds of players would make
winning statistically near-impossible).

---

## How to play

- Wait out the lobby countdown → `3 · 2 · 1 · GO`
- The timer counts **up** from `00.00`
- Hit the big **STOP** button when you think it has reached the **target**
- **Desktop:** press **Spacebar** to STOP
- Closest to the target wins the pool; a winner card slides up, then "Play Next Round"

---

## Design

A **single screen that morphs by game phase** rather than navigating between pages —
this keeps the tension of the "one more round" loop intact. Overlays (winner card,
leaderboard) appear only when needed and dismiss back to the same screen.

- Dark mode · neon accents · glassmorphism · Japanese-minimal branding
- **Fully responsive with zero page scroll at any size** — fonts, the STOP button,
  and section heights are all fluid (`clamp()` / viewport-min sizing); the page is
  locked to `100svh` and clips, so it can never scroll.
- **Mobile:** the device fills the viewport.
- **Large screens (`lg+`):** a branding/context panel sits beside the device so the
  width is used intentionally — presentation-ready, not a tiny island in a void.

Verified at 360×640, 375×667, 390×844, 412×915, a 380×560 short screen, and desktop
up to 2560-wide — all with no overflow.

---

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

Build for production / hosting:

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```

### Deploy

It's a static site — drag the `dist/` folder onto Netlify, or connect the repo to
Vercel (framework preset: **Vite**). No environment variables, no server.

---

## Tech

- **React 18** + **Vite 6**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- No backend, no state library — all game state is local React state.

## Project layout

```
tokiq/
├─ index.html
├─ src/
│  ├─ main.jsx      # React entry
│  ├─ App.jsx       # entire game: state machine, simulation, all UI
│  └─ index.css     # Tailwind import + keyframe animations
└─ vite.config.js
```

Everything lives in `src/App.jsx`: the phase state machine
(`lobby → countdown → running → result`), the fake-opponent simulation, and the UI
components (`Header`, `Jackpot`, `Stage`, `StopButton`, `WinnerOverlay`,
`Leaderboard`, `BrandPanel`).

---

## Not in this MVP (the real-product hard parts)

- **Real multiplayer** — networking, matchmaking, synchronized round start.
- **Anti-cheat / fairness** — the stop time is measured on the client; a real build
  needs server-authoritative timing and latency compensation. This is the core
  engineering challenge.
- **Payments & regulation** — pay-to-enter + prize pool + house fee needs careful
  per-jurisdiction legal review (especially in Japan). The "skill-based" framing
  helps but does not automatically exempt it.
- A path from round wins to the **Mega Jackpot** (currently an aspirational growing
  number, not yet winnable).

These are intentionally out of scope — this prototype exists to validate the *feel*
and sell the concept, not to ship the production game.
