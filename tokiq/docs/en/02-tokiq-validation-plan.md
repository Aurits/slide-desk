# Tokiq — Validation Plan

**Document 2 of 2** · Companion: `01-tokiq-research-and-current-state.md`
**Date:** 2026-06-04
**Status:** Working draft, a basis for team discussion.

> **Purpose.** Document 1 said *where we are*. This document says *what we do next to find out
> whether Tokiq deserves a real build*, **before** we spend on real multiplayer, payments, or
> anti-cheat. The guiding rule from our product learning path:
>
> > **Never build before validating. Run the cheapest experiment first.**

---

## 1. Where Tokiq sits in the product journey

```
   Customer ▸ Problem ▸ Value ▸ [ ★ YOU ARE HERE: validate ] ▸ PMF ▸ Growth ▸ Scale
```

We have an **idea plus a convincing prototype**, but **zero validated demand**. We have not
talked to enough real players, and the prototype's opponents are simulated, so we cannot yet
claim anything about retention or willingness to pay. **This plan is about removing that
uncertainty cheaply.**

> The *reasoning* behind this plan (the product mindset, the 5 learning phases, the 7-step
> path to Product-Market Fit, and the "research board" questions) lives in **Document 1, §2,
> "How to think about a product like Tokiq."** This document turns that thinking into action.

We are explicitly **not** doing yet: scaling, paid marketing, hiring for the build, real
payment integration, or full multiplayer infrastructure. *Scaling before fit is "pouring
gasoline on a fire that hasn't started."*

---

## 2. What we are trying to prove (hypotheses)

We will treat each of these as a claim to be **tested**, not assumed. Each has a clear signal
for "validated" or "invalidated."

| # | Hypothesis | Validated if… |
|:---:|---|---|
| **H1 Desirability** | The "stop closest to the target" loop is genuinely fun and tense. | Players voluntarily play "one more round" repeatedly without prompting. |
| **H2 Near-miss hook** | Losing but close makes people want to retry, not quit. | After a near-miss, players retry at a high rate and say it felt motivating. |
| **H3 Retention** | Players who lose come back another day. | A meaningful share return on D1 and D7 (see §5 targets). |
| **H4 Willingness to pay** | Players would pay an entry fee for a prize pool. | Players show intent to pay and accept a fee range. |
| **H5 Virality / social** | Players will invite friends and want to be seen winning. | Players share results or refer others when given the option. |
| **H6 Differentiation** | Players prefer Tokiq's skill feeling over Aviator's luck. | Players can name a reason to choose Tokiq, and prefer it head-to-head. |
| **H7 Trust** | A provably-fair guarantee matters and is believable. | Trust and fairness come up as important, and our explanation is understood. |
| **H8 Skill perception** | Players believe they can improve. | Players report a sense of mastery or progress over sessions. |

> The **two that matter most right now are H1 (is it fun?) and H3 (do they come back?).** If
> those fail, nothing else matters. H4, H7, and the regulatory question matter before any
> real-money launch.

---

## 3. Methods: cheapest experiment first

The whole plan is a funnel. We start with the cheapest, fastest test and only spend real
engineering effort once the cheap signals justify it. Each stage feeds a decision gate (§6).

```
   CHEAP & FAST
   (talk, watch)
        │
        ▼
   ┌─────────────────────────────┐
   │ A · Customer interviews      │
   │ B · Prototype playtests      │ ──▶  GATE 1   Is it fun? Does the near-miss work?
   └─────────────────────────────┘              (H1, H2, H8)
        │ pass
        ▼
   ┌─────────────────────────────┐
   │ C · Landing page (demand)    │
   │ D · Willingness-to-pay test  │ ──▶  GATE 2   Is there demand + willingness to pay?
   └─────────────────────────────┘              (H4, H5, demand)
        │ pass
        ▼
   ┌─────────────────────────────┐
   │ E · Minimal multiplayer pilot│ ──▶  GATE 3   Do real players return + invite?
   └─────────────────────────────┘              (H3, H5)
        │ pass
        ▼
   BUILD THE HARD PARTS  (multiplayer, anti-cheat, payments, regulation)
   COSTLY & SLOW, and now justified
```

### Experiment A: Customer discovery interviews *(cheapest, do first)*
- **Who:** 10 to 15 target players, a few **current Aviator / crash players**, and later some
  **churned** players. Churned users teach the most.
- **How:** use **"The Mom Test"** discipline. Ask about **past behaviour**, not hypotheticals.
  - ✅ "Tell me about the last time you played a game like Aviator. What happened?"
  - ✅ "How much did you spend last month on games like this? On what exactly?"
  - ✅ "What made you stop playing something you used to play?"
  - ❌ "Would you play or pay for a game like this?" (people lie to be nice)
- **Tests:** H1, H4, H6, H7, plus the 5 research questions from Document 1 §2.4.

### Experiment B: Moderated prototype playtests
- **Who:** 8 to 12 people, one at a time, watched (in person or by screen-share).
- **How:** hand them the existing prototype (https://slide-desk.vercel.app/) with **no
  instructions**. Observe, do not guide.
  Do they understand the goal? Do they tap "one more round" unprompted? Where do they smile,
  groan, lean in? When do they get bored?
- **Tests:** H1, H2, H8.
- **Honest limit:** opponents are simulated, so this measures the **single-player feel and the
  near-miss hook**, not true multiplayer retention.

### Experiment C: Landing page / "fake door" demand test
- **What:** a simple page explaining Tokiq with a "Join the waitlist / Get early access"
  button. Optionally drive a small, cheap traffic test (one channel only).
- **Measure:** visit-to-signup conversion, and which message resonates.
- **Tests:** demand signal, plus H5 (do they share the link?). A cheap way to see if anyone
  outside the room cares.

### Experiment D: Willingness-to-pay smoke test
- **What:** in the prototype or landing flow, present an entry-fee choice (play money first,
  then a *simulated* paid flow) at a few price points, and watch the drop-off.
- **Measure:** at what fee do players hesitate? Is a pool worth an entry to them?
- **Tests:** H4.
- **Guardrail:** **do not take real money** until the regulatory check (§7) is cleared.

### Experiment E: Minimal multiplayer pilot *(only after A to D look good)*
- **What:** a minimal **real** multiplayer round (even rough) with a small invited group, to
  get the *first* true retention and social signal.
- **Tests:** H3 and H5 for real. This is the first experiment that needs real engineering,
  which is exactly why it comes last, after the cheap signals justify it.

---

## 4. Tokiq-specific things to design and watch for

- **Aha moment** (the instant a player "gets it" and feels the value). Candidates to confirm:
  first near-perfect stop, first win, first leaderboard appearance, first social recognition.
  *Find the real one in playtests, then design to reach it fast.*
- **Hook loop:** *trigger, action, variable reward, investment.* The variable reward is the
  unpredictable closeness of the result. (Full diagram in Document 1 §5.)
- **"Make losing tolerable, make winning memorable."** Watch how losses feel. The near-miss
  must invite a retry, not a quit.

---

## 5. Metrics that matter (and the ones to ignore)

**Track these (outcomes):**

| Metric | Why it matters | Rough early target* |
|---|---|---|
| **"One more round" rate** | Core loop pull | Most players play 3+ rounds unprompted |
| **D1 / D7 retention** | The make-or-break signal | Establish a baseline first, then improve |
| **Rounds per session / session length** | Depth of engagement | Trending up across visits |
| **Sean Ellis score** | A PMF proxy: *"How would you feel if you could no longer use Tokiq?"* | Aim toward **40%+ "very disappointed"** |
| **Referral / share rate** | Built-in growth potential | Any organic sharing is a strong signal |
| **Near-miss to retry rate** | Validates the hook (H2) | High retry after close losses |

\* *Targets are starting reference points to refine with the team, not hard promises.*

**Ignore these (vanity):** downloads, page views, installs.

```
   ✗ 1,000,000 downloads, nobody returns   ──▶  DEAD
   ✓       100 players, every single day   ──▶  ALIVE
```

---

## 6. Decision gates (go / no-go)

Validation is a series of checkpoints, not one big bet. At each gate we decide one of three
things: **persevere, pivot, or stop.**

```
   GATE 1   after A + B   ─►  Is the loop fun? Does the near-miss work?  (H1, H2, H8)
            │  no  ──▶ pivot the core mechanic, or stop
            └─ yes ──▶ continue

   GATE 2   after C + D   ─►  Is there demand + any willingness to pay?  (H4, H5)
            │  no  ──▶ rethink positioning or audience
            └─ yes ──▶ continue

   GATE 3   after E       ─►  Do real players return + invite others?   (H3, H5)
            │  yes ──▶ NOW invest in the hard parts + write the business/GTM plan
            └─ no  ──▶ revisit retention design before spending more
```

> 💰 We only spend serious engineering money **after Gate 3.** Everything before it is cheap.

---

## 7. Run in parallel: the regulatory & fairness track

Because Tokiq involves entry fees and prize pools, two workstreams must run **alongside**
validation (not after), because either can change the whole model:

1. **Legal / regulatory review.** Skill-versus-gambling classification per target market,
   **especially Japan**, and any other markets in scope (for example East Africa). The
   skill-based framing helps, but it does **not** guarantee exemption. *Owner plus external
   counsel as needed.*
2. **Fairness design.** A credible **provably-fair** approach (for example a SHA-256
   commit-reveal with player seeds, as Aviator does) and a plan for **server-controlled timing
   plus latency handling** to prevent device-side cheating. This is the core engineering
   challenge, and it should be *scoped* (not built) during validation.

---

## 8. Suggested timeline (about a 4 to 6 week validation sprint)

| Week | Focus | Output |
|:---:|---|---|
| **1** | Recruit players, finalize interview script, start A | Interview notes, first insights |
| **2** | Experiment B (playtests), continue A | Observed-behaviour findings, then **Gate 1** |
| **3** | Build landing page (C), start willingness-to-pay test (D) | Demand and price signal |
| **4** | Analyze C and D, begin legal and fairness review (§7) | **Gate 2** plus regulatory first read |
| **5–6** | Scope and build the minimal multiplayer pilot (E) | First real retention signal, then **Gate 3** |

*Adjust to team capacity. The sequence matters more than the exact dates.*

---

## 9. Roles (to confirm together)

| Workstream | Suggested owner | Notes |
|---|---|---|
| Overall validation lead | Ambrose | Coordinates gates and synthesis |
| Customer interviews (A) | *TBD* | Needs someone comfortable talking to players |
| Playtests (B) | *TBD* | Observe and record, do not coach |
| Landing page + WTP (C, D) | *TBD, front-end* | Reuse prototype assets |
| Multiplayer pilot (E) | *TBD, engineering* | Only spins up after Gate 2 |
| Regulatory & fairness (§7) | *TBD* | Runs in parallel from Week 4 |

*(Names are left open on purpose. Let's assign them in the discussion.)*

---

## 10. What we want from the team discussion

1. Agree this is the **right stage** (validate, not build), and that two documents cover it.
2. Pressure-test the **hypotheses** (§2). Is anything missing or wrong?
3. Sanity-check the **metric targets** (§5) and the **gates** (§6).
4. Assign **owners** (§9) and confirm the **timeline** (§8).
5. Decide who starts the **regulatory read** (§7). This can quietly kill or reshape the model,
   so we want it early.

> **Bottom line.** The biggest risk is not whether we *can* build Tokiq. It is whether players
> will *return, trust it, spend, and share*. This plan spends the next few weeks answering that
> as cheaply as possible, so our next big decision is made on evidence.
