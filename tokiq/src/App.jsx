import { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react'
import bgLoopUrl from './vairon_alexander-persecucion-game-loop-476260.mp3'
import successUrl from './joyinsound-chasing-success-building-success-507156.mp3'

const MUSIC_VOL = 0.38

/* ------------------------------------------------------------------ */
/*  i18n — English · Español · 日本語 (extend by adding a lang key)    */
/* ------------------------------------------------------------------ */
const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'ja', label: '日本語' },
]
const I18N = {
  en: {
    tagline: 'Beat Time. Win Together.', target: 'Target', megaJackpot: 'Mega Jackpot',
    atTable: '{n} at table', round: 'Round #{n}', joinOrSkip: 'join or skip…',
    stop: 'STOP', watching: 'WATCHING', roundOver: 'ROUND OVER',
    joinRound: 'Join Round · {fee}', skipWatch: 'Skip & watch this round →', addFunds: '+ Add {amt} (demo top-up)',
    youWon: 'You won the round', roundWinner: 'Round winner', victory: 'Victory!',
    winningTime: 'Winning time', yourTime: 'Your time', roundSnapshot: 'Round snapshot', timeDelta: 'time · Δ off',
    soClose: 'So close, off by {d}s. One more round?', watched: 'You watched this round.',
    balanceLow: 'Balance low. Top up to keep playing.', nextRound: 'Next Round · {fee} to join', addFundsBtn: '+ Add {amt} (demo)',
    leaderboards: 'Leaderboards', Daily: 'Daily', Weekly: 'Weekly', Monthly: 'Monthly', 'All-Time': 'All-Time',
    mostWins: 'Most Wins', bestAccuracy: 'Best Accuracy', highestEarnings: 'Highest Earnings', winsN: '{n} wins',
    liveFeed: 'Live feed', you: 'You', introDesc: 'A real-time precision game of nerve and timing. Stop the clock as close to the target as you dare. The closest player takes the pool.',
    introHint: 'Tap anywhere or press {key} to enter',
    settings: 'Settings', profile: 'Profile', language: 'Language', sound: 'Sound', on: 'On', off: 'Off',
    balance: 'Balance', wins: 'Wins', best: 'Best', streak: 'Streak', provablyFair: 'Provably fair',
    offBy: 'off by {d}s', satOut: 'you sat this one out', missed: 'missed the round',
  },
  es: {
    tagline: 'Vence al tiempo. Gana juntos.', target: 'Objetivo', megaJackpot: 'Megabote',
    atTable: '{n} en la mesa', round: 'Ronda #{n}', joinOrSkip: 'únete o pásala…',
    stop: '¡PARA!', watching: 'MIRANDO', roundOver: 'FIN DE RONDA',
    joinRound: 'Entrar · {fee}', skipWatch: 'Pásala y mira esta ronda →', addFunds: '+ Añadir {amt} (demo)',
    youWon: 'Ganaste la ronda', roundWinner: 'Ganador de la ronda', victory: '¡Victoria!',
    winningTime: 'Tiempo ganador', yourTime: 'Tu tiempo', roundSnapshot: 'Resumen de ronda', timeDelta: 'tiempo · Δ',
    soClose: '¡Casi! por {d}s. ¿Otra ronda?', watched: 'Miraste esta ronda.',
    balanceLow: 'Saldo bajo. Recarga para seguir.', nextRound: 'Siguiente · {fee}', addFundsBtn: '+ Añadir {amt} (demo)',
    leaderboards: 'Clasificación', Daily: 'Diario', Weekly: 'Semanal', Monthly: 'Mensual', 'All-Time': 'Histórico',
    mostWins: 'Más victorias', bestAccuracy: 'Mejor precisión', highestEarnings: 'Mayores ganancias', winsN: '{n} victorias',
    liveFeed: 'En vivo', you: 'Tú', introDesc: 'Un juego de precisión en tiempo real, de nervio y sincronización. Detén el reloj lo más cerca posible del objetivo. El más cercano se lleva el bote.',
    introHint: 'Toca o pulsa {key} para entrar',
    settings: 'Ajustes', profile: 'Perfil', language: 'Idioma', sound: 'Sonido', on: 'Activado', off: 'Apagado',
    balance: 'Saldo', wins: 'Victorias', best: 'Mejor', streak: 'Racha', provablyFair: 'Juego justo verificable',
    offBy: 'por {d}s', satOut: 'te saltaste esta', missed: 'fallaste la ronda',
  },
  ja: {
    tagline: '時を制し、共に勝て。', target: '目標', megaJackpot: 'メガジャックポット',
    atTable: '卓に{n}人', round: 'ラウンド #{n}', joinOrSkip: '参加かパスを…',
    stop: 'ストップ', watching: '観戦中', roundOver: 'ラウンド終了',
    joinRound: '参加 · {fee}', skipWatch: 'パスして観戦 →', addFunds: '+ {amt} 追加（デモ）',
    youWon: 'ラウンド勝利', roundWinner: 'ラウンド勝者', victory: '勝利！',
    winningTime: '勝利タイム', yourTime: 'あなたのタイム', roundSnapshot: 'ラウンド結果', timeDelta: 'タイム · 誤差',
    soClose: '惜しい！誤差 {d} 秒。もう一回？', watched: 'このラウンドは観戦しました。',
    balanceLow: '残高が少ないです。チャージして続行。', nextRound: '次のラウンド · {fee}', addFundsBtn: '+ {amt} 追加（デモ）',
    leaderboards: 'ランキング', Daily: 'デイリー', Weekly: 'ウィークリー', Monthly: 'マンスリー', 'All-Time': '全期間',
    mostWins: '勝利数', bestAccuracy: '精度', highestEarnings: '獲得額', winsN: '{n}勝',
    liveFeed: 'ライブ', you: 'あなた', introDesc: 'リアルタイムの精密タイミングゲーム。狙った時間ぴったりにクロックを止めよう。最も近いプレイヤーがプールを獲得します。',
    introHint: 'タップまたは {key} キーで開始',
    settings: '設定', profile: 'プロフィール', language: '言語', sound: 'サウンド', on: 'オン', off: 'オフ',
    balance: '残高', wins: '勝利', best: 'ベスト', streak: '連勝', provablyFair: '公正性証明済み',
    offBy: '誤差 {d} 秒', satOut: '不参加でした', missed: 'ラウンドを逃した',
  },
}
const LangCtx = createContext({ t: (k) => k, lang: 'en' })
const useT = () => useContext(LangCtx)
function makeT(lang) {
  return (key, vars) => {
    let s = (I18N[lang] && I18N[lang][key]) ?? I18N.en[key] ?? key
    if (vars) for (const k in vars) s = s.split('{' + k + '}').join(vars[k])
    return s
  }
}

/* ------------------------------------------------------------------ */
/*  Fake data — there is NO backend. Opponents, chat, feed, jackpot    */
/*  and leaderboards are all simulated client-side to sell the feel.   */
/* ------------------------------------------------------------------ */

const BOT_NAMES = [
  'Kenji', 'Sarah', 'Yuki', 'Alex', 'Amina', 'David', 'Mei',
  'Liam', 'Sofia', 'Hiro', 'Noah', 'Aiko', 'Marco', 'Zara', 'Ravi',
]
// disciplined cool palette — flat solids, no gradients
const AVATAR_COLORS = ['bg-cyan-400', 'bg-teal-400', 'bg-sky-400', 'bg-indigo-400', 'bg-violet-400']
const NAME_COLORS = ['text-cyan-300', 'text-teal-300', 'text-sky-300', 'text-indigo-300', 'text-violet-300']
const CHAT_LINES = [
  'good luck everyone 🔥', 'target looks tricky', 'so close last round 😭',
  'nice win!', 'i feel this one', 'gonna nail it this time',
  'who else is shaking 😂', 'lets gooo', 'almost had it', 'precision mode on',
  'one more round', 'that was unreal', 'my timing is off today', 'easy 👀',
]
const WIN_VERBS = ['won', 'banked', 'scooped', 'grabbed']
const CONFETTI = ['#fbbf24', '#fde68a', '#22d3ee', '#ffffff', '#34d399']

const yen = (n) => '¥' + Math.round(n).toLocaleString('en-US')
const rand = (min, max) => Math.random() * (max - min) + min
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const hashColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
const hashName = (name) => NAME_COLORS[name.charCodeAt(0) % NAME_COLORS.length]

// Bell-ish noise so opponents cluster near the target (skill, not chaos)
const noise = (spread) => ((Math.random() + Math.random() + Math.random()) / 3 - 0.5) * 2 * spread

const ENTRY_FEE = 100
const HOUSE_RATE = 0.1
const START_BALANCE = 5000
const TOPUP = 5000

// ---- target generation ----
const PHI_INV = 0.6180339887498949 // golden-ratio conjugate → R1 low-discrepancy sequence
// weighted "bands" give each round a character: [min, max, weight]
const TARGET_BANDS = [
  [2.5, 4.5, 0.10],   // ⚡ lightning
  [4.5, 8.0, 0.24],   // quick
  [8.0, 14.0, 0.36],  // classic
  [14.0, 22.0, 0.20], // long
  [22.0, 30.0, 0.10], // endurance
]
const SIGNATURE_TARGETS = [5.55, 7.77, 9.99, 11.11, 13.13, 16.16, 21.21, 27.0]

const SEED_LEADERBOARD = [
  { name: 'Yuki',  wins: 142, acc: 0.012, earn: 184500 },
  { name: 'Kenji', wins: 128, acc: 0.018, earn: 161200 },
  { name: 'Amina', wins: 119, acc: 0.021, earn: 150400 },
  { name: 'David', wins: 104, acc: 0.024, earn: 132900 },
  { name: 'Mei',   wins: 97,  acc: 0.027, earn: 121000 },
  { name: 'Alex',  wins: 88,  acc: 0.031, earn: 109800 },
]

/* ---- sound (Web Audio, no asset files) ---- */
let _ac
const audio = () => {
  if (typeof window === 'undefined') return null
  if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)()
  if (_ac.state === 'suspended') _ac.resume()
  return _ac
}
const mutedRef = { current: false }
function beep(freq, atOffset, dur, { type = 'sine', vol = 0.18 } = {}) {
  const ac = audio()
  if (!ac || mutedRef.current) return
  const t = ac.currentTime + atOffset
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(vol, t + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(gain).connect(ac.destination)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}
const clickSound = () => beep(420, 0, 0.07, { type: 'triangle', vol: 0.12 })
// mechanical stopwatch tick — alternates tick/tock; tightens + rises near the target
const tickSound = (tense, hi) =>
  beep(hi ? (tense ? 2700 : 2050) : (tense ? 2300 : 1700), 0, 0.018, {
    type: 'square',
    vol: tense ? 0.07 : 0.04,
  })
const countBeep = (go) => beep(go ? 1100 : 680, 0, go ? 0.32 : 0.13, { type: 'sine', vol: 0.17 })
// satisfying "thunk" when you slam STOP
const stopSound = () => {
  beep(340, 0, 0.1, { type: 'sine', vol: 0.22 })
  beep(150, 0.015, 0.2, { type: 'sine', vol: 0.2 })
}
const winSound = () => {
  // bright ascending arpeggio + sparkle
  ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => beep(f, i * 0.09, 0.22, { type: 'triangle', vol: 0.16 }))
  beep(1568, 0.42, 0.5, { type: 'sine', vol: 0.1 })
}

/* ---- count-up hook for the balance roll ---- */
function useCountUp(target, ms = 900) {
  const [v, setV] = useState(target)
  const vRef = useRef(target)
  vRef.current = v
  useEffect(() => {
    const from = vRef.current
    if (from === target) return
    let raf
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / ms)
      const eased = 1 - Math.pow(1 - p, 3)
      setV(from + (target - from) * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return v
}

/* ================================================================== */

export default function App() {
  // phase: 'lobby' | 'countdown' | 'running' | 'result'
  const [phase, setPhase] = useState('lobby')
  const [round, setRound] = useState(1042)
  const [target, setTarget] = useState(10.0)
  const [elapsed, setElapsed] = useState(0)
  const [yourTime, setYourTime] = useState(null)
  const [lobbyLeft, setLobbyLeft] = useState(6)
  const [countNum, setCountNum] = useState(3)
  const [results, setResults] = useState([])
  const [winner, setWinner] = useState(null)
  const [showWinner, setShowWinner] = useState(false)
  const [showBoard, setShowBoard] = useState(false)
  const [boardTab, setBoardTab] = useState('Daily')
  const [showSettings, setShowSettings] = useState(false)
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('tokiq_lang') || 'en' } catch { return 'en' }
  })
  const t = makeT(lang)
  useEffect(() => { try { localStorage.setItem('tokiq_lang', lang) } catch {} }, [lang])

  const [jackpot, setJackpot] = useState(1245000)
  const [tablePlayers, setTablePlayers] = useState(10)
  const [activity, setActivity] = useState([]) // unified live feed: wins, events + chat
  const [yourStats, setYourStats] = useState({ wins: 11, best: null, streak: 0 })

  // wallet + round participation + fx
  const [balance, setBalance] = useState(START_BALANCE)
  const [joined, setJoined] = useState(null) // null = undecided, true = playing, false = spectating
  const [muted, setMuted] = useState(false)
  const [gain, setGain] = useState(null)
  const [splash, setSplash] = useState(false)
  const [intro, setIntro] = useState('in') // 'in' (showing) | 'out' (fading) | 'done'
  const shownBalance = useCountUp(balance)

  const rafRef = useRef(null)
  const startRef = useRef(0)
  const stoppedRef = useRef(false)
  const joinedRef = useRef(null)
  const chatBoxRef = useRef(null)
  const tickRef = useRef(null)
  const tickNRef = useRef(0)
  const targetRef = useRef(target)
  targetRef.current = target
  const bgRef = useRef(null)
  const successRef = useRef(null)
  const musicOnRef = useRef(false)
  const goldenRef = useRef(Math.random()) // seed for the low-discrepancy sequence
  const prevTargetRef = useRef(10)

  // Creative target generator: golden-ratio low-discrepancy coverage + weighted bands
  // + occasional "signature" numbers + a recency nudge so no two rounds feel alike.
  const nextTarget = () => {
    if (Math.random() < 0.12) {
      const s = SIGNATURE_TARGETS[Math.floor(Math.random() * SIGNATURE_TARGETS.length)]
      if (Math.abs(s - prevTargetRef.current) > 0.8) { prevTargetRef.current = s; return s }
    }
    const u = (goldenRef.current + PHI_INV) % 1 // evenly spread over time, never clustering
    goldenRef.current = u
    let acc = 0, band = TARGET_BANDS[TARGET_BANDS.length - 1]
    for (const b of TARGET_BANDS) { acc += b[2]; if (u <= acc) { band = b; break } }
    let t = band[0] + Math.random() * (band[1] - band[0])
    if (Math.abs(t - prevTargetRef.current) < 0.7) t += t >= prevTargetRef.current ? 0.8 : -0.8
    t = Number(Math.min(29.99, Math.max(2.5, t)).toFixed(2))
    prevTargetRef.current = t
    return t
  }

  /* ---- 3s marketing intro, then fade into the game (tap/space to skip) ---- */
  useEffect(() => {
    const t = setTimeout(() => setIntro((s) => (s === 'in' ? 'out' : s)), 3000)
    return () => clearTimeout(t)
  }, [])
  useEffect(() => {
    if (intro !== 'out') return
    const t = setTimeout(() => setIntro('done'), 650) // matches the fade-out
    return () => clearTimeout(t)
  }, [intro])
  const skipIntro = () => setIntro((s) => (s === 'in' ? 'out' : s))

  /* ---- background game-loop music + win sting (real audio files) ---- */
  useEffect(() => {
    const bg = new Audio(bgLoopUrl)
    bg.loop = true
    bg.volume = MUSIC_VOL
    bg.preload = 'auto'
    bgRef.current = bg
    const su = new Audio(successUrl)
    su.volume = 0.7
    su.preload = 'auto'
    successRef.current = su
    return () => { bg.pause(); su.pause() }
  }, [])

  // music plays ONLY while the timer runs: start with the timer, stop when the round ends
  const startMusic = () => {
    musicOnRef.current = true
    const bg = bgRef.current
    if (bg && !mutedRef.current) { bg.currentTime = 0; bg.play().catch(() => {}) }
  }
  const stopMusic = () => {
    musicOnRef.current = false
    if (bgRef.current) bgRef.current.pause()
  }

  // mute toggle: silence everything; resume only if a round is still mid-run
  useEffect(() => {
    mutedRef.current = muted
    const bg = bgRef.current
    if (!bg) return
    if (muted) bg.pause()
    else if (musicOnRef.current) bg.play().catch(() => {})
  }, [muted])

  /* ---- stopwatch ticking while the timer runs ---- */
  const startTicking = () => {
    clearInterval(tickRef.current)
    tickNRef.current = 0
    tickRef.current = setInterval(() => {
      const e = (performance.now() - startRef.current) / 1000
      const tense = Math.abs(e - targetRef.current) < 0.5 // tighten near the target
      tickSound(tense, tickNRef.current % 2 === 0)
      tickNRef.current++
    }, 100)
  }
  const stopTicking = () => { clearInterval(tickRef.current); tickRef.current = null }

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
      setActivity((a) => [...a, { id: Math.random(), type: roll < 0.5 ? 'win' : 'event', text }].slice(-16))
    }, 2600)
    return () => clearInterval(t)
  }, [])
  useEffect(() => {
    const t = setInterval(() => {
      setActivity((a) => [...a, { id: Math.random(), type: 'chat', name: pick(BOT_NAMES), text: pick(CHAT_LINES) }].slice(-16))
    }, 2200)
    return () => clearInterval(t)
  }, [])
  useEffect(() => {
    if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
  }, [activity])

  /* ---- lobby countdown — auto-skip (never auto-charge) if undecided ---- */
  useEffect(() => {
    if (phase !== 'lobby') return
    if (lobbyLeft <= 0) { if (joinedRef.current === null) decide(false); return }
    const t = setTimeout(() => setLobbyLeft((n) => n - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, lobbyLeft])

  /* ---- 3·2·1 countdown ---- */
  useEffect(() => {
    if (phase !== 'countdown') return
    if (countNum <= 0) { countBeep(true); beginRound(); return }
    countBeep(false)
    const t = setTimeout(() => setCountNum((n) => n - 1), 750)
    return () => clearTimeout(t)
  }, [phase, countNum])

  /* ---- accept / reject this round ---- */
  const decide = (join) => {
    audio() // unlock/resume audio within the user gesture (covers spectators too)
    if (join) {
      if (balance < ENTRY_FEE) return
      setBalance((b) => b - ENTRY_FEE)
      setJoined(true); joinedRef.current = true
      clickSound()
    } else {
      setJoined(false); joinedRef.current = false
    }
    setCountNum(3)
    setPhase('countdown')
  }
  const addFunds = () => { setBalance((b) => b + TOPUP); clickSound() }

  /* ---- running: rAF timer ---- */
  const beginRound = () => {
    setElapsed(0)
    setYourTime(null)
    stoppedRef.current = false
    setPhase('running')
    startRef.current = performance.now()
    startTicking()
    startMusic() // music kicks in exactly when the live timer starts (guarded to run once)
    const playing = joinedRef.current === true
    const limit = playing ? target + 2.5 : target + 1.1 // spectators resolve sooner
    const loop = (now) => {
      const e = (now - startRef.current) / 1000
      setElapsed(e)
      if (e > limit && !stoppedRef.current) { resolveRound(null); return }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
  }

  const handleStop = useCallback(() => {
    if (phase !== 'running' || stoppedRef.current || joinedRef.current !== true) return
    stoppedRef.current = true
    const t = (performance.now() - startRef.current) / 1000
    cancelAnimationFrame(rafRef.current)
    stopSound()
    setYourTime(t)
    resolveRound(t)
  }, [phase, target, tablePlayers])

  const resolveRound = (myTime) => {
    cancelAnimationFrame(rafRef.current)
    stopTicking()
    stopMusic() // sound stops the instant the timer stops / round ends
    const n = Math.max(1, tablePlayers - 1)
    const names = [...BOT_NAMES].sort(() => Math.random() - 0.5).slice(0, n)
    const bots = names.map((name) => {
      // each opponent has its own skill: most sharp, some loose — lifelike, dramatic finishes
      const t = Math.max(0.05, target + noise(0.18 + Math.random() * 0.4))
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
        // payout + celebration
        setBalance((b) => b + prizePool)
        setGain(prizePool)
        setSplash(true)
        winSound()
        // play the "chasing success" sting (the loop is already stopped at resolve)
        if (!mutedRef.current && successRef.current) {
          successRef.current.currentTime = 0
          successRef.current.play().catch(() => {})
        }
        setActivity((a) => [...a, { id: Math.random(), type: 'win', text: `You ${pick(WIN_VERBS)} ${yen(prizePool)} 🏆` }].slice(-16))
        setTimeout(() => setSplash(false), 1400)
        setTimeout(() => setGain(null), 1900)
      }
    }
    setTimeout(() => setShowWinner(true), 2000) // let the player read their result first
  }

  const nextRound = () => {
    setShowWinner(false)
    setRound((r) => r + 1)
    setTarget(nextTarget())
    setTablePlayers(Math.floor(rand(8, 15)))
    setResults([])
    setWinner(null)
    setJoined(null); joinedRef.current = null
    setLobbyLeft(6)
    setPhase('lobby')
  }

  useEffect(() => () => { cancelAnimationFrame(rafRef.current); clearInterval(tickRef.current) }, [])

  /* ---- spacebar = stop (desktop demo nicety) ---- */
  useEffect(() => {
    const onKey = (e) => { if (e.code === 'Space') { e.preventDefault(); if (intro !== 'done') skipIntro(); else handleStop() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleStop, intro])

  const yourDiff = yourTime != null ? Math.abs(yourTime - target) : null

  /* ================================================================ */
  return (
    <LangCtx.Provider value={{ t, lang }}>
    <div className="relative h-[100svh] w-full overflow-hidden bg-[#05060a]">
      {/* full-bleed ambient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-1/4 left-[15%] h-[45rem] w-[45rem] rounded-full bg-cyan-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[10%] h-[45rem] w-[45rem] rounded-full bg-fuchsia-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex h-full w-full items-center justify-center lg:px-8">
        <div className="grain relative flex h-full w-full max-w-[430px] shrink-0 flex-col overflow-hidden bg-[#0a0b14] [container-type:size] sm:h-[min(100svh-3rem,880px)] sm:rounded-[42px] sm:border sm:border-white/10 sm:shadow-[0_0_80px_-10px_rgba(34,211,238,0.25)] lg:max-w-[1000px]">
          {/* atmosphere */}
          <div className="bg-grid pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="pointer-events-none absolute top-40 -right-28 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col gap-[1.5vh] px-4 pt-[2vh] pb-[1.5vh] lg:gap-4 lg:px-6 lg:pt-5 lg:pb-5">
            <Header
              balance={shownBalance} muted={muted}
              onMute={() => setMuted((m) => !m)} onBoard={() => setShowBoard(true)}
              onSettings={() => setShowSettings(true)}
            />

            {/* mobile: stacked (jackpot · stage · feed). lg: live side-column + wide stage */}
            <div className="stage-grid grid min-h-0 flex-1 grid-rows-[auto_1fr_auto] gap-[1.5vh]">
              <div className="area-jackpot">
                <Jackpot value={jackpot} players={tablePlayers} round={round} />
              </div>

              <div className="area-stage flex min-h-0 min-w-0 flex-col lg:rounded-2xl lg:bg-white/[0.02] lg:px-4 lg:py-3 lg:ring-1 lg:ring-white/10">
                <Stage
                  phase={phase} target={target} elapsed={elapsed}
                  countNum={countNum} lobbyLeft={lobbyLeft}
                  yourTime={yourTime} yourDiff={yourDiff} joined={joined}
                  balance={balance} onStop={handleStop}
                  onJoin={() => decide(true)} onSkip={() => decide(false)} onAddFunds={addFunds}
                />
              </div>

              <div className="area-activity flex min-h-0 min-w-0 flex-col">
                <Activity items={activity} boxRef={chatBoxRef} />
              </div>
            </div>
          </div>

          {/* floating +¥gain rising toward the wallet */}
          {gain != null && (
            <div className="pointer-events-none absolute right-4 top-[7vh] z-40 animate-gain-rise font-display text-lg font-bold text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]">
              +{yen(gain)}
            </div>
          )}
          {splash && <Confetti />}

          {showWinner && winner && (
            <WinnerOverlay winner={winner} results={results} yourTime={yourTime} target={target} onNext={nextRound} canPlay={balance >= ENTRY_FEE} onAddFunds={addFunds} />
          )}
          {showBoard && (
            <Leaderboard tab={boardTab} setTab={setBoardTab} you={yourStats} onClose={() => setShowBoard(false)} />
          )}
          {showSettings && (
            <Settings
              lang={lang} setLang={setLang} muted={muted} onMute={() => setMuted((m) => !m)}
              stats={yourStats} balance={balance} onClose={() => setShowSettings(false)}
            />
          )}
        </div>
      </div>

      {intro !== 'done' && <Intro leaving={intro === 'out'} onSkip={skipIntro} />}
    </div>
    </LangCtx.Provider>
  )
}

/* full-screen 3-second intro splash (responsive on all sizes); tap/space to skip */
function Intro({ leaving, onSkip }) {
  const { t } = useT()
  const [hintBefore, hintAfter] = t('introHint').split('{key}')
  return (
    <div
      onClick={onSkip}
      className={`absolute inset-0 z-50 flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#05060a] px-8 text-center ${leaving ? 'animate-intro-out' : ''}`}
    >
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute -top-1/4 left-1/4 h-[40rem] w-[40rem] rounded-full bg-cyan-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[40rem] w-[40rem] rounded-full bg-fuchsia-600/10 blur-[120px]" />

      <div className="relative flex flex-col items-center">
        <img src="/favicon.svg" alt="" className="intro-1 h-20 w-20 drop-shadow-[0_0_30px_rgba(34,211,238,0.35)] sm:h-24 sm:w-24" />
        <img src="/logo.svg" alt="TOKIQ" className="intro-2 mt-6 h-9 w-auto sm:h-12" />
        <div className="intro-3 mt-3 text-[clamp(0.9rem,3.6vw,1.3rem)] font-medium tracking-wide text-white/55">
          {t('tagline')}
        </div>
        <p className="intro-4 mt-5 max-w-md text-[clamp(0.82rem,3vw,1.05rem)] leading-relaxed text-white/45">
          {t('introDesc')}
        </p>
        <div className="intro-5 mt-7 text-xs text-white/30">
          {hintBefore}<kbd className="rounded bg-white/10 px-1.5 py-0.5 text-white/55">Space</kbd>{hintAfter}
        </div>
      </div>

      {/* 3s progress bar */}
      <div className="absolute bottom-[8%] h-[3px] w-44 overflow-hidden rounded-full bg-white/10">
        <div className="intro-bar h-full rounded-full bg-cyan-400" />
      </div>
    </div>
  )
}

/* ============================== pieces ============================= */

function Header({ balance, muted, onMute, onBoard, onSettings }) {
  const { t } = useT()
  const iconCls = 'grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/5 text-sm text-white/80 ring-1 ring-white/10 transition active:scale-95'
  return (
    <div className="flex shrink-0 items-center justify-between gap-2">
      <div className="min-w-0 leading-none">
        <img src="/logo.svg" alt="TOKIQ" className="h-[26px] w-auto" />
        <div className="mt-1.5 truncate text-[10px] font-medium tracking-wide text-white/40">{t('tagline')}</div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1.5 ring-1 ring-white/10">
          <span className="text-xs">💰</span>
          <span className="tnum text-sm font-bold text-white">{yen(balance)}</span>
        </div>
        <button onClick={onMute} aria-label="Toggle sound" className={iconCls}>{muted ? '🔇' : '🔊'}</button>
        <button onClick={onSettings} aria-label="Open settings" className={iconCls}>⚙️</button>
        <button onClick={onBoard} aria-label="Open leaderboards" className={iconCls}>🏆</button>
      </div>
    </div>
  )
}

function Jackpot({ value, players, round }) {
  const { t } = useT()
  return (
    <div className="shrink-0 rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/10 backdrop-blur">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="text-[10px] uppercase tracking-widest text-white/40">{t('megaJackpot')}</span>
          <div className="tnum jackpot-text text-[clamp(1.4rem,7vw,1.9rem)] font-black tracking-tight">{yen(value)}</div>
        </div>
        <div className="shrink-0 text-right text-[10px] leading-tight">
          <div className="font-semibold text-white/55">{t('round', { n: round })}</div>
          <div className="mt-1 flex items-center justify-end gap-1 font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> {t('atTable', { n: players })}
          </div>
        </div>
      </div>
    </div>
  )
}

function Stage({ phase, target, elapsed, countNum, lobbyLeft, yourTime, yourDiff, joined, balance, onStop, onJoin, onSkip, onAddFunds }) {
  const { t } = useT()
  return (
    <div className="flex h-full flex-col items-center justify-between">
      <div className="shrink-0 text-center">
        <div className="text-[11px] uppercase tracking-[0.3em] text-cyan-300/70">{t('target')}</div>
        <div className="tnum text-[clamp(1.6rem,6cqh,2.6rem)] font-black leading-none text-white">
          {target.toFixed(2)}<span className="text-[0.5em] text-white/40">s</span>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 place-items-center">
        {phase === 'lobby' && (
          <div className="text-center animate-float-up">
            <div className="tnum text-[clamp(2.5rem,15cqh,4.5rem)] font-black leading-none text-white/90">{Math.max(lobbyLeft, 0)}</div>
            <div className="mt-1 text-xs font-medium text-white/40">{t('joinOrSkip')}</div>
          </div>
        )}
        {phase === 'countdown' && (
          <div key={countNum} className="animate-float-up tnum text-[clamp(3rem,18cqh,5.5rem)] font-black leading-none text-cyan-300 drop-shadow-[0_0_25px_rgba(34,211,238,0.6)]">
            {countNum > 0 ? countNum : 'GO'}
          </div>
        )}
        {phase === 'running' && (
          <div className="tnum text-[clamp(2.5rem,14cqh,4.5rem)] font-black leading-none text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]">
            {elapsed.toFixed(2)}
          </div>
        )}
        {phase === 'result' && (
          <div className="text-center animate-float-up">
            <div className="tnum text-[clamp(2.25rem,12cqh,3.75rem)] font-black leading-none text-white">{yourTime != null ? yourTime.toFixed(2) : '·'}</div>
            <div className={`mt-1 text-sm font-semibold ${yourDiff != null && yourDiff < 0.1 ? 'text-emerald-300' : 'text-amber-300'}`}>
              {yourTime == null ? (joined === false ? t('satOut') : t('missed')) : t('offBy', { d: yourDiff.toFixed(2) })}
            </div>
          </div>
        )}
      </div>

      {phase === 'lobby'
        ? <JoinControls balance={balance} onJoin={onJoin} onSkip={onSkip} onAddFunds={onAddFunds} />
        : <StopButton phase={phase} joined={joined} onStop={onStop} />}
    </div>
  )
}

function JoinControls({ balance, onJoin, onSkip, onAddFunds }) {
  const { t } = useT()
  const canPlay = balance >= ENTRY_FEE
  return (
    <div className="flex w-full max-w-[300px] shrink-0 flex-col items-center gap-2.5">
      {canPlay ? (
        <button onClick={onJoin}
          className="w-full rounded-2xl bg-cyan-400 py-4 font-display text-lg font-bold tracking-wide text-[#04181c] shadow-[0_0_30px_-6px_rgba(34,211,238,0.6)] transition active:scale-[0.98]">
          {t('joinRound', { fee: yen(ENTRY_FEE) })}
        </button>
      ) : (
        <button onClick={onAddFunds}
          className="w-full rounded-2xl bg-amber-400 py-4 font-display text-base font-bold tracking-wide text-black transition active:scale-[0.98]">
          {t('addFunds', { amt: yen(TOPUP) })}
        </button>
      )}
      <button onClick={onSkip} className="text-sm font-medium text-white/40 transition hover:text-white/70">
        {t('skipWatch')}
      </button>
    </div>
  )
}

function StopButton({ phase, joined, onStop }) {
  const { t } = useT()
  const live = phase === 'running' && joined === true
  const spectating = phase === 'running' && joined === false
  const label = live ? t('stop') : spectating ? t('watching') : phase === 'countdown' ? '…' : t('roundOver')
  // long labels (WATCHING / ROUND OVER) get a smaller, tighter type so they don't strain the circle
  const labelCls = label.length > 4
    ? 'text-[clamp(0.62rem,3.4cqw,0.95rem)] tracking-[0.12em]'
    : 'text-[clamp(1rem,5.5cqw,1.6rem)] tracking-widest'
  const ticks = [
    '-top-[12px] left-1/2 -translate-x-1/2 h-2.5 w-px',
    '-bottom-[12px] left-1/2 -translate-x-1/2 h-2.5 w-px',
    '-left-[12px] top-1/2 -translate-y-1/2 w-2.5 h-px',
    '-right-[12px] top-1/2 -translate-y-1/2 w-2.5 h-px',
  ]
  return (
    <div className="relative mb-3 grid shrink-0 place-items-center" style={{ width: 'min(42cqw, 19cqh, 9.5rem)', height: 'min(42cqw, 19cqh, 9.5rem)' }}>
      <span className={`animate-spin-slow pointer-events-none absolute inset-[-8px] rounded-full border border-dashed ${live ? 'border-cyan-400/40' : 'border-white/10'}`} />
      <span className={`animate-spin-rev pointer-events-none absolute inset-[-16px] rounded-full border ${live ? 'border-cyan-400/15' : 'border-white/[0.06]'}`} />
      {ticks.map((c) => (
        <span key={c} className={`pointer-events-none absolute ${c} ${live ? 'bg-cyan-400/70' : 'bg-white/20'}`} />
      ))}
      <button
        onClick={onStop}
        disabled={!live}
        className={[
          `relative grid h-full w-full place-items-center rounded-full px-2 text-center font-display font-bold leading-none transition-transform select-none ${labelCls}`,
          live ? 'bg-cyan-400 text-[#04181c] animate-glow active:scale-95' : 'bg-white/5 text-white/40 ring-1 ring-white/10',
        ].join(' ')}
      >
        <span className="absolute inset-2 rounded-full ring-1 ring-white/20" />
        <span className="absolute inset-[20%] rounded-full ring-1 ring-white/10" />
        {label}
      </button>
    </div>
  )
}

// one unified live feed: winner/jackpot events interleaved with chat.
// each row is a fixed 20px; the box shows exactly 3 rows (the rest scroll).
function Activity({ items, boxRef }) {
  const { t } = useT()
  return (
    <div className="flex shrink-0 flex-col rounded-xl bg-white/[0.03] px-2.5 py-1.5 ring-1 ring-white/10 lg:min-h-0 lg:flex-1">
      <div className="hidden items-center gap-1.5 px-0.5 pb-1.5 text-[10px] uppercase tracking-widest text-white/40 lg:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> {t('liveFeed')}
      </div>
      <div ref={boxRef} className="no-scrollbar h-[60px] overflow-y-auto lg:h-auto lg:min-h-0 lg:flex-1">
        {items.slice(-16).map((m) =>
          m.type === 'chat' ? (
            <div key={m.id} className="flex h-5 items-center gap-1.5 overflow-hidden text-[11px] leading-none">
              <span className={`shrink-0 font-semibold ${hashName(m.name)}`}>{m.name}</span>
              <span className="truncate text-white/55">{m.text}</span>
            </div>
          ) : (
            <div key={m.id} className="flex h-5 items-center gap-1.5 text-[11px] leading-none">
              <span className={m.type === 'win' ? 'text-amber-300' : 'text-white/40'}>{m.type === 'win' ? '🏆' : '•'}</span>
              <span className={`truncate ${m.type === 'win' ? 'text-amber-200/90' : 'text-white/60'}`}>{m.text}</span>
            </div>
          )
        )}
      </div>
    </div>
  )
}

function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: 22 }, (_, i) => ({
      tx: (Math.random() * 2 - 1) * 150,
      ty: 80 + Math.random() * 260,
      rot: (Math.random() * 2 - 1) * 540,
      delay: Math.random() * 0.12,
      size: 6 + Math.random() * 7,
      color: CONFETTI[i % CONFETTI.length],
      round: Math.random() > 0.5,
    }))
  )
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="animate-confetti absolute left-1/2 top-[32%]"
          style={{
            width: p.size, height: p.size, background: p.color,
            borderRadius: p.round ? '9999px' : '2px',
            '--tx': `${p.tx}px`, '--ty': `${p.ty}px`, '--rot': `${p.rot}deg`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

function WinnerOverlay({ winner, results, yourTime, target, onNext, canPlay, onAddFunds }) {
  const { t } = useT()
  const youWon = winner.you
  const youIdx = results.findIndex((r) => r.you)
  const youInPodium = youIdx > -1 && youIdx < 3
  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="animate-slide-up relative max-h-[94%] w-full overflow-y-auto rounded-t-[36px] border-t border-white/10 bg-[#11131f] px-5 pb-7 pt-6 text-center no-scrollbar">
        {youWon && (
          <>
            <span className="animate-ring-pop absolute left-1/2 top-7 h-24 w-24 -translate-x-1/2 rounded-full ring-2 ring-amber-300/60" />
            <span className="animate-ring-pop absolute left-1/2 top-7 h-24 w-24 -translate-x-1/2 rounded-full ring-2 ring-cyan-300/60" style={{ animationDelay: '0.15s' }} />
          </>
        )}
        <div className="text-[clamp(2.25rem,11vw,2.75rem)] leading-none">{youWon ? '🏆' : '🎯'}</div>
        <div className="mt-1.5 text-[11px] uppercase tracking-[0.3em] text-cyan-300/70">{youWon ? t('youWon') : t('roundWinner')}</div>
        <div className="font-display mt-0.5 text-[clamp(1.4rem,6.5vw,1.75rem)] font-bold tracking-wide text-white">{youWon ? t('victory') : winner.name}</div>
        <div className="jackpot-text text-[clamp(1.9rem,8.5vw,2.4rem)] font-black">{yen(winner.prize)}</div>

        {/* target chip */}
        <div className="mx-auto mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs ring-1 ring-white/10">
          <span className="text-white/40">{t('target')}</span>
          <span className="tnum font-bold text-white">{target.toFixed(2)}s</span>
        </div>

        {/* top-3 + your-row snapshot */}
        <div className="mt-3 overflow-hidden rounded-2xl bg-white/[0.03] text-left ring-1 ring-white/10">
          <div className="flex items-center justify-between px-3 pt-2 pb-1.5 text-[10px] uppercase tracking-wider text-white/40">
            <span>🎯 {t('roundSnapshot')}</span>
            <span>{t('timeDelta')}</span>
          </div>
          {results.slice(0, 3).map((r, i) => <SnapRow key={r.name + i} r={r} rank={i + 1} />)}
          {!youInPodium && youIdx > -1 && (
            <>
              <div className="px-3 py-0.5 text-center text-white/20">···</div>
              <SnapRow r={results[youIdx]} rank={youIdx + 1} />
            </>
          )}
        </div>

        {!youWon && yourTime != null && (
          <p className="mt-3 text-sm text-white/50">{t('soClose', { d: Math.abs(yourTime - target).toFixed(2) })}</p>
        )}
        {yourTime == null && <p className="mt-3 text-sm text-white/40">{t('watched')}</p>}
        {!canPlay && <p className="mt-2 text-sm text-amber-300/80">{t('balanceLow')}</p>}

        <button onClick={canPlay ? onNext : onAddFunds}
          className="mt-4 w-full rounded-2xl bg-cyan-400 py-4 font-display text-base font-bold tracking-wide text-[#04181c] transition active:scale-[0.98]">
          {canPlay ? t('nextRound', { fee: yen(ENTRY_FEE) }) : t('addFundsBtn', { amt: yen(TOPUP) })}
        </button>
      </div>
    </div>
  )
}

const MEDAL = ['🥇', '🥈', '🥉']
function SnapRow({ r, rank }) {
  const { t } = useT()
  return (
    <div className={`flex items-center gap-2.5 px-3 py-2 ${r.you ? 'bg-cyan-500/10 ring-1 ring-inset ring-cyan-400/30' : rank === 1 ? 'bg-amber-400/[0.07]' : ''}`}>
      <span className="grid w-6 shrink-0 place-items-center text-sm">{MEDAL[rank - 1] || <span className="text-xs font-bold text-white/40">#{rank}</span>}</span>
      <span className={`flex-1 truncate text-sm font-semibold ${r.you ? 'text-cyan-300' : 'text-white/90'}`}>{r.you ? t('you') : r.name}</span>
      <span className="tnum text-sm font-bold text-white">{r.time.toFixed(2)}s</span>
      <span className="tnum w-12 shrink-0 text-right text-xs text-white/45">±{r.diff.toFixed(2)}</span>
    </div>
  )
}

function Leaderboard({ tab, setTab, you, onClose }) {
  const { t } = useT()
  const tabs = ['Daily', 'Weekly', 'Monthly', 'All-Time']
  const cats = [['Most Wins', 'mostWins'], ['Best Accuracy', 'bestAccuracy'], ['Highest Earnings', 'highestEarnings']]
  const [cat, setCat] = useState('Most Wins')
  const rows = [...SEED_LEADERBOARD].sort((a, b) =>
    cat === 'Most Wins' ? b.wins - a.wins : cat === 'Best Accuracy' ? a.acc - b.acc : b.earn - a.earn
  )
  const val = (r) => cat === 'Most Wins' ? t('winsN', { n: r.wins }) : cat === 'Best Accuracy' ? `±${r.acc.toFixed(3)}s` : yen(r.earn)
  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-[#070810]/95 backdrop-blur-md animate-slide-up">
      <div className="flex shrink-0 items-center justify-between px-5 pt-5 pb-3">
        <div className="font-display text-xl font-bold tracking-wide text-white">{t('leaderboards')}</div>
        <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-white/70 ring-1 ring-white/10 active:scale-95" aria-label="Close">✕</button>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2 px-5">
        {tabs.map((tb) => (
          <button key={tb} onClick={() => setTab(tb)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${tab === tb ? 'bg-cyan-400 text-black' : 'bg-white/5 text-white/60'}`}>{t(tb)}</button>
        ))}
      </div>
      <div className="mt-3 flex shrink-0 flex-wrap gap-2 px-5">
        {cats.map(([c, key]) => (
          <button key={c} onClick={() => setCat(c)}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${cat === c ? 'bg-white/15 text-white ring-1 ring-white/20' : 'bg-white/[0.03] text-white/50'}`}>{t(key)}</button>
        ))}
      </div>
      <div className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto px-5 pb-6 no-scrollbar">
        {rows.map((r, i) => (
          <div key={r.name} className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3 ring-1 ring-white/10">
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${i === 0 ? 'bg-amber-400 text-black' : i < 3 ? 'bg-white/15 text-white' : 'bg-white/5 text-white/50'}`}>{i + 1}</span>
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${hashColor(r.name)} text-sm font-bold text-[#04181c]`}>{r.name[0]}</span>
            <span className="flex-1 truncate font-semibold text-white/90">{r.name}</span>
            <span className="tnum shrink-0 text-sm font-bold text-cyan-300">{val(r)}</span>
          </div>
        ))}
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-cyan-500/10 p-3 ring-1 ring-cyan-400/40">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-sm font-bold text-white/70">·</span>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cyan-400 text-sm font-bold text-[#04181c]">Y</span>
          <span className="flex-1 font-semibold text-white">{t('you')}</span>
          <span className="tnum shrink-0 text-sm font-bold text-cyan-300">
            {cat === 'Most Wins' ? t('winsN', { n: you.wins }) : cat === 'Best Accuracy' ? (you.best != null ? `±${you.best.toFixed(3)}s` : '·') : yen(you.wins * 8100)}
          </span>
        </div>
      </div>
    </div>
  )
}

/* settings + profile + language — slides up like the leaderboard */
function Settings({ lang, setLang, muted, onMute, stats, balance, onClose }) {
  const { t } = useT()
  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-[#070810]/95 backdrop-blur-md animate-slide-up">
      <div className="flex shrink-0 items-center justify-between px-5 pt-5 pb-3">
        <div className="font-display text-xl font-bold tracking-wide text-white">{t('settings')}</div>
        <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-white/70 ring-1 ring-white/10 active:scale-95">✕</button>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 pb-8 no-scrollbar">
        {/* profile */}
        <section>
          <div className="mb-2 text-[10px] uppercase tracking-widest text-white/40">{t('profile')}</div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cyan-400 font-display text-lg font-bold text-[#04181c]">Y</span>
            <div className="min-w-0">
              <div className="font-display text-base font-bold tracking-wide text-white">{t('you')}</div>
              <div className="tnum text-sm text-white/50">{t('balance')}: <span className="font-bold text-white">{yen(balance)}</span></div>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <Stat label={t('wins')} value={stats.wins} />
            <Stat label={t('best')} value={stats.best != null ? `±${stats.best.toFixed(3)}s` : '·'} />
            <Stat label={t('streak')} value={stats.streak} />
          </div>
        </section>

        {/* language */}
        <section>
          <div className="mb-2 text-[10px] uppercase tracking-widest text-white/40">{t('language')}</div>
          <div className="grid grid-cols-3 gap-2">
            {LANGS.map((l) => (
              <button key={l.code} onClick={() => setLang(l.code)}
                className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${lang === l.code ? 'bg-cyan-400 text-[#04181c]' : 'bg-white/5 text-white/70 ring-1 ring-white/10'}`}>
                {l.label}
              </button>
            ))}
          </div>
        </section>

        {/* sound */}
        <section>
          <div className="mb-2 text-[10px] uppercase tracking-widest text-white/40">{t('sound')}</div>
          <button onClick={onMute} className="flex w-full items-center justify-between rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10 transition active:scale-[0.99]">
            <span className="flex items-center gap-2 font-semibold text-white/90"><span>{muted ? '🔇' : '🔊'}</span> {t('sound')}</span>
            <span className={`relative h-6 w-11 rounded-full transition ${muted ? 'bg-white/10' : 'bg-cyan-400'}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${muted ? 'left-0.5' : 'left-[1.375rem]'}`} />
            </span>
          </button>
        </section>

        <div className="flex items-center justify-center gap-2 pt-1 text-xs text-white/30">
          <span className="text-emerald-400">✔</span> {t('provablyFair')}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-white/[0.04] px-2 py-2.5 text-center ring-1 ring-white/10">
      <div className="text-[9px] uppercase tracking-wider text-white/40">{label}</div>
      <div className="tnum mt-0.5 text-sm font-bold text-white">{value}</div>
    </div>
  )
}
