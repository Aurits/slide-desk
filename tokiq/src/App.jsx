import { useState, useRef, useEffect, useCallback } from 'react'

/* ------------------------------------------------------------------ */
/*  Fake data — there is NO backend. Opponents, chat, feed, jackpot    */
/*  and leaderboards are all simulated client-side to sell the feel.   */
/* ------------------------------------------------------------------ */

const BOT_NAMES = [
  'Kenji', 'Sarah', 'Yuki', 'Alex', 'Amina', 'David', 'Mei',
  'Liam', 'Sofia', 'Hiro', 'Noah', 'Aiko', 'Marco', 'Zara', 'Ravi',
]
const AVATAR_COLORS = [
  'from-cyan-400 to-blue-500', 'from-violet-400 to-fuchsia-500',
  'from-emerald-400 to-teal-500', 'from-amber-400 to-orange-500',
  'from-rose-400 to-pink-500', 'from-indigo-400 to-sky-500',
]
const CHAT_LINES = [
  'good luck everyone 🔥', 'target looks tricky', 'so close last round 😭',
  'nice win!', 'i feel this one', 'gonna nail it this time',
  'who else is shaking 😂', 'lets gooo', 'almost had it', 'precision mode on',
  'one more round', 'that was unreal', 'my timing is off today', 'easy 👀',
]
const WIN_VERBS = ['won', 'banked', 'scooped', 'grabbed']

const yen = (n) => '¥' + Math.round(n).toLocaleString('en-US')
const rand = (min, max) => Math.random() * (max - min) + min
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const hashColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

// Bell-ish noise so opponents cluster near the target (skill, not chaos)
const noise = (spread) => ((Math.random() + Math.random() + Math.random()) / 3 - 0.5) * 2 * spread

const ENTRY_FEE = 100
const HOUSE_RATE = 0.1

const SEED_LEADERBOARD = [
  { name: 'Yuki',  wins: 142, acc: 0.012, earn: 184500 },
  { name: 'Kenji', wins: 128, acc: 0.018, earn: 161200 },
  { name: 'Amina', wins: 119, acc: 0.021, earn: 150400 },
  { name: 'David', wins: 104, acc: 0.024, earn: 132900 },
  { name: 'Mei',   wins: 97,  acc: 0.027, earn: 121000 },
  { name: 'Alex',  wins: 88,  acc: 0.031, earn: 109800 },
]

/* ================================================================== */

export default function App() {
  // phase: 'lobby' | 'countdown' | 'running' | 'result'
  const [phase, setPhase] = useState('lobby')
  const [round, setRound] = useState(1042)
  const [target, setTarget] = useState(10.0)
  const [elapsed, setElapsed] = useState(0)
  const [yourTime, setYourTime] = useState(null)
  const [lobbyLeft, setLobbyLeft] = useState(5)
  const [countNum, setCountNum] = useState(3)
  const [results, setResults] = useState([])
  const [winner, setWinner] = useState(null)
  const [showWinner, setShowWinner] = useState(false)
  const [showBoard, setShowBoard] = useState(false)
  const [boardTab, setBoardTab] = useState('Daily')

  const [jackpot, setJackpot] = useState(1245000)
  const [tablePlayers, setTablePlayers] = useState(10) // opponents at your table (winnable)
  const [feed, setFeed] = useState([])
  const [chat, setChat] = useState([])
  const [yourStats, setYourStats] = useState({ wins: 11, best: null, streak: 0 })

  const rafRef = useRef(null)
  const startRef = useRef(0)
  const stoppedRef = useRef(false)
  const chatBoxRef = useRef(null)

  /* ---- ambient simulation ---- */
  useEffect(() => {
    const t = setInterval(() => setJackpot((j) => j + Math.round(rand(50, 900))), 700)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      const name = pick(BOT_NAMES)
      const roll = Math.random()
      let text
      if (roll < 0.5) text = `${name} ${pick(WIN_VERBS)} ${yen(rand(3000, 28000))}`
      else if (roll < 0.7) text = `${name} achieved perfect timing ✨`
      else if (roll < 0.85) text = `${name} reached Top 10`
      else text = `${name} joined the jackpot`
      setFeed((f) => [{ id: Math.random(), text, win: roll < 0.5 }, ...f].slice(0, 6))
    }, 2600)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setChat((c) => [...c, { id: Math.random(), name: pick(BOT_NAMES), text: pick(CHAT_LINES) }].slice(-30))
    }, 2200)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
  }, [chat])

  /* ---- lobby countdown (player count set once per round, not per tick) ---- */
  useEffect(() => {
    if (phase !== 'lobby') return
    if (lobbyLeft <= 0) { setCountNum(3); setPhase('countdown'); return }
    const t = setTimeout(() => setLobbyLeft((n) => n - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, lobbyLeft])

  /* ---- 3·2·1 countdown ---- */
  useEffect(() => {
    if (phase !== 'countdown') return
    if (countNum <= 0) { beginRound(); return }
    const t = setTimeout(() => setCountNum((n) => n - 1), 750)
    return () => clearTimeout(t)
  }, [phase, countNum])

  /* ---- running: rAF timer ---- */
  const beginRound = () => {
    setElapsed(0)
    setYourTime(null)
    stoppedRef.current = false
    setPhase('running')
    startRef.current = performance.now()
    const loop = (now) => {
      const e = (now - startRef.current) / 1000
      setElapsed(e)
      if (e > target + 2.5 && !stoppedRef.current) { resolveRound(null); return }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
  }

  const handleStop = useCallback(() => {
    if (phase !== 'running' || stoppedRef.current) return
    stoppedRef.current = true
    const t = (performance.now() - startRef.current) / 1000
    cancelAnimationFrame(rafRef.current)
    setYourTime(t)
    resolveRound(t)
  }, [phase, target, tablePlayers])

  const resolveRound = (myTime) => {
    cancelAnimationFrame(rafRef.current)
    const n = Math.max(1, tablePlayers - 1)
    const names = [...BOT_NAMES].sort(() => Math.random() - 0.5).slice(0, n)
    const bots = names.map((name) => {
      const t = Math.max(0.05, target + noise(0.28))
      return { name, time: t, diff: Math.abs(t - target), you: false }
    })
    const all = [...bots]
    if (myTime != null) all.push({ name: 'You', time: myTime, diff: Math.abs(myTime - target), you: true })
    all.sort((a, b) => a.diff - b.diff)
    const prizePool = tablePlayers * ENTRY_FEE * (1 - HOUSE_RATE)
    const win = all[0]
    setResults(all)
    setWinner({ ...win, prize: prizePool })
    setPhase('result')

    if (myTime != null) {
      setYourStats((s) => ({
        wins: s.wins + (win.you ? 1 : 0),
        best: s.best == null ? Math.abs(myTime - target) : Math.min(s.best, Math.abs(myTime - target)),
        streak: win.you ? s.streak + 1 : 0,
      }))
      if (win.you) {
        setFeed((f) => [{ id: Math.random(), text: `You ${pick(WIN_VERBS)} ${yen(prizePool)} 🏆`, win: true }, ...f].slice(0, 6))
      }
    }
    setTimeout(() => setShowWinner(true), 550)
  }

  const nextRound = () => {
    setShowWinner(false)
    setRound((r) => r + 1)
    setTarget(Number(rand(6, 12).toFixed(2)))
    setTablePlayers(Math.floor(rand(8, 15)))
    setResults([])
    setWinner(null)
    setLobbyLeft(5)
    setPhase('lobby')
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  /* ---- spacebar = stop (desktop demo nicety) ---- */
  useEffect(() => {
    const onKey = (e) => { if (e.code === 'Space') { e.preventDefault(); handleStop() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleStop])

  const yourDiff = yourTime != null ? Math.abs(yourTime - target) : null

  /* ================================================================ */
  return (
    // Outer is locked to the viewport and clips — the PAGE can never scroll.
    <div className="h-[100svh] w-full overflow-hidden flex items-center justify-center bg-[#05060a] sm:p-6">
      {/* phone frame: full height on mobile, capped + centered on desktop */}
      <div className="relative mx-auto flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-gradient-to-b from-[#0a0b14] via-[#0b0d18] to-[#060710] sm:h-[min(100svh-3rem,880px)] sm:rounded-[42px] sm:border sm:border-white/10 sm:shadow-[0_0_80px_-10px_rgba(34,211,238,0.25)]">
        {/* ambient glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -right-28 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

        {/* content column — gap-based, everything fluid */}
        <div className="relative z-10 flex h-full flex-col gap-[1.5vh] px-4 pt-[2vh] pb-[1.5vh]">
          <Header round={round} onBoard={() => setShowBoard(true)} />
          <Jackpot value={jackpot} players={tablePlayers} />

          {/* center stage absorbs all remaining height */}
          <div className="min-h-0 flex-1">
            <Stage
              phase={phase} target={target} elapsed={elapsed}
              countNum={countNum} lobbyLeft={lobbyLeft}
              yourTime={yourTime} yourDiff={yourDiff} onStop={handleStop}
            />
          </div>

          <ResultsStrip phase={phase} results={results} />
          <Feed feed={feed} />
          <Chat chat={chat} boxRef={chatBoxRef} />
        </div>

        {showWinner && winner && (
          <WinnerOverlay winner={winner} yourTime={yourTime} target={target} onNext={nextRound} />
        )}
        {showBoard && (
          <Leaderboard tab={boardTab} setTab={setBoardTab} you={yourStats} onClose={() => setShowBoard(false)} />
        )}
      </div>
    </div>
  )
}

/* ============================== pieces ============================= */

function Header({ round, onBoard }) {
  return (
    <div className="flex shrink-0 items-center justify-between">
      <div className="leading-none">
        <div className="text-[clamp(20px,6vw,26px)] font-black tracking-[0.18em] text-white">
          TOK<span className="text-cyan-400">I</span>Q
        </div>
        <div className="mt-0.5 text-[10px] font-medium tracking-wide text-white/40">
          Beat Time. Win Together.
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/70 ring-1 ring-white/10">
          Round #{round}
        </span>
        <button
          onClick={onBoard}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/5 text-white/80 ring-1 ring-white/10 transition active:scale-95"
          aria-label="Open leaderboards"
        >
          🏆
        </button>
      </div>
    </div>
  )
}

function Jackpot({ value, players }) {
  return (
    <div className="shrink-0 rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/10 backdrop-blur">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-white/40">Mega Jackpot</span>
        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {players} at your table
        </span>
      </div>
      <div className="tnum jackpot-text mt-0.5 text-[clamp(1.4rem,7vw,1.9rem)] font-black tracking-tight">
        {yen(value)}
      </div>
    </div>
  )
}

function Stage({ phase, target, elapsed, countNum, lobbyLeft, yourTime, yourDiff, onStop }) {
  return (
    <div className="flex h-full flex-col items-center justify-between">
      {/* target stays visible the whole round so you can time against it */}
      <div className="shrink-0 text-center">
        <div className="text-[11px] uppercase tracking-[0.3em] text-cyan-300/70">Target</div>
        <div className="tnum text-[clamp(2rem,8.5vw,3rem)] font-black leading-none text-white">
          {target.toFixed(2)}<span className="text-[0.5em] text-white/40">s</span>
        </div>
      </div>

      {/* big readout absorbs the slack and shrinks on short screens */}
      <div className="grid min-h-0 flex-1 place-items-center">
        {phase === 'lobby' && (
          <div className="text-center animate-float-up">
            <div className="tnum text-[clamp(3rem,16vw,4.5rem)] font-black leading-none text-white/90">{Math.max(lobbyLeft, 0)}</div>
            <div className="mt-1 text-xs font-medium text-white/40">round starts in…</div>
          </div>
        )}
        {phase === 'countdown' && (
          <div key={countNum} className="animate-float-up tnum text-[clamp(3.5rem,20vw,6rem)] font-black leading-none text-cyan-300 drop-shadow-[0_0_25px_rgba(34,211,238,0.6)]">
            {countNum > 0 ? countNum : 'GO'}
          </div>
        )}
        {phase === 'running' && (
          <div className="tnum text-[clamp(3rem,17vw,5rem)] font-black leading-none text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]">
            {elapsed.toFixed(2)}
          </div>
        )}
        {phase === 'result' && (
          <div className="text-center animate-float-up">
            <div className="tnum text-[clamp(2.5rem,14vw,4rem)] font-black leading-none text-white">{yourTime != null ? yourTime.toFixed(2) : '—'}</div>
            <div className={`mt-1 text-sm font-semibold ${yourDiff != null && yourDiff < 0.1 ? 'text-emerald-300' : 'text-amber-300'}`}>
              {yourTime == null ? 'missed the round' : `off by ${yourDiff.toFixed(2)}s`}
            </div>
          </div>
        )}
      </div>

      <StopButton phase={phase} onStop={onStop} />
    </div>
  )
}

function StopButton({ phase, onStop }) {
  const live = phase === 'running'
  const label = phase === 'running' ? 'STOP'
    : phase === 'lobby' ? 'GET READY'
    : phase === 'countdown' ? '…'
    : 'ROUND OVER'
  return (
    <button
      onClick={onStop}
      disabled={!live}
      // sized by the SMALLER of width / height / cap so it always fits
      style={{ width: 'min(42vw, 26vh, 11rem)', height: 'min(42vw, 26vh, 11rem)' }}
      className={[
        'relative grid shrink-0 place-items-center rounded-full text-[clamp(1.1rem,4.5vw,1.5rem)] font-black tracking-widest transition-transform select-none',
        live
          ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white animate-glow active:scale-95'
          : 'bg-white/5 text-white/40 ring-1 ring-white/10',
      ].join(' ')}
    >
      <span className="absolute inset-2 rounded-full ring-1 ring-white/20" />
      {label}
    </button>
  )
}

function ResultsStrip({ phase, results }) {
  const show = phase === 'result' && results.length > 0
  return (
    <div className="h-[clamp(48px,7.5vh,62px)] shrink-0">
      {show && (
        <div className="flex h-full items-center gap-2 overflow-x-auto rounded-xl bg-white/[0.03] p-2 no-scrollbar ring-1 ring-white/10">
          {results.slice(0, 6).map((r, i) => (
            <div key={r.name + i}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-1.5 ${r.you ? 'bg-cyan-500/15 ring-1 ring-cyan-400/40' : 'bg-white/5'}`}>
              <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold ${i === 0 ? 'bg-amber-400 text-black' : 'bg-white/10 text-white/60'}`}>{i + 1}</span>
              <span className="text-xs font-semibold text-white/90">{r.you ? 'You' : r.name}</span>
              <span className="tnum text-xs text-white/60">{r.time.toFixed(2)}s</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Feed({ feed }) {
  return (
    <div className="h-[clamp(18px,2.6vh,26px)] shrink-0 overflow-hidden">
      {feed[0] && (
        <div key={feed[0].id} className="animate-float-up flex items-center gap-2 text-xs">
          <span className={feed[0].win ? 'text-amber-300' : 'text-white/50'}>{feed[0].win ? '🏆' : '•'}</span>
          <span className="truncate text-white/70">{feed[0].text}</span>
        </div>
      )}
    </div>
  )
}

function Chat({ chat, boxRef }) {
  return (
    <div className="shrink-0 rounded-xl bg-white/[0.03] ring-1 ring-white/10">
      <div ref={boxRef} className="no-scrollbar h-[clamp(46px,8vh,72px)] space-y-1 overflow-y-auto p-2">
        {chat.slice(-8).map((m) => (
          <div key={m.id} className="text-[11px] leading-tight">
            <span className={`bg-gradient-to-r font-semibold ${hashColor(m.name)} bg-clip-text text-transparent`}>{m.name}</span>
            <span className="ml-1.5 text-white/55">{m.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function WinnerOverlay({ winner, yourTime, target, onNext }) {
  const youWon = winner.you
  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="animate-slide-up relative max-h-[92%] w-full overflow-y-auto rounded-t-[36px] border-t border-white/10 bg-gradient-to-b from-[#11131f] to-[#0a0b14] px-6 pb-7 pt-6 text-center no-scrollbar">
        {youWon && (
          <>
            <span className="animate-ring-pop absolute left-1/2 top-7 h-24 w-24 -translate-x-1/2 rounded-full ring-2 ring-amber-300/60" />
            <span className="animate-ring-pop absolute left-1/2 top-7 h-24 w-24 -translate-x-1/2 rounded-full ring-2 ring-cyan-300/60" style={{ animationDelay: '0.15s' }} />
          </>
        )}
        <div className="text-[clamp(2.5rem,12vw,3rem)] leading-none">{youWon ? '🏆' : '🎯'}</div>
        <div className="mt-2 text-[11px] uppercase tracking-[0.3em] text-cyan-300/70">
          {youWon ? 'You won the round' : 'Round winner'}
        </div>
        <div className="mt-1 text-[clamp(1.5rem,7vw,1.875rem)] font-black text-white">
          {youWon ? 'Victory!' : winner.name}
        </div>
        <div className="jackpot-text mt-1 text-[clamp(2rem,9vw,2.5rem)] font-black">{yen(winner.prize)}</div>

        <div className="mt-4 flex items-stretch justify-center gap-2">
          <Mini label="Target" value={`${target.toFixed(2)}s`} />
          <Mini label="Winning time" value={`${winner.time.toFixed(2)}s`} highlight />
          <Mini label="Your time" value={yourTime != null ? `${yourTime.toFixed(2)}s` : '—'} />
        </div>

        {!youWon && yourTime != null && (
          <p className="mt-3 text-sm text-white/50">
            So close — off by {Math.abs(yourTime - target).toFixed(2)}s. One more round?
          </p>
        )}

        <button
          onClick={onNext}
          className="mt-4 w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 py-4 text-base font-bold text-white transition active:scale-[0.98]"
        >
          Play Next Round · {yen(ENTRY_FEE)}
        </button>
      </div>
    </div>
  )
}

function Mini({ label, value, highlight }) {
  return (
    <div className={`flex-1 rounded-xl px-2 py-2 ${highlight ? 'bg-cyan-500/15 ring-1 ring-cyan-400/40' : 'bg-white/5'}`}>
      <div className="text-[9px] uppercase tracking-wider text-white/40">{label}</div>
      <div className="tnum mt-0.5 text-sm font-bold text-white">{value}</div>
    </div>
  )
}

function Leaderboard({ tab, setTab, you, onClose }) {
  const tabs = ['Daily', 'Weekly', 'Monthly', 'All-Time']
  const cats = ['Most Wins', 'Best Accuracy', 'Highest Earnings']
  const [cat, setCat] = useState('Most Wins')
  const rows = [...SEED_LEADERBOARD].sort((a, b) =>
    cat === 'Most Wins' ? b.wins - a.wins
      : cat === 'Best Accuracy' ? a.acc - b.acc
      : b.earn - a.earn
  )
  const val = (r) => cat === 'Most Wins' ? `${r.wins} wins`
    : cat === 'Best Accuracy' ? `±${r.acc.toFixed(3)}s`
    : yen(r.earn)
  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-[#070810]/95 backdrop-blur-md animate-slide-up">
      <div className="flex shrink-0 items-center justify-between px-5 pt-5 pb-3">
        <div className="text-xl font-black tracking-wide text-white">Leaderboards</div>
        <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-white/70 ring-1 ring-white/10 active:scale-95" aria-label="Close">✕</button>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2 px-5">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${tab === t ? 'bg-cyan-400 text-black' : 'bg-white/5 text-white/60'}`}>{t}</button>
        ))}
      </div>

      <div className="mt-3 flex shrink-0 flex-wrap gap-2 px-5">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${cat === c ? 'bg-white/15 text-white ring-1 ring-white/20' : 'bg-white/[0.03] text-white/50'}`}>{c}</button>
        ))}
      </div>

      <div className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto px-5 pb-6 no-scrollbar">
        {rows.map((r, i) => (
          <div key={r.name} className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3 ring-1 ring-white/10">
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${i === 0 ? 'bg-amber-400 text-black' : i < 3 ? 'bg-white/15 text-white' : 'bg-white/5 text-white/50'}`}>{i + 1}</span>
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br ${hashColor(r.name)} text-sm font-bold text-white`}>{r.name[0]}</span>
            <span className="flex-1 truncate font-semibold text-white/90">{r.name}</span>
            <span className="tnum shrink-0 text-sm font-bold text-cyan-300">{val(r)}</span>
          </div>
        ))}

        <div className="mt-3 flex items-center gap-3 rounded-xl bg-cyan-500/10 p-3 ring-1 ring-cyan-400/40">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-sm font-bold text-white/70">—</span>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-white">Y</span>
          <span className="flex-1 font-semibold text-white">You</span>
          <span className="tnum shrink-0 text-sm font-bold text-cyan-300">
            {cat === 'Most Wins' ? `${you.wins} wins`
              : cat === 'Best Accuracy' ? (you.best != null ? `±${you.best.toFixed(3)}s` : '—')
              : yen(you.wins * 8100)}
          </span>
        </div>
      </div>
    </div>
  )
}
