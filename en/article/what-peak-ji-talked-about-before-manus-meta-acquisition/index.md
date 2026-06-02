---
url: /en/article/what-peak-ji-talked-about-before-manus-meta-acquisition/index.md
---
In December 2025, shortly before Manus was reportedly acquired by Meta, Peak Ji (English name: Peak; Manus co-founder and Chief Scientist) did a long [interview](https://link.zhihu.com/?target=https%3A//www.bilibili.com/video/BV1knvYBDEjs/). It was a dense 3.5-hour talk—tens of thousands of words. Even at 1.25x speed I struggled to keep up. His clarity and speed of thinking are impressive, and his English is solid too.

I took extensive notes and extracted the points below, focusing on technology and product rather than politics. Many lines are paraphrased, with some quotes preserved.

## 1. Background and Three Major Startup Phases

### 1) Early background

* Grew up between two styles: a scientist father (PKU physics professor) and an entrepreneurial mother (Zhongguancun serial entrepreneur).
* Not self-described as a "genius student"; more of a tinkerer with strong interests and uneven subjects.
* 2009 App Store was a turning point: it provided a way to prove that "tinkering" could create real economic value.

### 2) Startup #1: Mammoth Browser

* Built a third-party iOS browser in high school.
* A "copy" sales model: simple fixed price per sale; low maintenance.
* Reportedly earned ~$300k+ total, which is meaningful for a high schooler.
* Ended due to iOS compatibility changes and a desire to pursue more interesting work (NLP).
* View: browsers are rarely a good disruption startup category; they fit incumbents with distribution.

### 3) Startup #2: Magi (semantic search + knowledge graph)

Motivation: traditional search UX with "10 blue links" would not work for small screens and voice interfaces.

Key ideas and work:

* Word2vec (Mikolov, 2013) was described as a mind-blowing inflection: dense vectors enabled applying ML/DL methods to NLP.
* Built Open IE-like extraction to continuously extract entities/relations and build a knowledge graph.
* Tackled long-context issues early; reportedly reached ~16K context in 2018, ahead of the era.
* Product name Magi (from EVA), aimed at lifelong/continuous learning knowledge graphs.

Why it failed:

* Underestimated the data moat of search engines and the flywheel of data sources.
* Wearables and new interfaces arrived too late; ChatGPT was the real inflection.
* Engineering execution was strong (crawler, indexing, infra), but non-technical barriers were decisive.
* GPT-3 early access was a shock: prompt-based generality competed with many vertical pipelines.

### 4) Startup #3: Manus (general-purpose agent)

After an interim period (including building LLM work inside a unicorn and time as EIR), he joined Manus with the CEO Xiao Hong and other co-founders. Monica (an existing product) provided cash flow and business stability.

## 2. What Manus Is (and What It Is Not)

### 1) The "AI-native browser" attempt

They tried to build an AI-native browser:

* On-device models for cost/privacy, with AI controlling automation flows.
* They abandoned it after seeing:
  * browsers are inherently online, so offline-on-device obsession is misguided
  * small models (around 3B) lose too much quality vs. flagship cloud models
  * "AI takes over your computer" creates weird control conflicts with users
  * short tasks: humans are faster; long tasks: require keeping the machine awake
  * browser switching has huge migration friction (Arc example)

### 2) The Manus form factor

The core insight came from seeing non-engineers use Cursor:

* They were not "coding"; they were conversing with AI and letting code be a medium to solve non-coding tasks.
* Programming is not just a vertical skill; it is a general-purpose medium.

So they "moved the browser to the cloud":

* run agents asynchronously and concurrently in cloud sandboxes
* hide code and complexity for prosumers (knowledge workers, not necessarily programmers)
* name Manus from Latin "hand" and MIT motto "mens et manus"

## 3. Architecture and Key Bets

* **Model strategy:** do not build a foundation model too early; focus on context engineering and the agent framework, and leverage strengths across multiple models (coding, multimodality, reasoning).
* **Sandboxing:** lightweight full virtualization (Firecracker), isolated disposable sandboxes per session, supporting both Linux and Windows.
* **Long context:** context window length is not the only answer; compression awareness and offloading to file systems matter.
* **MCP stance:** cautious; MCP can pollute action space and increase costs. Prefer ways that keep the native action space clean.
* **"Pure" agents:** avoid over-constraining with rigid rule workflows; let intelligence solve tasks, including visual self-checking (layout, fonts, overlap) via observations.

## 4. Product Strategy and Metrics

* **General vs. vertical:** general agents can cover more scenarios; vertical is "adding constraints".
* **Long tail:** "long tail" can be daily work for some users; Manus can handle obscure formats by pulling tools from GitHub, etc.
* **Cross-scenario synergy:** in one session, an agent can research, build a site, set up a database, analyze traffic, generate slides, draft outreach emails—creating internal network effects.
* **Data flywheel:** user corrections teach the system; subjective evaluation is critical (and can be a moat).

Commercial notes (as described):

* Pricing moved from subscription + top-up complexity toward flexible subscription levels.
* Agent workloads consume far more tokens than chatbot workloads (orders of magnitude).

## 5. Industry Views

* The boundary between "model companies" and "app companies" may blur; top apps will build model capabilities and vice versa.
* SOTA half-life is short; differentiation comes from system-level execution and taste, not only model weights.
* Agent adoption will expand; operating systems will grow agentic capabilities rather than a separate "agent OS" winning alone.
* AI businesses behave more like manufacturing: higher fixed cost, more linear cost with usage, demanding operational discipline.

## 6. A Few Memorable Lines

* "For every complex problem there is an answer that is simple, clear and wrong."
* "Everything added dilutes everything else."
* "The monopoly of AI products is the monopoly of a mindshare, not the whole market."
* "Building agents is about doing 1000 small things right, not 3 big things."

This is still only a partial summary of a very dense talk, but it captures the themes I found most valuable: the shift from chatbots to agents, context engineering as the real craft, and the importance of system-level taste and evaluation.
