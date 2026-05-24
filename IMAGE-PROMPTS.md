# Baby-reveal images to generate (OpenAI credits were capped)

Generate these **3 images** with `imggen` once your OpenAI billing limit is raised, then drop them
into `public/bg/` with the **exact filenames** below. The app already references these paths, so it
will "just work" the moment the files exist.

Run each block from inside `frontend/`. All are landscape **1536x1024**. The key trick: the prior
attempt produced a *human* baby — every prompt below hard-forces a **fruit-for-a-head** baby.

---

## 1. `public/bg/ending-perfect.png`  ← OVERWRITE (currently a human baby)
Happy-ending bassinet shot — a sleeping **strawberry** baby.

```bash
imggen generate "3D Pixar-style render, cinematic close-up, telenovela aesthetic, soft cinematic lighting, saturated warm colors, premium editorial quality, no text. A swaddled newborn baby whose ENTIRE HEAD IS A CUTE GLOSSY RED STRAWBERRY with a tiny friendly cartoon face and a little green leafy top — a strawberry for a head, NOT a human head, no human face — sleeping peacefully in a soft wooden hospital bassinet, warm golden-hour light, tender and hopeful" \
  -m gpt-image-2 -q high -s 1536x1024 -f png -o /tmp/berry_fix/ending --json
cp "$(ls -t /tmp/berry_fix/ending/default/*.png | head -1)" public/bg/ending-perfect.png
```

## 2. `public/bg/reveal-perfect.png`  ← NEW
Good-ending reveal — doctor presenting the **strawberry** baby.

```bash
imggen generate "3D Pixar-style render, cinematic, telenovela aesthetic, soft warm cinematic lighting, saturated warm colors, premium editorial quality, no text. Gloved hands in blue surgical scrubs gently holding up a swaddled newborn whose ENTIRE HEAD IS A CUTE GLOSSY RED STRAWBERRY with a tiny friendly cartoon face and a green leafy top — a strawberry for a head, NOT a human head, no human face — bright joyful delivery room, tender triumphant moment" \
  -m gpt-image-2 -q high -s 1536x1024 -f png -o /tmp/berry_fix/revperf --json
cp "$(ls -t /tmp/berry_fix/revperf/default/*.png | head -1)" public/bg/reveal-perfect.png
```

## 3. `public/bg/reveal-exposed.png`  ← NEW
Bad-ending reveal — doctor holding up the **banana** baby.

```bash
imggen generate "3D Pixar-style render, cinematic, telenovela aesthetic, dramatic cool lighting, premium editorial quality, no text. Gloved hands in blue surgical scrubs holding up a swaddled newborn whose ENTIRE HEAD IS A RIPE YELLOW BANANA with a tiny cartoon face — a banana for a head, NOT a human head, no human face — sterile delivery room, awkward comedic shock, dramatic telenovela lighting" \
  -m gpt-image-2 -q high -s 1536x1024 -f png -o /tmp/berry_fix/revexp --json
cp "$(ls -t /tmp/berry_fix/revexp/default/*.png | head -1)" public/bg/reveal-exposed.png
```

---

After generating, redeploy:
```bash
git add public/bg && git commit -m "Add baby-reveal images" && git push
vercel --prod --yes --scope bizhanchiks-projects
```

> Until these exist, the two reveal scenes fall back to the delivery-room background
> (`hospital.png`) so nothing looks broken, and the happy ending keeps the old image.
