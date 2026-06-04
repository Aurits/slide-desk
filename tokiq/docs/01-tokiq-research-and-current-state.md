# Tokiq — Product Research & Current State

**Document 1 of 2** · Companion: `02-tokiq-validation-plan.md`
**Date:** 2026-06-04
**Status:** Working draft. A basis for team discussion, not a commitment to build.

> **Why this document exists.** Before we talk about screens, code, or servers, the team
> should share one picture: what Tokiq is, how to think about a product like this, what we
> have already built, and what we still need to find out. This is the *"where we are and how
> to think"* document. The *"what we do next"* document is Document 2 (the Validation Plan).

---

## 1. Tokiq in one paragraph

Tokiq is a real-time, multiplayer, **skill-based** timing game. A target time is shown (for
example `10.00s`), a clock counts up, and every player taps **STOP** when they think it has
reached the target. **The player closest to the target wins the round's prize pool.** Players
pay a small entry fee, and the platform keeps a house fee. It sits in the same family as
"crash" games like Aviator, but the hook is precision and nerve (*"I was so close"*) rather
than a rising multiplier. **Today we have a convincing front-end prototype only:** no real
multiplayer, no payments, and no anti-cheat yet. This document is honest about that, and it
frames the work correctly. The hard part is not building the timer. The hard part is proving
that players will return, trust it, spend, and invite friends.

---

## 2. How to think about a product like Tokiq

> This section is the **mindset** behind everything else. It is a short, plain-English lesson
> drawn from how successful startups are actually built, and it lines up almost perfectly with
> the way Mr. Watanabe has been pushing us to think (customer, then value, then revenue, then
> sustainability) rather than feature after feature.

### 2.1 The one big idea (everything comes back to this)

> ### 💡 Don't fall in love with the **solution** (the timer). Fall in love with the **problem**.

Most teams are tempted to move in a straight line, and that is exactly the line where most
products fail. The proven path puts the product *late*, only after we understand people:

```
   ✗ The tempting path
        Idea  ──▶  Build  ──▶  Launch                         (where most products fail)


   ✓ The proven path
        Customer ──▶ Problem ──▶ Value ──▶ Market ──▶ Business model
                                                          │
            Scale ◀── Growth ◀── Build ◀── Product ◀──────┘
        └──────── understand people FIRST ─────┘   └──── build only AFTER ────┘
```

So the questions that matter *first* are not technical at all:

```
        ┌────────────────────────────────────────────┐
        │  Why would someone PAY to play?             │
        └────────────────────┬───────────────────────┘
                             ▼
        ┌────────────────────────────────────────────┐
        │  Why would they come back TOMORROW?         │
        └────────────────────┬───────────────────────┘
                             ▼
        ┌────────────────────────────────────────────┐
        │  Why would they INVITE a friend?            │
        └────────────────────┬───────────────────────┘
                             ▼
        ┌────────────────────────────────────────────┐
        │  Why would an INVESTOR care?                │
        └────────────────────────────────────────────┘
```

**Tokiq is not selling a timer. It is selling an emotion:** anticipation, tension, hope, the
near-miss, the winning moment, and social recognition. In Aviator the plane is not the
product; the feeling is. The same is true for our STOP button.

### 2.2 The order we should learn things (the 5 phases)

A simple ladder for the team. Climb it in order.

| Phase | Focus | The question it answers |
|:---:|---|---|
| **1. Product thinking** | customer · value · revenue · cost · growth · investors · sustainability · systems thinking | *Why should this exist as a business?* |
| **2. Market research** | who plays Aviator, Crash, Mines, Plinko; why; how much they spend; what they love and hate | *Is there a real, paying audience?* |
| **3. Psychology** ⭐ *(most important for Tokiq)* | anticipation, tension, hope, near-misses, social proof, winning moments | *What feeling are we really selling?* |
| **4. Game economy** | entry fees, prize pool, winner, platform share, operations, growth | *Can the money loop sustain itself?* |
| **5. Investor lens** | problem, solution, why it works, risks (cheating, latency, repetitive, too easy), opportunities (leaderboards, tournaments, teams, jackpots, livestreams) | *Would a serious outsider back this?* |

### 2.3 The 7-step path to Product-Market Fit (PMF), in plain words

**Product-Market Fit** simply means that enough people want this so badly they keep coming
back and tell their friends. Here is the widely used 7-step path, translated into everyday
language, with what each step means specifically for **Tokiq**.

| # | Step | The simple lesson | What it means for Tokiq |
|:---:|---|---|---|
| **1** | **Understand PMF** | A product does not create a market; a **market pulls a product**. A good product in a bad market loses. The best sign of fit is not revenue, it is **organic word-of-mouth**. | Don't ask *"is the timer fun?"* Ask *"is it compelling enough that people keep returning?"* |
| **2** | **Measure PMF** | The real test is **retention**, not downloads. The **Sean Ellis test**: if **40%+** of users say they would be *"very disappointed"* to lose it, you likely have fit. | A million installs with no returners is failure. **100 players who play daily is alive.** |
| **3** | **Customer development** | **Talk before you build.** Use **Jobs-To-Be-Done**: people do not buy products, they *"hire"* them for an outcome. Interview power users, casual users, and **churned users** (they teach the most). | Players are not hiring Tokiq for *"timing accuracy."* They hire it for **excitement, status, hope, competition, stress relief.** |
| **4** | **Iteration** | **Never build before validating.** Run the **cheapest experiment first** (mockups, landing pages). Then loop: *build, measure, learn, repeat.* Track **outcomes, not outputs** (retention, not lines of code). | v1 timer, then feedback, then add rankings, then add tournaments, always learning. |
| **5** | **Retention & engagement** | Find the **"Aha moment."** Use the **Hook Model** (see §5). **Unpredictable** rewards build stronger habits than **big** rewards. | Aha could be the first near-perfect stop, first win, or first leaderboard spot. The variable reward is the near-miss, *"I was so close."* |
| **6** | **Growth channels** | Don't chase 10 channels. **Find one that works first.** For games the best channel is often **not paid ads** but referrals, community, streamers, and viral clips. Design the product to **spread itself.** | **Seeing others win is a built-in growth engine** (social proof). |
| **7** | **Scaling** | **Don't scale before fit.** Doing so is *"pouring gasoline on a fire that hasn't started."* The right order is **retention, then acquisition, then team, then markets.** | Build the game *big* **only after** proving players come back and bring friends. |

The whole journey, as one ladder. Most teams jump straight to the top rung (scaling). The
right way starts at the bottom (understanding the player) and climbs up one rung at a time.

```
            ┌──────────────────────────────────────────────┐
   wrong ▲  │  7 ▸ Scale                                    │
   start │  │  6 ▸ Growth                                   │
         │  │  5 ▸ Retention & engagement                   │
         │  │  4 ▸ Iteration                                │
         │  │  3 ▸ Customer development                     │
         │  │  2 ▸ Measure PMF                              │
   right │  │  1 ▸ Understand the player & problem          │
   start ▼  └──────────────────────────────────────────────┘
```

### 2.4 The "research board": questions to keep on the wall

The fastest way to keep the team focused is to pin up the questions we are actually trying to
answer. Start with these **5 core questions:**

```
   1 ▸ Why do people ACTUALLY play?  (not what they say, what they do)
   2 ▸ Why do they RETURN?
   3 ▸ What creates SOCIAL engagement?
   4 ▸ What creates TRUST?   (Aviator's real secret: "provably fair")
   5 ▸ How does the system SUSTAIN itself economically?
```

The fuller **10-question version** for deeper sessions:

> why play · why return · why invite friends · why spend money · why choose **Tokiq over
> Aviator** · what emotion are we selling · what builds trust · what makes **winning
> memorable** · what makes **losing tolerable** · what drives long-term retention.

### 2.5 Where these ideas come from (and one honesty note)

This thinking is not invented in-house. It is the mainstream of how modern products are built,
drawn from three places:

- **Startup thinkers & frameworks:** Steve Blank (customer discovery), *The Lean Startup*,
  *Y Combinator / Startup School*, and *Strategyzer*.
- **A 7-module Product-Market Fit learning path** (from "The Startup Project"), the source of
  the 7 steps in §2.3.
- **Constant re-application to Tokiq:** every concept above is bent back toward our game.

> ⚠️ **Honesty note for the team.** When this material was first gathered (via ChatGPT), the
> earliest module summaries were **educated guesses from the module titles**, not the real
> page content, and the tool openly admitted this. Only the **final pass** was based on
> actually reading the source pages. The takeaway: the framework is sound and standard, but if
> we ever quote specific figures or claims externally, **we verify them against the primary
> source first.** The same caution applies to the market numbers in §4.

---

## 3. What we have built so far (current state of the prototype)

The prototype is a **front-end-only MVP**, built to look and feel like a live multiplayer
product for demos and concept validation. It is **not** the real game, and that is by design.

> Kept simple: it is a modern web app (React + Vite + Tailwind) that runs in any browser, with
> no server behind it. The whole game flows through four screens.

```
   ┌────────┐    ┌──────────┐    ┌──────────┐    ┌─────────┐
   │ LOBBY  │──▶ │ COUNTDOWN│──▶ │ RUNNING  │──▶ │ RESULT  │──▶ next round
   │ join?  │    │  3·2·1   │    │ tap STOP │    │ winner  │
   └────────┘    └──────────┘    └──────────┘    └─────────┘
```

### 3.1 What is genuinely real vs. theatre

| ✅ Real (actual working code) | 🎭 Simulated (faked on the device) |
|---|---|
| The timer and your STOP tap | Other players' stop times (clustered near the target) |
| Your accuracy and winner calculation (closest wins) | Live chat messages |
| Round prize math and your wallet | Winners / activity feed |
| Your stats, streak, best accuracy | Mega Jackpot growth |
| | Leaderboard standings |

> The **only genuinely interactive part is the timer and your tap.** That is intentional. It
> is exactly the hook we need to prove the *"I was so close"* feeling. Everything else is
> theatre, there to make the screen feel alive in a demo.

Other deliberate demo choices:
- The table is kept small (**8 to 14 players**) so a human can realistically win during a
  demo. A real game with hundreds of players would make winning almost impossible.
- Opponent times use **bell-curve noise near the target**, so they read as skill, not chaos.
- Polished feel: stopwatch ticks that tighten near the target, music only while the clock
  runs, confetti and a win sound, a 3-second intro, installable as an app (PWA), fully
  responsive, and **three languages: English, Español, 日本語** (Japanese reflects a likely
  target market).

### 3.2 The current (prototype) money model, *illustrative only*

```
   Entry fee   :  ¥100
   House rate  :  10%
   Prize pool  =  players × entry fee × (1 − house rate)

   Example, 10 players:
        10 × ¥100 × 0.9  =  ¥900  ──▶ winner
                            ¥100  ──▶ platform
```

This is the standard "pool and rake" structure. **It is a placeholder, not validated.** We
have not yet tested what fee, pool size, or house cut players will actually accept.

### 3.3 What is intentionally NOT built yet (the real hard parts)

These are out of scope for the prototype **on purpose**, and they are the genuine challenges:

1. **Real multiplayer:** networking, matchmaking, and starting every player's round at the
   same instant.
2. **Anti-cheat / fairness:** today the stop time is measured **on the player's device**. A
   real build needs **server-controlled timing** and latency handling. *This is the core
   engineering challenge.*
3. **Payments & regulation:** pay-to-enter plus a prize pool plus a house fee needs **legal
   review per country, especially Japan.** The skill-based framing helps the gambling
   question but does **not** automatically make it exempt.
4. **A real path from round wins to the Mega Jackpot** (today it is an aspirational number).

> **Why this matters for our plan.** Because opponents are simulated, the prototype can
> validate the **feel of the loop** and the **near-miss hook**, but it **cannot yet** prove
> true multiplayer retention or real-money willingness to pay. Document 2 is built around that
> exact limitation.

---

## 4. Market & competitive context

> ⚠️ **Source note.** The figures below come from earlier desk research (the Aviator / Spribe
> analysis). They are **directional and must be independently re-verified** before any
> external or investor-facing use. Treat them as *"what we believe today."*

### 4.1 The benchmark: Spribe & Aviator

- **Company:** Spribe, founded **2018** by **David Natroshvili** (former First Deputy Minister
  of Economy, Georgia). Based in **Tbilisi**, with offices in Warsaw and Kyiv.
- **Scale:** Aviator reportedly has **60M+ monthly players** and roughly **92%** of the
  crash-game category.
- **Model:** a **B2B supplier**. It does not run casinos. It **licenses** Aviator to thousands
  of operator platforms (reported figures range from about 4,500 to 6,000+).
- **Tech:** **97% RTP** (return to player); lightweight, **mobile-first**; handles **2,000+
  bets per second**.
- **Trust (the key feature):** **"provably fair."** A cryptographic system (SHA-256) plus
  player-contributed data means neither the operator nor the developer can rig a round, and
  players can verify results afterward.
- **Mainstream legitimacy:** partnerships with **UFC** and **AC Milan** moved the brand from
  "dark-corner gambling" into social entertainment.

### 4.2 Why this category matters

- **Africa:** reported **~53% growth** recently, with a youthful, mobile-first audience that
  prefers fast, social sessions over traditional slots.
- **Operator economics:** a reported **10%+ uplift in gaming revenue** from high turnover.
- **Low barrier to entry:** the value is in the **math and social design**, not heavy 3D, so
  build cost is lower and potential return higher.
- **Market size:** part of a **$100B+** iGaming ecosystem.

### 4.3 Comparables to study

**Aviator · Crash · Mines · Plinko · Lucky Jet · JetX · Spaceman.**
For each, learn: who plays, why, how old, how much they spend, what they love, what they hate.

### 4.4 How Tokiq is similar and different

| | **Aviator (crash)** | **Tokiq (timing)** |
|---|---|---|
| Core action | Cash out before the plane crashes | Tap STOP closest to a target time |
| Tension source | Rising multiplier, greed vs. fear | Precision under pressure, the near-miss |
| Outcome feel | Luck-led (with cash-out skill) | **Skill-forward** (closest wins the pool) |
| Trust mechanism | Provably fair (SHA-256) | Must be **designed in** (provably fair) |
| Social layer | Live bets and chat | Live feed, chat, leaderboards (planned) |

> **The open strategic question.** *Why would a player choose Tokiq over Aviator?* We do not
> have a validated answer yet. The likely candidates, a stronger **sense of skill** (*"I can
> get better"*) and a **cleaner, more social, less casino-coded** feel, are **hypotheses, not
> facts.** Document 2 is designed to test them.

---

## 5. Player psychology: what really drives play

People return to games like this not because rewards are *large*, but because they are
*unpredictable*. The forces we believe are at work:

- **Anticipation & tension:** the countdown toward the target.
- **The near-miss:** *"off by 0.03s"* motivates more than a clean loss. It whispers *"next
  time."*
- **Variable reward:** uncertain outcomes form stronger habits than fixed ones.
- **Social proof:** seeing others win makes people want to play, and to share.
- **Hope & status:** leaderboards, streaks, recognition.
- **Skill perception:** believing you can improve drives repeat play, and supports the
  skill-based framing.

All of this maps onto the **Hook Model**, a self-reinforcing loop:

```
        ┌──────────────────────────────────────────────────┐
        │                                                    │
        ▼                                                    │
     TRIGGER ──▶ ACTION ──▶ VARIABLE REWARD ──▶ INVESTMENT ──┘
   (notification)  (tap STOP)   (how close?)    (balance, streak,
                                                 leaderboard rank)
```

The loop tightens each time: every investment (a streak, a rank, a balance) becomes the
trigger to come back.

---

## 6. The business as a living system

A game is not just gameplay. It is an **economic system** that must feed itself.

```
        ┌──────────────── reinvest the value created ─────────────────┐
        │                                                              │
   Players ──▶ Entry fees ──▶ Prize pool ──▶ Winner payout             │
                  │                                                    │
                  └──▶ Platform share ──▶ Operations · Marketing ──────┘
                                              (acquire MORE players)
```

Eventually we must answer three questions: *Can it scale? Can it be profitable? Can it sustain
the cost of getting new players?* We are **not** answering these yet. They come *after* we
prove players want it and come back.

---

## 7. Key risks & open questions

| Area | Risk / open question |
|---|---|
| **Engagement** | Is the loop too easy, too repetitive, or not exciting over time? |
| **Retention** | Will a player who lost yesterday come back today? *(the make-or-break question)* |
| **Differentiation** | Why Tokiq over Aviator and the other crash games? |
| **Fairness / cheating** | Device-side timing is exploitable. It needs server-controlled timing and latency handling. |
| **Trust** | Can we deliver a credible provably-fair promise that players believe? |
| **Willingness to pay** | What fee, pool, or house cut will players actually accept? |
| **Regulation** | Pay-to-enter plus a prize pool means legal review per market, **especially Japan.** Skill framing helps but is not an automatic exemption. |
| **Economics** | Does the house cut sustain operations plus player acquisition at real scale? |

---

## 8. The single most important lesson (our north star)

> ### 🧭 Don't fall in love with the solution (the timer). Fall in love with the problem.
> *How do we create an experience people repeatedly enjoy, trust, share, and will pay for?*

If we answer that convincingly, we are no longer designing a game. **We are designing a
business.** That is exactly the shift Mr. Watanabe keeps emphasizing: think like a founder
building a sustainable system of value (for customers, the company, employees, and investors),
not like a developer shipping features.

**What we do to find those answers is Document 2, the Validation Plan.**

---

### Appendix: prototype facts at a glance
- Repo `slide-desk/tokiq`, single-file game in `src/App.jsx`, stack React 18 / Vite 6 / Tailwind v4.
- Screens: lobby, countdown, running, result. Languages: EN / ES / JA. Installable (PWA).
- Demo numbers: entry **¥100**, house **10%**, start balance **¥5,000**, top-up **¥5,000**, table **8 to 14 players**.
- Backend: **none.** Multiplayer, payments, anti-cheat: **not implemented yet.**
