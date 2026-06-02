---
url: /en/article/the-year-of-2025/index.md
---
I recently saw a finance/investing commentator list a whole bunch of "first years" when looking ahead to 2026:

* the first year of autonomous driving
* the first year of liquid cooling
* the first year of domestic HBM
* the first year of on-device AI
* the first year of solid-state batteries
* the first year of AI apps
* the first year of quantum computing
* the first year of in-memory computing chips at scale
* the first year of neuromorphic computing
* the first year of the low-altitude economy
* the first year of commercial spaceflight
* the first year of humanoid robots
* the first year of silicon photonics
* the first year of controllable nuclear fusion

In short, "first years" everywhere. Stock investors have a lot of homework again.

I am not here to explain those concepts. In the AI world—the area I follow most closely—2025 also had quite a few "first years." I want to summarize a few points that I personally found most interesting.

## 1. The First Year of Reasoning

In September 2024, OpenAI kicked off a "reasoning" revolution with o1 and o1-mini. This was also described as inference-scaling, or the **RLVR (reinforcement learning with verifiable rewards)** wave. In early 2025, they shipped o3, o3-mini, and o4-mini, doubling down on the direction. After that, reasoning ability basically became a signature trait of mainstream frontier models.

To understand why this matters, here is Andrej Karpathy's [explanation](https://karpathy.bearblog.dev/year-in-review-2025/):

> By training LLMs in multiple environments (e.g., math puzzles / code puzzles) with automatically verifiable rewards, models spontaneously develop strategies that humans recognize as "reasoning": breaking problems into intermediate steps, and iterating through multiple solution attempts (see the DeepSeek R1 paper for examples).

> In practice, RLVR training has an extremely high ability-to-cost ratio, and it consumed large amounts of compute originally planned for pretraining. As a result, much of the progress in 2025 depended on how well labs exploited this new stage. Model sizes stayed similar, but RL training time increased substantially.

In 2025, every major AI lab released at least one reasoning model. Some even offered hybrid models with both reasoning and non-reasoning modes. Many APIs now have a knob to tune how "deep" the model thinks for a prompt.

One real breakthrough is **tool use**. A reasoning model that can use tools can plan multi-step tasks, execute them, and keep reasoning based on observations, updating the plan to reach a goal. A very visible result is that **AI-assisted search is now actually usable**. For a long time, combining search engines with LLMs felt underwhelming, but now—even for more complex research questions—I often get good answers via ChatGPT's "thinking" mode.

Reasoning models also perform exceptionally well at **code generation and debugging**. The reasoning process lets the model start from an error and trace through multiple layers of a codebase to find root causes. As long as the model can read and run code, even very nasty bugs in large codebases can often be diagnosed by a strong reasoning model.

## 2. The First Year of AI Agents

When you combine reasoning ability with tool use, you get **AI agents**. This excites me a lot. AI used to feel like a writer or a consultant; now it is becoming an "actor" that can actually do things—trigger workflows, call APIs, and operate software.

In 2025, everyone talked about agents, and definitions varied. In my view, an agent is an LLM system that repeatedly calls tools in a loop to reach a goal.

The two breakthrough application areas are coding and search. Deep research mode—where the model collects information and spends 15+ minutes generating a detailed report—also became popular. I once used Doubao to explore an academic topic. It produced a plausible report, but many details still needed improvement (e.g., freshness of citations). ChatGPT's thinking mode is also a kind of agent-like mode, and works quite well.

## 3. The First Year of Coding Agents

In February, Anthropic quietly released Claude Code—so quietly that it did not even get a standalone blog post. They listed it as item #2 in the Claude 3.7 Sonnet announcement. Claude Code is a canonical example of what I call a coding agent: it can write code, run code, check results, then iterate and improve.

In 2025, many labs shipped their own CLI-based coding agents: Claude Code, Codex CLI, Gemini CLI, Qwen Code, Mistral Vibe. Vendor-neutral options include GitHub Copilot CLI, Amp, OpenCode, OpenHands CLI, and Pi. IDEs like Zed, VS Code, and Cursor also invested heavily in agent integration.

My first deep exposure to coding-agent workflows came from a small side project I built in the second half of the year: no heavy frontend frameworks, just plain HTML + CSS + JS to customize a company website. The hardest part was pixel-perfect implementation from the design mock, plus animations. I am not a frontend expert—at best I "know" frontend; CSS is only something I dabble in.

I tried both Cursor and Trae, and eventually chose Trae due to cost considerations. After using it, my feeling is: projects that were hard or impossible for me before are now much easier—aside from needing to budget usage, it is genuinely great. Ironically, the hardest part can be converting a design draft into HTML. I also tried Figma Make and the result was not great.

## 4. The First Year of Vibe Coding

In February, Andrej Karpathy coined the term "vibe coding" in a [tweet](https://twitter.com/karpathy/status/1886192184808149383):

> I have discovered a new kind of programming called vibe coding, where you fully give in to the vibes, embrace exponential productivity, and forget that the code even exists. It works because LLMs (e.g., Cursor Composer with Sonnet) are now too powerful. I also talk to them with voice via SuperWhisper and Composer, barely touching the keyboard. I ask for very tiny changes like "halve the sidebar padding" because I'm too lazy to find the code. I accept all changes without reading diffs. When errors happen, I copy-paste the error in, and it usually fixes itself. The code grows beyond my normal comprehension; to understand it I'd need to read carefully for a while. Sometimes the model can't fix a bug, so I go around it, or ask it to modify randomly until the problem disappears. It's good for weekend one-off projects, and it's fun. I'm building an app, but it's not really programming anymore. I look at the output, talk, run it, copy-paste stuff, and most of the time it works.

The essence of vibe coding is: let humans do what humans are best at—creating and judging. Let AI do what AI is best at—executing and implementing. The key capability on our side is product thinking, judging code quality, expressing requirements clearly, and iterating fast.

My own practice: AI IDEs are indeed powerful. But if I feel a change will be complicated, I usually ask the AI to propose a plan first, rather than editing files immediately. After I review it, then either I let the AI apply changes or I apply details myself. More than once, AI has completely wrecked my codebase: it may implement the requested feature, but break existing logic elsewhere. With deep call stacks, debugging becomes brutal. If you hand everything to AI, the moment it collapses is when you get a chain of bugs and the AI starts "arguing" with you. For large projects, context understanding is still limited. Ten-year legacy codebases with millions of lines are not easy for AI. Smaller apps or modules are fine.

## 5. The First Year of MCP

In November 2024, Anthropic introduced the **Model Context Protocol (MCP)** as an open standard for tool integration across LLMs. In early 2025, MCP adoption exploded. In May there was a striking milestone: within eight days, OpenAI, Anthropic, and Mistral all shipped API-level support for MCP.

MCP is not just "USB-C for AI". It is a protocol that pushes AI from chatbots toward the agent era through plug-and-play discoverability and composability. Still, its adoption rate surprised me. I think timing mattered: MCP arrived when tool use finally became reliable enough that many people mistakenly treated MCP support as a prerequisite for tool use.

After I started using Trae and similar tools deeply, I used MCP less. Anthropic also seemed to realize this later in the year and released an excellent Skills mechanism. MCP involves a web server and complex JSON payloads; a Skill is just a Markdown file in a folder, optionally with scripts. In November, Anthropic published ["Code Execution with MCP: Building More Capable Agents"](https://www.anthropic.com/engineering/code-execution-with-mcp), describing a way where coding agents generate code to call MCP, avoiding much of the context overhead.

In early December, MCP was donated to the newly formed Agentic AI Foundation.

## 6. The First Year of Context Engineering

The term "context engineering" has gained attention recently as a better framing than "prompt engineering".

Here is an example tweet from Shopify CEO Tobi Lutke [link](https://twitter.com/tobi/status/1935533422589399127):

> Compared to "prompt engineering", I prefer "context engineering". It more accurately describes the core skill: providing all necessary context so an LLM can reasonably solve the task. It's an art.

And Andrej Karpathy later strongly endorsed the idea [link](https://twitter.com/karpathy/status/1937902205765607626):

> Strongly agree that "context engineering" is a better term. People associate "prompts" with short task descriptions, but in industrial LLM applications, context engineering is a sophisticated art and science: filling the context window with just the right information for the next step. It's science because it includes task descriptions and instructions, few-shot examples, RAG, relevant (possibly multimodal) data, tools, state and history, compression... It's hard. It's art because it requires intuition about the LLM's "mental model"...

Common context engineering strategies include: offload, reduce, retrieve, isolate, and cache.

## 7. The First Year of Synthetic Data

Even the smartest AI needs "food"—data. In 2025, high-quality internet data was close to being exhausted, and cleaning costs kept rising. So synthetic data became a strategic weapon: use model-generated data to train models.

Projects like Microsoft's [SYNTHLLM framework](https://www.microsoft.com/en-us/research/articles/synthllm/) suggest that with good design, synthetic data can support large-scale training. Bigger models may not require more raw data. Datasets can be tuned for specific goals rather than blindly chasing volume. Data enters an era of "custom cultivation".

## 8. The First Year of Measuring Hallucinations

Remember the 2024 case where a New York lawyer used ChatGPT to cite fake cases? In the past, people treated hallucination as a "quirk" and just retried. Now, vendors treat it as an engineering metric that can be measured and optimized.

RAG (retrieval-augmented generation) has become close to a standard. There are also benchmark sets like RBG and RAGTruth to quantify hallucination rates. Hallucinations cannot be eliminated 100%, but the mindset is shifting from "tuning by intuition" to "governing with data".
