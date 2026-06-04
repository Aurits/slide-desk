# Tokiq — Validation Plan

**Document 2 of 2** · Companion: `01-tokiq-research-and-current-state.md`
**Prepared by:** Ambrose Alanda — Technical Leadership, AIBOS
**Audience:** Tokiq team (Martin, Joshua, Crispus & technical leadership)
**Date:** 2026-06-04
**Status:** Working draft — basis for team discussion.

> **Purpose.** Document 1 said *where we are*. This document says *what we do next to find out
> whether Tokiq deserves a real build* — **before** we spend on real multiplayer, payments, or
> anti-cheat. The guiding rule from our product learning path:
>
> > **Never build before validating. Run the cheapest experiment first.**

---

## 1. Where Tokiq sits in the product journey

```
Customer → Problem → Value → [WE ARE HERE: validate] → Product-Market Fit → Growth → Scale
```

We have an **idea + a convincing prototype**, but **zero validated demand**. We have not
talked to enough real players, and the prototype's opponents are simulated — so we cannot yet
claim anything about retention or willingness to pay. **This plan is about removing that
uncertainty cheaply.**

> 📘 The *reasoning* behind this plan — the product mindset, the 5 learning phases, the 7-step
> path to Product-Market Fit, and the "research board" questions — lives in **Document 1, §2
> ("How to think about a product like Tokiq")**. This document turns that thinking into action.

We are explicitly **NOT** doing yet: scaling, paid marketing, hiring for the build, real
payment integration, or full multiplayer infrastructure. *Scaling before fit is "pouring
gasoline on a fire that hasn't started."*

---

## 2. What we are trying to prove (hypotheses)

We will treat each of these as a claim to be **tested**, not assumed. Each has a clear
"validated / invalidated" signal.

| # | Hypothesis | Validated if… |
|---|---|---|
| H1 **Desirability** | The "stop closest to the target" loop is genuinely fun and tense. | Players voluntarily play "one more round" repeatedly without prompting. |
| H2 **Near-miss hook** | Losing-but-close makes people want to retry, not quit. | After a near-miss, players retry at a high rate and say it felt motivating. |
| H3 **Retention** | Players who lose come back another day. | A meaningful share return on D1 and D7 (see §5 targets). |
| H4 **Willingness to pay** | Players would pay an entry fee for a prize pool. | Players express/behaviourally show intent to pay; accept a fee range. |
| H5 **Virality / social** | Players will invite friends and want to be seen winning. | Players share results / refer others when given the option. |
| H6 **Differentiation** | Players prefer Tokiq's skill feeling over Aviator's luck. | Players articulate a reason to choose Tokiq; prefer it in head-to-head. |
| H7 **Trust** | A provably-fair guarantee matters and is believable. | Trust/fairness comes up as important; our explanation is understood. |
| H8 **Skill perception** | Players believe they can improve. | Players report a sense of mastery/progress over sessions. |

> The **two that matter most right now are H1 (is it fun?) and H3 (do they come back?).** If
> those fail, nothing else matters. H4/H7/regulation matter before any real-money launch.

---

## 3. Methods — cheapest experiment first

Ordered from cheapest/fastest to more involved. Do them roughly in this order; stop and
re-decide at each gate (§6).

### Experiment A — Customer discovery interviews *(cheapest, do first)*
- **Who:** 10–15 target players + a few **current Aviator/crash players** + (later) some
  **churned** players. Churned users teach the most.
- **How:** Use **"The Mom Test"** discipline — ask about **past behaviour**, not hypotheticals.
  - ✅ "Tell me about the last time you played a game like Aviator. What happened?"
  - ✅ "How much did you spend last month on games like this? On what exactly?"
  - ✅ "What made you stop playing something you used to play?"
  - ❌ "Would you play / pay for a game like this?" (people lie to be nice)
- **Tests:** H1, H4, H6, H7, plus the 5 research questions (why play, why return, what creates
  social engagement, what creates trust, how it sustains itself).

### Experiment B — Moderated prototype playtests
- **Who:** 8–12 people, one at a time, watched (in person or screen-share).
- **How:** Hand them the existing prototype with **no instructions**. Observe, don't guide.
  - Do they understand the goal? Do they tap "one more round" unprompted? Where do they smile,
    groan, lean in? When do they get bored?
- **Tests:** H1, H2, H8. **Honest limit:** opponents are simulated, so this measures the
  *single-player feel and the near-miss hook* — **not** true multiplayer retention.

### Experiment C — Landing page / "fake door" demand test
- **What:** A simple page explaining Tokiq with a "Join the waitlist / Get early access" CTA.
  Optionally drive a small, cheap traffic test (one channel only).
- **Measure:** visit → sign-up conversion; which message resonates.
- **Tests:** demand signal + H5 (do they share the link?). Cheap way to see if anyone outside
  the room cares.

### Experiment D — Willingness-to-pay smoke test
- **What:** In the prototype/landing flow, present an entry-fee choice (play money first, then
  a *simulated* paid flow) at a few price points; observe drop-off.
- **Measure:** at what fee do players hesitate? Is a pool worth an entry to them?
- **Tests:** H4. **Do not take real money** until the regulatory check (§7) is cleared.

### Experiment E — Small multiplayer pilot *(only after A–D look good)*
- **What:** A minimal **real** multiplayer round (even rough) with a small invited cohort, to
  get the *first* true retention + social signal.
- **Tests:** H3, H5 for real. This is the first experiment that needs real engineering — which
  is exactly why it comes last, after the cheap signals justify it.

---

## 4. Tokiq-specific things to design & watch for

- **Aha moment** (the instant a player "gets it" and feels the value). Candidates to confirm:
  first near-perfect stop, first win, first leaderboard appearance, first social recognition.
  *Find the real one in playtests, then design to reach it fast.*
- **Hook loop:** `Trigger → Action → Variable Reward → Investment`. Variable reward = the
  unpredictable closeness of the result.
- **"Make losing tolerable, make winning memorable."** Watch how losses feel — the near-miss
  must invite a retry, not a quit.

---

## 5. Metrics that matter (and the ones to ignore)

**Track (outcomes):**

| Metric | Why it matters | Rough early target* |
|---|---|---|
| **"One more round" rate** | Core loop pull | Most players play ≥3 rounds unprompted |
| **D1 / D7 retention** | The make-or-break signal | Establish a baseline first, then improve |
| **Rounds per session / session length** | Depth of engagement | Trending up across visits |
| **Sean Ellis score** | PMF proxy: *"How would you feel if you could no longer use Tokiq?"* | Aim toward **40%+ "very disappointed"** |
| **Referral / share rate** | Built-in growth potential | Any organic sharing is a strong signal |
| **Near-miss → retry rate** | Validates the hook (H2) | High retry after close losses |

\* *Targets are starting reference points to refine with the team — not hard promises.*

**Ignore (vanity):** downloads, page views, installs. *A million downloads with no returners
is failure; 100 players who play daily is success.*

---

## 6. Decision gates (go / no-go)

Validation is a series of checkpoints, not one big bet. At each gate we decide:
**persevere · pivot · stop.**

- **Gate 1 — after A + B:** Is the loop fun and does the near-miss hook work (H1, H2)?
  - *No →* pivot the core mechanic or stop. *Yes →* continue.
- **Gate 2 — after C + D:** Is there demand and any willingness to pay (H4, H5, demand)?
  - *No →* rethink positioning/audience. *Yes →* continue.
- **Gate 3 — after E:** Do real players return and invite others (H3, H5)?
  - *Yes →* **now** it is justified to invest in the hard parts (multiplayer, anti-cheat,
    payments, regulation) and to write the business/GTM plan.

> We only spend serious engineering money **after Gate 3.** Everything before it is cheap.

---

## 7. Run in parallel: the regulatory & fairness track

Because Tokiq involves entry fees + prize pools, two workstreams must run **alongside**
validation (not after), since they can change the whole model:

1. **Legal / regulatory review** — skill-vs-gambling classification per target market,
   **especially Japan**; also any markets in scope (e.g. East Africa). Skill-based framing
   helps but does **not** guarantee exemption. *Owner + external counsel as needed.*
2. **Fairness design** — a credible **provably-fair** approach (e.g. SHA-256 commit-reveal
   with client seeds, as Aviator does) and a plan for **server-authoritative timing + latency
   compensation** to prevent client-side cheating. This is the core engineering challenge and
   should be scoped (not built) during validation.

---

## 8. Suggested timeline (≈ 4–6 week validation sprint)

| Week | Focus | Output |
|---|---|---|
| 1 | Recruit players; finalize interview script; A starts | Interview notes, first insights |
| 2 | Experiment B (playtests) + continue A | Observed-behaviour findings → **Gate 1** |
| 3 | Build landing page (C); start WTP smoke test (D) | Demand + price signal |
| 4 | Analyze C/D; begin legal & fairness review (§7) | **Gate 2** + regulatory first-read |
| 5–6 | Scope/build minimal multiplayer pilot (E) | First real retention signal → **Gate 3** |

*Adjust to team capacity. The sequence matters more than the exact dates.*

---

## 9. Roles (to confirm together)

| Workstream | Suggested owner | Notes |
|---|---|---|
| Overall validation lead | Ambrose | Coordinates gates & synthesis |
| Customer interviews (A) | _TBD_ | Needs someone comfortable talking to players |
| Playtests (B) | _TBD_ | Observe & record, don't coach |
| Landing page + WTP (C, D) | _TBD (front-end)_ | Reuse prototype assets |
| Multiplayer pilot (E) | _TBD (engineering)_ | Only spins up after Gate 2 |
| Regulatory & fairness (§7) | _TBD_ | Runs in parallel from Week 4 |

*(Names left open on purpose — let's assign these in the discussion.)*

---

## 10. What we want from the team discussion

1. Agree this is the **right stage** (validate, not build) and that 2 docs cover it.
2. Pressure-test the **hypotheses** (§2) — is anything missing or wrong?
3. Sanity-check **metric targets** (§5) and **gates** (§6).
4. Assign **owners** (§9) and confirm the **timeline** (§8).
5. Decide who starts the **regulatory read** (§7) — this can quietly kill or reshape the model,
   so we want it early.

> **Bottom line:** the biggest risk is not whether we *can* build Tokiq — it is whether
> players will *return, trust it, spend, and share*. This plan spends the next few weeks
> answering that as cheaply as possible, so our next big decision is made on evidence.
