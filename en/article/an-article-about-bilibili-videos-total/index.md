---
url: /en/article/an-article-about-bilibili-videos-total/index.md
---
> Author: [Zhu Anfeng](https://zhuanfeng.netlify.app/)

***

I recently read an article titled [How Big is YouTube?](https://ethanzuckerman.com/2023/12/22/how-big-is-youtube/). It used a method called **"drunk dialing"**: generate random 11-character YouTube video URLs and try to access them. The 11 characters are drawn from letters (a–z, A–Z), digits (0–9), and two special characters (\_ and -). Since the space of possible combinations is enormous (close to 2^64), the probability of randomly hitting a valid video is very low. But with some optimizations, they improved the hit rate, found valid videos, and did analysis. Using this approach, they estimated that by 2023 YouTube had more than 4 billion uploaded videos.

That made me think of an equally absurd question:

**How many videos does Bilibili have?**

You might say: easy, just check the annual report. I asked DeepSeek and ChatGPT, and both basically said:

**Bilibili has not published a direct data point for total video count in public financial reports or investor presentations.**

So we need other methods.

***

### Method 1: Use search engines as a rough proxy

For example, searching `site:bilibili.com/video/` on Bing returns:

✔ about **175,000,000 results**, i.e. **175 million videos**. That feels low.

***

### Method 2: Build a crawler or call APIs

Bilibili definitely has anti-crawling strategies. Too much trouble—pass.

Calling APIs to count in a period and extrapolate is also trouble—pass.

***

### Method 3: Convert BV IDs to AV IDs and infer scale

Pick a latest video, get the BV, then use an online tool to convert it to an AV. I got **113961320128496**, on the order of 10^14 (hundreds of trillions), which is obviously wrong. And if AV were an auto-increment ID, converting that number back to BV does not map to an existing video.

***

### Method 4: "Drunk dialing" with random IDs

This is similar to the YouTube method:

* **Request URLs** and compute the ratio of **valid BV IDs / total attempts**.
* **Combine with historical reference points** (e.g., known latest AV IDs) to estimate total video count.

For example:

* If we generate **1,000,000** random BV IDs and **10,000 are valid**, the hit rate is **1%**.
* If the BV ID space is roughly 58^10 ≈ 2.15 × 10^17, then we might estimate total videos as 2.15 × 10^17 × 1% = 2.15 × 10^15.

The article mentioned several key optimizations:

1. Limit the search range (based on known IDs) to improve hit rate
2. Improve ID generation (weighted sampling) to avoid obviously invalid combinations
3. Parallelize requests (multithreading)
4. Combine APIs (reduce 404, improve data quality)
5. Compute valid-ID share and extrapolate statistically

Thinking about it, it is still kind of a hassle.
