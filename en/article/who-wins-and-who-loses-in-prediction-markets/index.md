---
url: /en/article/who-wins-and-who-loses-in-prediction-markets/index.md
---
> Written based on Pat Akey, Vincent Grégoire, Nicolas Harvie, and Charles Martineau, *"Who Wins and Who Loses In Prediction Markets? Evidence from Polymarket"* (SSRN, 2026).

***

## 1) TL;DR

Researchers analyzed all trades on Polymarket from 2022–2026—**2.4 million users, $67 billion volume, 588 million trades**—and found several striking facts:

* **The top 1% captured 76.5% of total profits**
* Winners tend to use limit orders to get "good prices"; losers tend to "impulsively take liquidity"
* Roughly **1 out of 5 losers were actually directionally right**, but lost money mainly due to poor execution (market orders / bad prices)
* Market prices are indeed informative—but much of that accuracy is produced by a small amount of "smart money"; ordinary participants are effectively paying for it

**One-sentence summary:** prediction markets can feel like casinos, except the "house" is replaced by a small group of high-skill traders. For most people, entering is likely paying tuition.

In my view, China's A-share market—often criticized as "gambling-heavy"—shows similar patterns.

***

## 2) Some Background

### 2.1 What is a prediction market?

A prediction market lets you bet on whether a future event will happen. For example: "Will Bitcoin exceed $150k before the end of 2026?" You can buy "yes" or "no" shares priced between $0 and $1. If the final outcome matches what you bought, you profit; otherwise you lose your stake.

::: center

:::

The largest platform today is **Polymarket**, which runs on-chain with transparent transaction data. It became widely known during the 2024 U.S. election for accurately predicting a Trump victory.

### 2.2 The "wisdom of crowds" narrative

Supporters often claim: **when many people bet with real money, the price aggregates information and becomes more accurate than any expert.** This is the so-called wisdom of crowds.

The paper asks: **Is this narrative true? If prices are accurate, whose wisdom is it? Who pays the cost?**

### 2.3 Some simple trading terms

| Term | Plain explanation |
| --- | --- |
| **Limit order** | "I only buy/sell at this price or better"—like waiting for a discount |
| **Market order / taking liquidity** | "Execute now at whatever price"—like rushing in and paying full price |
| **Providing liquidity** | Posting limit orders on the book and waiting for others to trade with you |
| **Longshot** | Trading at extreme prices (e.g., $0.05 or $0.95)—betting on very unlikely or very likely outcomes |

***

## 3) What the Researchers Did

Four scholars (ESSEC, ECGI, etc.) obtained **full Polymarket transaction data** from 2022 to 2026, covering:

* 2.4M+ distinct users
* $67B total volume
* 588M trades

They then tracked each user's PnL (profit and loss) and compared behavior patterns between winners and losers.

***

## 3.1 Key Findings

### Finding 1: Profits are extremely concentrated

**The top 1% captured 76.5% of all profits.**

Imagine 100 players in a room and 1 person takes most of the money on the table. This is not exaggeration; it is what the data implies. Most participants are net losers, and their money flows to a tiny set of winners.

### Finding 2: Winners win by execution, not only by being right

Winners' profits come largely from using limit orders to trade at prices favorable relative to the eventual outcome.

In other words: they are not just "right"—they **buy cheap and sell expensive**, patiently trading when prices drift away from reasonable ranges.

### Finding 3: Losers lose by impulsive trading

Losses are strongly associated with liquidity-taking (market orders): executing immediately rather than waiting for better prices.

This is like rushing into a store because you fear a price increase, and paying more than you needed to. In markets, this "I must enter now" behavior often raises your cost for the same belief. In stock markets, chasing breakouts at high prices is the same idea.

### Finding 4: Longshot behavior is a marker, not the root cause

Trading at extreme prices is more common among losers, but after controlling for other variables (like trading frequency), its explanatory power drops.

The bigger issue is a bundle of behaviors that includes frequent impulsive orders.

### Finding 5: About 1 in 5 losers lost "unfairly"

One particularly painful finding: **among losers, about one fifth would have flipped from negative to positive PnL if you remove the cost of liquidity-taking.**

They were directionally correct. They lost mainly because their execution was poor. With slightly more patience and limit orders instead of market orders, they might have made money.

This is easy to map to stock markets too: there are only so many good assets—so why do retail investors still lose so often?

### Finding 6: Monthly performance persistence is weak

Even though winner/loser profiles are clear in aggregate, **someone who profits one month may not profit the next**. Month-to-month persistence is weak.

Possible explanations:

* it may reflect opportunity variation rather than stable skill
* or selection effects: winners trade more, losers quit

For ordinary people, the practical takeaway is simple: a big win in one month does not mean you "figured it out".

### Finding 7: Prices are accurate, but not because of the crowd

The paper confirms that Polymarket prices track true probabilities reasonably well. But that efficiency is not driven by the crowd. It is driven by a small group of informed/professional traders who continuously correct prices. Ordinary participants are more like the ones paying for this efficiency.

***

## 4) So What Does This Mean?

### 4.1 For ordinary participants

* A prediction market is not "everyone guessing together"—you are competing against a small set of highly skilled traders.
* Execution style can matter more than direction. Using limit orders and waiting for good prices reduces the chance of "losing for the wrong reasons".
* Short-term profit does not imply long-term skill.
* Prices can be accurate, but the cost of that accuracy may be paid by ordinary participants.

### 4.2 For designers and regulators

The paper hints at a deeper issue: prediction markets may create social value through information efficiency, but the cost is borne by the least sophisticated participants. This resembles retail losses in traditional financial markets—except prediction markets package the reality with a "wisdom of crowds" story.

***

## Paper Info

* **Title:** *Who Wins and Who Loses In Prediction Markets? Evidence from Polymarket*
* **Authors:** Pat Akey (ESSEC / ECGI), Vincent Grégoire, Nicolas Harvie, Charles Martineau
* **Venue:** SSRN Working Paper, 2026
* **DOI:** [10.2139/ssrn.6443103](https://doi.org/10.2139/ssrn.6443103)
* **Link:** [SSRN page](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6443103)
