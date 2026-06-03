# 🍓 How Is Our Son A Banana?

A telenovela-meets-true-crime **visual novel** built for a solo hackathon. You play
**Strawberrina**, a married strawberry navigating an affair with her smooth-talking banana
boss, **Bananito** — while her sweet, oblivious husband **Strawberto** waits at home. You
have nine months and a fistful of choices to *get away with it* before the baby is born.

It's a playable parody of the viral **AI Fruit Drama / Fruit Love Island** TikTok trend.

> _"I am strawberry. You are strawberry. How is our son a banana?!"_

## ▸ Play

- **Click** anywhere to advance dialogue (click again to skip the typewriter).
- At decision points, **pick a choice**. Each one quietly moves a hidden **suspicion** meter.
- Reach the delivery room and find out which of **two endings** you earned:
  - 🍓 **The Perfect Crime** — the baby is a strawberry. She got away with it.
  - 🍌 **Exposed** — the baby is a banana. Strawberto leaves. The internet is merciless.

The suspicion score is hidden during play and only revealed in the ending recap — that's the joke.

## ▸ Tech

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — hand-built telenovela design system (Playfair Display + DM Sans)
- **Framer Motion** — scene crossfades, sprite entrances, the banana-reveal screen shake
- **Web Audio API** — fully procedural SFX (typewriter ticks, choice stings, the reveal swell); no audio files
- State is a small `useReducer` state machine (`lib/reducer.ts`); all content is data-driven (`lib/scenes.ts`)
- Deployed on **Vercel**

```bash
pnpm install
pnpm dev      # http://localhost:3000
```

## ▸ How AI was used

- **All artwork** (8 backgrounds + 9 character portraits) was generated with OpenAI's
  `gpt-image-2` / `gpt-image-1.5` via an `imggen` CLI. Character sprites were rendered on a
  green screen for clean compositing.
- **Claude (Anthropic)** co-wrote the screenplay (the true-crime narration, the fruit puns,
  the iconic lines) and built the game engine.
- No AI runs at play-time — the experience is fully self-contained and free to host.

## ▸ Credits & influences

- The **AI Fruit Drama / Fruit Love Island** TikTok trend (Feb–Apr 2026) — the genre this parodies.
- **Joy Ofodu's _How Different Fruits Act_ (2025)** — a parody influence on fruit personification.

This is an affectionate, original parody. All characters and dialogue are fictional.
  - 🍌 **Close Call** — a near-miss variant of the perfect crime ending.
- **Looping background video** — key scenes (`morning`, `reveal-*`) use an HTML `<video>` element
  (`/video/*.mp4`) instead of a still image; the still image is kept as the poster/fallback.
  Character sprites are hidden automatically when a video background is active.