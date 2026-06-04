# Tokiq — Product Research & Current State

**Document 1 of 2** · Companion: `02-tokiq-validation-plan.md`
**Prepared by:** Ambrose Alanda — Technical Leadership, AIBOS
**Audience:** Tokiq team (Martin, Joshua, Crispus & technical leadership)
**Date:** 2026-06-04
**Status:** Working draft — basis for team discussion. Not a commitment to build.

> 🎯 **Why this document exists.** Before we talk about screens, code, or servers, the team
> should share one picture of *what Tokiq is*, *how to think about a product like this*,
> *what we have already built*, and *what we still need to find out*. This is the **"where we
> are and how to think"** document. The **"what we do next"** document is Document 2 (the
> Validation Plan).

---

## 1. Tokiq in one paragraph

Tokiq is a real-time, multiplayer, **skill-based** timing game. A target time is shown (e.g.
`10.00s`); a clock counts up; every player taps **STOP** when they think it has hit the target;
**the player closest to the target wins the round's prize pool.** Players pay a small entry
fee, and the platform keeps a house fee. It is in the same family as "crash" games like
Aviator, but the hook is *precision and nerve* — *"I was so close"* — rather than a rising
multiplier. **Today we have a convincing front-end prototype only:** no real multiplayer, no
payments, no anti-cheat yet. This document is honest about that and frames the work correctly:
**the hard part is not building the timer — it is proving that players will return, trust it,
spend, and invite friends.**

---

## 2. How to think about a product like Tokiq

> This section is the **mindset** behind everything else. It is a short, plain-English lesson
> drawn from how successful startups are actually built — and it lines up almost perfectly
> with the way Mr. Watanabe has been pushing us to think: **customer → value → revenue →
> sustainability**, not *feature → feature → feature*.

### 2.1 The one big idea (everything comes back to this)

> ### 💡 Don't fall in love with the **solution** (the timer). Fall in love with the **problem**.

Most engineering teams instinctively move like this:

```
   Idea  →  Build  →  Launch
```

But that is the order in which most products **fail**. The proven order puts the product
*late*, only after we understand people:

```
 Customer → Problem → Value → Market → Business model → Product → Build → Growth → Scale
   └────────── understand people first ──────────┘     └──── build only after ────┘
```

So the questions that matter *first* are not technical at all:

```
   Why would someone PAY to play?
            ↓
   Why would they come back TOMORROW?
            ↓
   Why would they INVITE a friend?
            ↓
   Why would an INVESTOR care?
```

**Tokiq is not selling a timer. It is selling an emotion** — anticipation, tension, hope, the
near-miss, the winning moment, social recognition. *The plane is not the product in Aviator;
the feeling is. The same is true for our STOP button.*

### 2.2 The order we should learn things (the 5 phases)

A simple ladder for the team — climb it in order:

| Phase | Focus | The question it answers |
|:---:|---|---|
| **1. Product thinking** | customer · value · revenue · cost · growth · investors · sustainability · systems thinking | *Why should this exist as a business?* |
| **2. Market research** | who plays Aviator / Crash / Mines / Plinko, why, how much they spend, what they love & hate | *Is there a real, paying audience?* |
| **3. Psychology** ⭐ *(most important for Tokiq)* | anticipation, tension, hope, near-misses, social proof, winning moments | *What feeling are we really selling?* |
| **4. Game economy** | entry fees → prize pool → winner + platform share → operations → growth | *Can the money loop sustain itself?* |
| **5. Investor lens** | problem, solution, why it works, risks (cheating, latency, repetitive, too easy), opportunities (leaderboards, tournaments, teams, jackpots, livestreams) | *Would a serious outsider back this?* |

### 2.3 The 7-step path to Product-Market Fit (PMF), in plain words

**Product-Market Fit** simply means: *enough people want this so badly they keep coming back
and tell their friends.* Here is the widely-used 7-step path, translated into everyday
language — and what each step means specifically for **Tokiq**:

| # | Step | The simple lesson | What it means for Tokiq |
|:---:|---|---|---|
| **1** | **Understand PMF** | A product doesn't create a market; a **market pulls a product.** A good product in a bad market loses. The best sign of fit isn't revenue — it's **organic word-of-mouth.** | Don't ask *"is the timer fun?"* Ask *"is it compelling enough that people keep returning?"* |
| **2** | **Measure PMF** | The real test is **retention**, not downloads. The **Sean Ellis test**: if **40%+** of users say they'd be *"very disappointed"* to lose it, you likely have fit. | A million installs with no returners = failure. **100 players who play daily = alive.** |
| **3** | **Customer development** ⭐ | **Talk before you build.** Use **Jobs-To-Be-Done**: people don't buy products, they *"hire"* them for an outcome. Interview power users, casual users — and **churned users** (they teach the most). | Players aren't hiring Tokiq for *"timing accuracy."* They hire it for **excitement, status, hope, competition, stress relief.** |
| **4** | **Iteration** | **Never build before validating.** Run the **cheapest experiment first** (mockups, landing pages). `Build → Measure → Learn → Repeat`. Track **outcomes, not outputs** (retention, not lines of code). | v1 timer → feedback → add rankings → add tournaments → keep learning. |
| **5** | **Retention & engagement** | Find the **"Aha moment."** Use the **Hook Model:** `Trigger → Action → Variable Reward → Investment`. **Unpredictable** rewards build stronger habits than **big** ones. | Aha = first near-perfect stop / first win / first leaderboard spot. Variable reward = the near-miss *"I was so close."* |
| **6** | **Growth channels** | Don't chase 10 channels — **find one that works first.** For games the best channel is often **not paid ads** but referrals, community, streamers, viral clips. Design the product to **spread itself.** | **Seeing others win is a built-in growth engine** (social proof). |
| **7** | **Scaling** | **Don't scale before fit** — that's *"pouring gasoline on a fire that hasn't started."* Right order: **Retention → Acquisition → Team → Markets.** | Build the game *big* **only after** proving players come back and bring friends. |

Compressed into one mental picture:

```
   Customer Problem → Understand the Player → Create Value → Retention → PMF → Growth → Scale
   ▲ most teams start at the bottom (Scale).  The right way starts at the top (the Customer).
```

### 2.4 The "research board" — questions to keep on the wall

The fastest way to keep the team focused is to pin up the questions we are actually trying to
answer. Start with these **5 core questions:**

1. **Why do people *actually* play?** (not what they *say* — what they *do*)
2. **Why do they return?**
3. **What creates social engagement?**
4. **What creates trust?** *(Aviator's real secret was being "provably fair.")*
5. **How does the system sustain itself economically?**

…and the fuller **10-question version** for deeper sessions:

> why play · why return · why invite friends · why spend money · why choose **Tokiq over
> Aviator** · what emotion are we selling · what builds trust · what makes **winning
> memorable** · what makes **losing tolerable** · what drives long-term retention.

### 2.5 Where these ideas come from (and one honesty note)

This thinking is not invented in-house — it is the mainstream of how modern products are
built, drawn from three places:

- **Startup thinkers & frameworks** — Steve Blank (customer discovery), *The Lean Startup*,
  *Y Combinator / Startup School*, *Strategyzer*.
- **A 7-module Product-Market Fit learning path** (from "The Startup Project") — the source of
  the 7 steps in §2.3.
- **Constant re-application to Tokiq** — every concept above is bent back toward *our* game.

> ⚠️ **Honesty note for the team.** When this material was first gathered (via ChatGPT), the
> earliest module summaries were **educated guesses from the module titles**, not the real
> page content — the tool openly admitted this. Only the **final pass** was based on actually
> reading the source pages. *Takeaway:* the framework is sound and standard, but if we ever
> quote specific figures or claims externally, **we verify them against the primary source
> first.** (The same caution applies to the market numbers in §4.)

---

## 3. What we have built so far (current state of the prototype)

The prototype is a **front-end-only MVP** built to *look and feel* like a live multiplayer
product, for demos and concept validation. It is **not** the real game — and that is by design.

> Tech, kept simple: a modern web app (React + Vite + Tailwind) that runs in any browser, with
> no server behind it. The whole game flows through four screens: **lobby → countdown →
> running → result.**

### 3.1 What is genuinely real vs. theatre

| ✅ Real (actual working code) | 🎭 Simulated / faked client-side |
|---|---|
| The timer and your STOP tap | Other players' stop times (clustered near the target) |
| Your accuracy & winner calculation (closest wins) | Live chat messages |
| Round prize math & your wallet | Winners / activity feed |
| Your stats, streak, best accuracy | Mega Jackpot growth |
| | Leaderboard standings |

> The **only genuinely interactive part is the timer and your tap.** That is intentional — it
> is exactly the hook we need to prove the *"I was so close"* feeling. Everything else is
> theatre to make the screen feel alive in a demo.

Other deliberate demo choices:
- The table is kept small (**8–14 players**) so a human can realistically win during a demo. A
  real game with hundreds of players would make winning statistically near-impossible.
- Opponent times use **bell-curve noise near the target**, so they read as *skill*, not chaos.
- Polished feel: stopwatch ticks that tighten near the target, music only while the clock runs,
  confetti + win sound, a 3-second intro, installable as an app (PWA), fully responsive, and
  **three languages — English / Español / 日本語** (Japanese reflects a likely target market).

### 3.2 The current (prototype) money model — *illustrative only*

```
Entry fee:        ¥100
House rate:       10%
Prize pool      = players × entry fee × (1 − house rate)
Example (10 players): 10 × ¥100 × 0.9  →  ¥900 to the winner, ¥100 to the platform
```

This is the standard "pool-and-rake" structure. **It is a placeholder, not validated** — we
have not yet tested what fee, pool size, or house cut players will actually accept.

### 3.3 What is intentionally NOT built yet (the real hard parts)

These are out of scope for the prototype **on purpose** — and they are the genuine challenges:

1. **Real multiplayer** — networking, matchmaking, starting every player's round at the same
   instant.
2. **Anti-cheat / fairness** — today the stop time is measured **on the player's device**. A
   real build needs **server-controlled timing** and latency handling. *This is the core
   engineering challenge.*
3. **Payments & regulation** — pay-to-enter + prize pool + house fee needs **legal review per
   country, especially Japan.** The "skill-based" framing helps the gambling question but does
   **not** automatically make it exempt.
4. **A real path from round wins to the Mega Jackpot** (today it's an aspirational number).

> 🔑 **Why this matters for our plan:** because opponents are simulated, the prototype can
> validate the **feel of the loop** and the **near-miss hook** — but it **cannot yet** prove
> true multiplayer retention or real-money willingness-to-pay. Document 2 is built around that
> exact limitation.

---

## 4. Market & competitive context

> ⚠️ **Source note.** The figures below come from earlier desk research (the Aviator / Spribe
> analysis). They are **directional and must be independently re-verified** before any
> external or investor-facing use. Treat them as *"what we believe today."*

### 4.1 The benchmark: Spribe & Aviator

- **Company:** Spribe, founded **2018** by **David Natroshvili** (former First Deputy Minister
  of Economy, Georgia). Based in **Tbilisi**, with offices in Warsaw and Kyiv.
- **Scale:** Aviator reportedly **60M+ monthly players**, ~**92%** of the crash-game category.
- **Model:** a **B2B supplier** — it does *not* run casinos. It **licenses** Aviator to
  thousands of operator platforms (reported ~4,500–6,000+).
- **Tech:** **97% RTP** (return to player); lightweight, **mobile-first**; handles **2,000+
  bets/second**.
- **Trust (the key feature):** **"provably fair"** — a cryptographic system (SHA-256) plus
  player-contributed data, so neither the operator nor the developer can rig a round, and
  players can verify results afterward.
- **Mainstream legitimacy:** partnerships with **UFC** and **AC Milan** to move the brand from
  "dark-corner gambling" into social entertainment.

### 4.2 Why this category matters

- **Africa:** reported **~53% growth** recently — a youthful, mobile-first audience that
  prefers fast, social sessions over traditional slots.
- **Operator economics:** reported **10%+ uplift in gaming revenue** from high turnover.
- **Low barrier to entry:** the value is in the **math + social design**, not heavy 3D — lower
  build cost, potentially higher return.
- **Market size:** part of a **$100B+** iGaming ecosystem.

### 4.3 Comparables to study

**Aviator · Crash · Mines · Plinko · Lucky Jet · JetX · Spaceman.**
For each, learn: *who plays, why, how old, how much they spend, what they love, what they hate.*

### 4.4 How Tokiq is similar / different

| | **Aviator (crash)** | **Tokiq (timing)** |
|---|---|---|
| Core action | Cash out before the plane crashes | Tap STOP closest to a target time |
| Tension source | Rising multiplier · greed vs. fear | Precision under pressure · the near-miss |
| Outcome feel | Luck-led (with cash-out skill) | **Skill-forward** (closest wins the pool) |
| Trust mechanism | Provably fair (SHA-256) | Must be **designed in** (provably fair) |
| Social layer | Live bets + chat | Live feed + chat + leaderboards (planned) |

> ❓ **The open strategic question:** *Why would a player choose Tokiq over Aviator?* We don't
> have a validated answer yet. The likely candidates — a stronger **sense of skill** (*"I can
> get better"*) and a **cleaner, more social, less casino-coded** feel — are **hypotheses,
> not facts.** Document 2 is designed to test them.

---

## 5. Player psychology — what really drives play

People return to games like this not because rewards are *large*, but because they are
*unpredictable*. The forces we believe are at work:

- **Anticipation & tension** — the countdown toward the target.
- **The near-miss** — *"off by 0.03s"* motivates more than a clean loss: it whispers *"next
  time."*
- **Variable reward** — uncertain outcomes form stronger habits than fixed ones.
- **Social proof** — seeing others win makes people want to play (and share).
- **Hope & status** — leaderboards, streaks, recognition.
- **Skill perception** — believing you can improve drives repeat play (and supports the
  skill-based framing).

All of this maps onto the **Hook Model**: `Trigger → Action → Variable Reward → Investment`.

---

## 6. The business as a living system

A game is not just gameplay — it is an **economic system** that must feed itself:

```
   Entry fees → Prize pool → Winner payout
                    ↓
             Platform share (rake)
                    ↓
      Operations · Marketing · Growth
                    ↓
               More players  ───────┐
                    ↑                │
                    └────────────────┘   (a healthy loop reinvests the value it creates)
```

Eventually we must answer three questions: **Can it scale? Can it be profitable? Can it
sustain the cost of getting new players?** We are **not** answering these yet — they come
*after* we prove players want it and come back.

---

## 7. Key risks & open questions

| Area | Risk / open question |
|---|---|
| **Engagement** | Is the loop too easy, too repetitive, or not exciting over time? |
| **Retention** | Will a player who lost yesterday come back today? *(the make-or-break question)* |
| **Differentiation** | Why Tokiq over Aviator and the other crash games? |
| **Fairness / cheating** | Device-side timing is exploitable; needs server-controlled timing + latency handling. |
| **Trust** | Can we deliver a credible **provably-fair** promise players believe? |
| **Willingness to pay** | What fee / pool / house cut will players actually accept? |
| **Regulation** | Pay-to-enter + prize pool = legal review per market, **especially Japan**. Skill framing helps but isn't an automatic exemption. |
| **Economics** | Does the house cut sustain operations + player acquisition at real scale? |

---

## 8. The single most important lesson (our north star)

> ### 🧭 Don't fall in love with the solution (the timer). Fall in love with the problem:
> *how do we create an experience people repeatedly enjoy, trust, share, and will pay for?*

If we answer that convincingly, we are no longer designing a game — **we are designing a
business.** That is exactly the shift Mr. Watanabe keeps emphasizing: think like a founder
building a sustainable system of value (for customers, the company, employees, and investors),
not like a developer shipping features.

**What we do to find those answers is Document 2 — the Validation Plan.**

---

### Appendix — prototype facts at a glance
- Repo `slide-desk/tokiq` · single-file game in `src/App.jsx` · stack: React 18 / Vite 6 / Tailwind v4.
- Screens: `lobby → countdown → running → result` · languages: EN / ES / JA · installable (PWA).
- Demo numbers: entry **¥100**, house **10%**, start balance **¥5,000**, top-up **¥5,000**, table **8–14 players**.
- Backend: **none.** Multiplayer, payments, anti-cheat: **not implemented yet.**
