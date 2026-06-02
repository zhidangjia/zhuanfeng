---
url: /en/article/an-peek-behind-anduril/index.md
---
## Why I Wrote This

Anduril is a fast-rising U.S. defense tech company focusing on military applications of drones. It grew from a 20-person team valued at $250M in 2018 to a ~4,000-person company valued around $28B today. I recently read an engineer (Adnan Esmail) describing their [internal R\&D](https://joincolossus.com/article/the-amusement-park-for-engineers/). Many details were interesting, so I made notes to see whether there are lessons that could be useful for domestic defense enterprises and institutes.

## 1. Validate Value with "Rough Prototypes", Not "Perfect Before Shipping"

Anduril does not aim for polished perfection in the first step. They build a minimal demo that works end-to-end, prove real value, and then iterate.

> “Our first tower was literally a telephone pole with a gaming PC housed in a weatherproof box, a pan-tilt unit normally used as stage lighting, with spikes on it to prevent bird shit from blocking the sensors. A lot of it came from Home Depot.”

Their first surveillance tower looked crude and was even funded out of pocket, but it solved the core border-monitoring need. It reportedly helped seize nearly 1,000 pounds of marijuana and assisted in arresting dozens of smugglers, winning a pilot program with U.S. Customs and Border Protection and opening the border-security market.

## 2. Break the Impasse with Extreme Speed

"Fast" is the core weapon. Whether iterating products or responding to urgent demands, they compress timelines and deliver in months (or weeks) what traditional vendors might take years to do.

### Example 1: Raising Anvil's interception success rate

> “We had three months to stop the bleeding, and I spent my paternity leave developing a 3D radar system... In three months, we went from a 40% kill probability to knocking out 35 of 35 targets.”

The early Anvil prototype used camera-based targeting and failed easily when targets moved. Even so, 40% was already far above competitors' single-digit rates. To fix the defect, the engineer built a 3D radar system during paternity leave, pushing results to 35/35. Even elite FPV pilots could not escape tracking.

### Example 2: 14 days to build 53 V2P interceptors

> “One of our lead engineers from the test team and his co-worker came in on a weekend and built 28 complete vehicles in a single day... In total, they built 53 vehicles in 14 days, test-flying each one three times...”

V2P was a key product to compete for a contract worth over $100M. It was a 5.2 kg interceptor reaching 147 mph while maintaining high attitude precision. On the night before a competition, the U.S. military suddenly demanded intercepting a much larger Group Three drone. At 3 a.m., engineers stripped radar from 18 drones, flashed new firmware, reassembled them, and competed the next morning as if nothing happened—then achieved a one-shot hit and won a life-changing contract.

## 3. Win with Low-Cost Innovation, Not Overpriced Systems

When traditional defense gear is expensive and inefficient, Anduril often challenges assumptions: avoid being constrained by "official requirements", and modify cheap commercial components to meet core needs.

> “We modified a $5,000 commercial boating radar—the spinning ‘candy bar’ type you see on fishing vessels... By modifying the waveguide assembly to create a narrower beam, we concentrated more energy in a specific direction and extended the range by about 10x.”

At the time, the U.S. military needed low-altitude cruise-missile detection. Traditional solutions were multi-million-dollar radars, and vendors refused to sell to a "small company" like Anduril. The team asked: why cover the whole sky? If the threat mainly comes from the horizon, then optimize for that. They modified a fishing-boat radar into a workable solution. Competitors mocked them with container-sized systems, but the cheap solution won the competition.

## 4. Turn Crisis into Breakthrough

R\&D is never smooth. Anduril teams do not fear failure; they find root causes fast and grind details until the last minute, turning crises into breakthroughs.

> “It turned out there was a fundamental issue: When a quadcopter dives downward faster than its propellers can ‘bite’ through the air, the propellers act as air brakes, inverting the effect of guidance commands. We needed to completely reverse their guidance commands when crossing this threshold... The team drove the drone... from Southern California to my home in Los Altos in the middle of the night. The next day was the baby shower for my second child, and we spent the hours and minutes before the guests arrived tuning the drone in my backyard.”

Bolt initially reused Anvil's guidance logic and repeatedly missed the target by a few meters during dives, failing a key demo. After identifying the core issue, the engineer built a "dive guidance" fix. For a four-star general demo, the team drove the drone overnight to his house and tuned it in his backyard before guests arrived for a baby shower. Bolt later made it into the USMC OPF-L program and became another core product.

::: center

:::

## 5. A Flexible Organization that Sustains Efficiency

Anduril rejects "one product, one fixed team". They use modular decomposition and dynamic staffing, letting small teams support many products and avoiding efficiency collapse as they scale.

> “We rebranded our engineering organization as ‘Product Engineering’... We then consolidated scattered teams into a cohesive group with three clear frameworks: products, core technologies, and key capabilities... What made this work was our matrix organization. Instead of creating dedicated teams for each product, we built functional organizations (across electrical, mechanical, and embedded systems) with deep expertise that could surge resources toward critical projects when needed.”

Instead of rigid per-product teams, they organize around three blocks: products, reusable core technologies (like Lego bricks), and key capabilities (supporting services, like machine shops that can prototype in hours). When needed, they surge specialists from functional groups (electrical, mechanical, embedded). In early 2023, fewer than 200 people were responsible for 25+ products, many deployed globally in the thousands.

## The Author's Closing Summary

Even after leaving Anduril to start a company in physical intelligence, the author says the most unforgettable part was the atmosphere of "making the impossible possible": no empty talk in meeting rooms, only hands-on work in labs; no waiting a year for perfection, only building something usable first and then improving fast; no lone-hero mythology, only a team burning together toward one goal. That spirit is worth remembering and carrying forward.
