# Video Script (~3-4 mins)

## Intro (15 sec)

> "Hi! I'm Mohamed. and this is Flyways - a flight search app I built for the Spotter assessment. Let me show you how it works."

---

## Demo - Search (45 sec)

> "Here's the search form. I pick where I'm flying from and where I'm going."

*[Select origin and destination]*

> "Then I choose my dates and how many passengers. I can pick my currency too - and it remembers my choice next time."

*[Fill in dates, passengers, currency]*

> "I can do round trip or one way. Let's search."

*[Click search]*

> "Here are the flights. Each card shows the airline, departure and arrival times, how long it takes, and the price."

---

## Demo - Filters (45 sec)

> "Now let's filter. I can filter by stops - like direct flights only. Or by price range."

*[Use the price slider]*

> "I can also pick specific airlines."

*[Toggle an airline filter]*

> "See how the price graph updates when I filter? It shows how prices are spread out."

> "All filters work together. And on mobile, they slide out from the side."

*[Show mobile if time]*

---

## Demo - Other Features (30 sec)

> "A few more things - I can sort by price, duration, or departure time."

*[Click sort buttons]*

> "When I scroll down, more flights load automatically."

*[Scroll to show infinite scroll]*

> "And there's a theme switcher - 6 different colors."

*[Click theme button]*

---

## How I Built It (45 sec)

> "For the tech - React with Vite. It's fast to develop with."

> "TanStack Query handles the API calls. It caches results, so if I search the same thing twice, it doesn't call the API again."

> "For state, I used Context API. It's simple and works well for this size app."

> "Styling is Tailwind CSS with shadcn/ui components. They look good and are accessible."

> "For performance - useMemo so the price graph only recalculates when needed. And infinite scroll loads 10 flights at a time instead of all at once."

---

## Wrap Up (15 sec)

> "That's Flyways! Code is on GitHub, live demo on Netlify. Thanks for watching!"

---

## Quick Hints (Glance Before Recording)

| Section | Key Points |
|---------|------------|
| **Intro** | Name → App name → Spotter assessment |
| **Search** | Origin/Dest → Dates → Passengers → Currency (saved) → Round trip/One way → Search → Results |
| **Filters** | Stops → Price slider → Airlines → Graph updates → Mobile sidebar |
| **Other** | Sort buttons → Infinite scroll → Theme switcher |
| **Tech** | React + Vite → TanStack Query (caching) → Context API → Tailwind + shadcn → useMemo + infinite scroll |
| **Wrap** | GitHub + Netlify → Thanks! |

---

## Tips

1. **Practice once** before recording
2. **Go slow** - pausing is okay
3. **Click around** as you talk
4. **Be yourself** - don't memorize, just explain
5. **Mistakes are fine** - keep going

Good luck! 🚀
