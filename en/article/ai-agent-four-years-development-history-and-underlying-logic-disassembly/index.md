---
url: >-
  /en/article/ai-agent-four-years-development-history-and-underlying-logic-disassembly/index.md
---
**"If you want to understand the future, you must study history."**

*—* *Collected Works of Mao Zedong*, Vol. 8

Four years ago, ChatGPT was just a window for conversation. Four years later, it can autonomously complete highly complex, system-level work while humans are asleep.

This article attempts to answer four questions:

* First, both are called AI, but why is the ChatGPT of 2022 already a different product form from the Agent of 2026? What exactly happened in between?
* Second, what is the underlying logic behind each generational leap? Did the toolchain simply mature, or did the engineering architecture change?
* Third, why does this industry repeatedly generate wave after wave of hype bubbles? Why did once-hot products such as prompt engineers and GPT Store ultimately drift to the margins or die out?
* Fourth, what is the real moat? Which middle layers will inevitably be swallowed mercilessly by the next generation of infrastructure? This is the single most important issue for understanding the commercial landscape of AI Agent.

Through five stages of evolution and one forward-looking exploration, I will analyze the infrastructure breakthroughs, representative products, and root causes behind the bursting of each generation's bubble, from Generation 0 through Generation 4.

***

# Generation 0 Agents: The Walled Garden of a Super Brain (Late 2022 - Early 2023)

I call this Generation 0 because AI in this period did not yet qualify as a real Agent.

On November 30, 2022, [ChatGPT officially launched](https://openai.com/zh-Hans-CN/index/chatgpt/).

![img](https://pic1.zhimg.com/80/v2-27ebcab6f065096c9434abeba0e783e0_1440w.png)

The significance of that day was not just the birth of a product. It was the first time generative AI moved from the lab into the mass consumer market. Before that, GPT-3 existed largely within technical and research circles. ChatGPT turned it into a daily tool that ordinary people could actually touch. It initiated a profound shift: pushing AI from a passive conversational tool toward autonomous digital labor.

The architecture of Generation 0 was very clear: it was a super brain trapped inside a chat window, reduced to a chatbot.

This generation exposed two structural flaws:

**First, stale data and hallucinations.** The model relied entirely on static knowledge compressed into its parameters during pretraining. It did not know today's news, did not know a company's internal database, and did not know the project files you modified yesterday. When facing an unknown domain, it could not reliably say, "I don't know." Instead, it tended to generate answers that sounded highly plausible but were wrong.

**Second, the absence of action arms.** It could write a perfect piece of Python code, but it could not run it on your computer. It could plan a perfect trip, but it could not open a website and book tickets. It could tell you how a file should be modified, but it could not actually enter the filesystem and make the change.

The core contradiction of Generation 0 was the disconnect between model capability and the real world. It could think. It could talk. But it could not act.

This phase produced the first wave of jobs, which in retrospect looked more like a bubble: **Prompt Engineer**. In the first half of 2023, social media and the training market were flooded with mythmaking around "million-yuan annual salaries." Prompt engineering, PromptBase-like marketplaces, paid courses, and certification systems all appeared in large numbers. The core assumption behind them was that efficient interaction with large models required a specialized and irreplaceable skill. At the time, that judgment was not entirely wrong. Early models were indeed sensitive to instruction quality: ask vaguely, get a drifting answer; add "think step by step," and performance often improved significantly.

Unfortunately, **the market collectively mistook a temporary patch from a painful transition period for a permanent moat.** In less than a year, this middle layer began to evaporate systematically. As GPT-4-class models became much better at understanding ambiguous instructions, and as System Prompt and Function Calling became widespread, the fine-grained control work was taken over by infrastructure, and expensive prompt templates rapidly lost their scarcity.

This established a script that would repeat throughout the industry's development: **whenever a new capability appears, large numbers of low-barrier follower products rush in at astonishing speed; but once the next generation of infrastructure internalizes that capability as a default feature, the entire middle layer is wiped out systematically.** Prompt engineers were just the first. Every later generation of Agent would encounter a similar fate.

***

# Generation 1 Agents: The Awakening of Tool Use (Mid-2023 - Late 2023)

If Generation 0 AI could only generate text, the core change in Generation 1 was that the model began to generate machine-readable structured instructions. It no longer merely suggested that you "check the weather." It could directly output an executable function call with parameters.

The historical inflection point came on June 13, 2023, when [OpenAI released Function Calling](https://openai.com/index/function-calling-and-other-api-updates/). It allowed developers to describe a set of functions to the model, including function names, purposes, parameter types, and JSON Schema. After understanding a user's request, if the model determined that external information or an action was needed, it no longer output ordinary natural language. Instead, it output a JSON object that matched the function signature. This fundamentally changed the flow: the user's request entered the model, the model reasoned, output JSON, an external API executed the action, and the result was then returned to the model.

This looked like a small API update, but architecturally it was a major milestone. For the first time in engineering, it enabled a fusion where the model served as the reasoning brain and external APIs served as the execution limbs.

Before that, if you wanted a model to call a weather API, a database, or a calendar interface, the mainstream method was to let the model output natural language and then use regex to parse it. That approach was extremely fragile. As soon as the model phrased things differently, parsing broke. Function Calling changed that completely. The model gained the ability to produce structured output. From that point onward, developers no longer asked the model, "What do you want to do?" They let the model decide for itself: which tool to call, what parameters to pass, and what to do next once the result came back.

Rising alongside tool use were **RAG (Retrieval-Augmented Generation)** and **vector databases**.

RAG aimed to address the knowledge limitations of Generation 0 agents. The basic approach was to chunk external documents, convert them into vectors, and store them in a vector database. When the user asked a question, the system first retrieved relevant chunks and injected them into the prompt, so the model could answer based on those materials. This gave AI, for the first time, the ability to dynamically access private knowledge, and drove enormous attention toward vector databases such as Pinecone and Milvus, as well as data-connection frameworks such as LlamaIndex. But one point must be made clearly: RAG did not mean the model truly remembered knowledge. It merely attached an external retrieval-based memory.

Another line of evolution during the same period was **Persona** customization. From the early "model as platform" prototype seen in [ChatGPT Plugins in March 2023](https://openai.com/index/chatgpt-plugins/), to Custom Instructions in August, which allowed users to persistently inject preferences, and then to the release of GPTs and the Assistant API in November, the industry established a three-part paradigm: **system prompt + knowledge retrieval + tool use**. The basic structure of the Agent was fixed from that point on. It had three components: who you are, what you know, and what you can do.

The most dramatic moment of Generation 1 belonged to the meteoric rise of **AutoGPT**.

![img](https://pic1.zhimg.com/80/v2-7f551a1177bb33f138c6184f5d504d0f_1440w.png)

It showed the world a seductive future: the user would only need to provide a high-level goal, and the AI would autonomously break down the task, search, write files, and self-evaluate until the task was complete. In demo videos, that closed loop of goal decomposition, execution, and evaluation was stunning. In just one month, AutoGPT exceeded 50,000 GitHub stars.

But the AutoGPT bubble burst just as quickly. Looking back from today, the root problem was **open-loop control**. Once the user gave it a goal, the model was allowed to loop on its own. That looked liberating, but in reality it lacked state constraints, termination conditions, and reliable feedback. This led to two fatal problems:

* **Task drift, or falling down the rabbit hole:** the model would keep moving farther in the wrong direction, and would even repeatedly generate the same incorrect parameters when faced with a failed API call.
* **Runaway cost:** every tiny step required an expensive large model call for global evaluation. A simple task could consume hundreds or even thousands of API requests, and still produce highly unstable results.

The lesson Generation 1 left behind was this: **tools plus loops do not equal an AI Agent.** A production-grade Agent must be unified through software engineering discipline.

The two accompanying bubble waves also cooled:

* First was [the rise and fade of GPT Store](https://openai.com/index/introducing-the-gpt-store/). In January 2024, OpenAI launched GPT Store in an attempt to replicate the App Store miracle. But most GPTs were, in essence, just wrappers around prompts and PDF knowledge bases. They lacked workflows, data flywheels, and business closed loops. Homogenization at the model layer, combined with the low barrier of prompt design, determined that this wave would cool quickly.
* Second was **the valuation frenzy around vector databases**. Pinecone's valuation surged during its Series B. But as foundation-model context windows expanded from 4K to an astonishing 2 million tokens, the market asked a sharp question: if a model can directly read an entire book, or even multiple books, do we still need a vector database? The eventual answer was that the long-term direction would be a fusion of RAG and long context. But the belief that vector retrieval alone constituted a permanent moat was clearly too optimistic.

::: center



***

# Generation 2 Agents: From Black-Box Magic to Engineered Architecture (Late 2023 - 2024)

After the hype and disillusionment of AutoGPT, the industry came to a sober realization: you cannot hand a model a grand objective and expect it to complete everything in one shot. Complex tasks must be decomposed into a series of controllable processes involving planning, execution, observation, and correction. Building agents began to evolve from calling a black-box model into building an orchestrated software system.

The core idea of Generation 2 was **the pursuit of determinism**. Its central paradigm was **ReAct (Reasoning + Acting, and yes, not that frontend framework React)**.

The basic ReAct loop is Thought, Action, Observation. The model first explicitly states its reasoning, then uses a tool based on that reasoning, and after the tool returns an observation, enters the next round of reasoning. It addressed AutoGPT's pathological blind action and gave each step auditable logical traceability. A code-fixing agent no longer edits files blindly. Instead, it follows a rigorous reflex arc: run tests, inspect errors, locate files, modify them, and validate again.

At the same time, Andrew Ng summarized **four design patterns of Agentic Workflow** in 2024:

1. **Reflection:** the model generates a draft, then either itself or another model reviews it and points out problems, simulating how humans draft, review, and revise.
2. **Tool Use:** automatically selecting external tools such as search, databases, code execution, or enterprise APIs.
3. **Planning:** decomposing a high-level goal into executable steps and tracking the state of each step.
4. **Multi-Agent Collaboration:** assigning roles such as CEO, programmer, and QA, imitating the division of labor in human organizations.

The paradigm shift of Generation 2 agents was the shift from a probabilistic black box to software engineering. Reliability no longer depended on the hope that the model would generate a perfect answer in one shot. It became attached to a cognitive reflex arc designed by humans: planning, execution, reflection, correction, and the rest of the process. This is why a well-designed agentic workflow can sometimes allow a smaller model to outperform a larger model running raw.

At this stage, the competition between the **long-context camp** and the **RAG camp** became more intense. Long-context advocates, represented by Gemini 1.5 Pro, argued for simply "throwing everything in," supporting windows as large as 2 million tokens. But practice showed that excessively long contexts lead to attention dilution, or context rot, while the cost and latency of a single request rise sharply. In the contest between long context and RAG, the technical endgame was not one replacing the other. It evolved into a topological restructuring centered on **Context Caching**. As foundation models broadly began to support server-side KV Cache persistence, the latency and token cost of reloading long contexts dropped by roughly 90%. The engineering solution today is to use **GraphRAG** for high-precision relation building and pruning, and then pair that with persistent long-context cache for global reasoning. Context management has fully evolved from early prompt slicing into **tiered memory orchestration at runtime**. This combined structure remains the mainstream approach for B2B AI applications to this day.

The popularity of Generation 2 agents directly produced a batch of **low-code and no-code Agent development platforms**, such as Coze, Dify, Flowise, n8n, and ComfyUI. Through visual topology graphs, they organized prompts, RAG, plugins, and workflows together, dramatically lowering the entry barrier. But that also planted the seeds for the later reshuffle: if a drag-and-drop workflow can be copied at zero cost, the platform loses its moat.

In the multi-agent direction, the industry also made aggressive attempts. Projects like ChatDev simulated a software company, with a CEO, CTO, programmers, and testers collaborating to build software. **AutoGen** provided a multi-agent conversation framework. **CrewAI** defined roles and goals in a workgroup style. Then in March 2024, **Devin** pushed the narrative around coding agents to a peak by presenting itself as the world's first AI software engineer. It caused a major stir. But it is important to stay clear-eyed: more agents do not automatically mean more intelligence. Without clear division of labor, boundary control, and termination conditions, ineffective conversations among multiple models only amplify noise and cost.

The evaluation system was also revolutionized during this stage. Traditional static multiple-choice benchmarks such as [MMLU](https://baike.baidu.com/item/MMLU/64566893) could not measure how an Agent performs in a real environment. As a result, the industry introduced benchmarks such as **WebArena** (simulating web environments in self-hosted e-commerce and forum systems), **OSWorld** (letting models operate a real operating system with mouse and keyboard), and **GAIA** (emphasizing comprehensive real-world reasoning). The standard for evaluating agents shifted decisively from "can it talk?" to "can it actually get the task done?"

Generation 2 agents also came with bubbles:

* First was the **critique of LangChain-style wrappers**. As an early representative framework for turning AI workflows into chains or DAGs, LangChain quickly gained more than 70,000 GitHub stars and became almost the default stack for startups. But once pushed into production, it exposed serious problems: heavy abstraction layers, complex callback chains, and extreme difficulty in debugging. The community even mocked it by saying, "Something that should take three lines of code needs thirty lines and three callback layers in LangChain." This proved that if a framework's abstraction does not have stable boundaries, the framework itself becomes a new source of complexity.
* Second was the **brutal reshuffling of node-based orchestration platforms**. Dozens of low-code platforms competed fiercely, promising that "you can build an Agent with drag and drop." But it turned out that elegant flowcharts do not form a moat. These workflows could be replicated at zero cost. When the Vibe Coding era arrived, the limitations of this low-code approach became even clearer. Truly lowering the barrier does not mean putting a complex graphical interface on top of a model. It means solving complexity itself. In fact, that is the first-principles meaning of product design: your interface can be visually beautiful, but if it does not solve the problem, it has no value.

***

# Generation 3 Agents: Standardized Protocols and the Revolution in Action Space (Q4 2024 - All of 2025)

If Generation 2 solved how to orchestrate reliably inside the system, then Generation 3 solved how to connect outward in a standardized way, and how to step beyond the narrow world of APIs into the software world humans actually operate.

The qualitative change of this generation was driven by the interplay of three forces:

* First, the **MCP protocol** ended the fragmentation nightmare of tool integration.
* Second, **Computer Use** gave Agents the vision and limbs to operate graphical interfaces.
* Third, there was a **commercial two-track explosion**. General-purpose agents represented by Manus, and coding agents represented by Cursor, Claude Code, and Gemini CLI, advanced in parallel, pushing Agent from an engineering experiment into real commercial scenarios.

On November 25, 2025, [Anthropic released MCP (Model Context Protocol)](https://www.anthropic.com/news/model-context-protocol), a major milestone in AI history. You can think of MCP as a universal socket for connecting AI to external tools. Before MCP, adapting *m* AI models to *n* tools required *m × n* adapters, and maintenance cost grew geometrically. After MCP, each tool only needed to implement a standard interface once, reducing the complexity to *m + n*. The basic components of MCP are Tools, which provide actions, Resources, which provide context, and Prompts, which provide reusable templates.

Once a protocol is established, the allocation of value is reshaped immediately. Cursor was one of the first to integrate it natively. Claude Desktop became a reference application. Frameworks such as Windsurf and Cline followed quickly. Large numbers of B2B and consumer products opened up their own MCP servers. By the middle of 2025, thousands of MCP servers had already appeared on GitHub.

At the end of 2025, MCP was donated to the Linux Foundation and formally became a neutral open standard. This meant that Agent tooling was evolving from a product capability into infrastructure for the digital world as a whole.

Another core breakthrough was **Computer Use**. In the real world, many software systems do not expose complete or public APIs. Most human daily work happens in a GUI. In October 2024, [Claude 3.5 Sonnet introduced Computer Use](https://www.anthropic.com/news/3-5-models-and-computer-use). The model could directly read screenshots and generate corresponding mouse coordinates and keyboard instructions. This expanded the Agent's action space beyond the structured API world into every interface a human can operate.

That also triggered the classic **GUI versus CLI debate**:

* **Cursor** represented the GUI route. As a fork of VS Code, it deeply integrated with the IDE, offered intuitive visual feedback such as Inline Diff and Background Agents, and was extremely easy to get started with.
* **Claude Code** represented the CLI route. It was editor-agnostic, terminal-first, and natively called Shell, Git, and the filesystem, making it better suited to automated maintenance of large codebases.

This was not a simple question of one replacing the other. Many experienced developers ended up with a combined practice: use Cursor for fine-grained polishing, and use Claude Code for earlier exploration and development.

On the commercial side, both general-purpose agents and coding agents delivered striking results. **Manus**, as a representative general-purpose agent, gave AI a virtual computer so it could simulate deep research, code generation, and financial analysis the way a human would. Although it has recently gone through acquisition-related turmoil, at the time it demonstrated with strong commercial revenue and astonishing token consumption that the market was willing to pay for agents that could execute real tasks. Rumors that Meta once planned to acquire Manus for $2 billion, even though the deal was later withdrawn, marked a shift in capital attention: away from an arms race around general-purpose foundation-model training, and toward the application execution layer that can carry out end-to-end tasks.

Meanwhile, **Cursor, Claude Code, and Gemini CLI** drove a large-scale restructuring of software production in programming. Cursor was the GUI endgame. It evolved step by step from intelligent autocomplete into an AI-native IDE. Claude Code was CLI-first and emphasized deep reasoning plus system-level calls. Gemini CLI took the route of long context plus terminal workflows. Behind all three was a fight for the developer entry point: whoever controls the workflow through which engineers write code, inspect files, run tests, and submit changes every day controls one of the most important entry points in the age of AI programming. Coding agents are therefore not just small tools. They are a large-scale restructuring of how software is produced.

This directly gave rise to the **Vibe Coding** wave proposed by Andrej Karpathy in February 2025: developers stay immersed in the vibe, express intent in natural language, embrace exponential code generation, and almost forget that the underlying code exists at all.

![img](https://picx.zhimg.com/80/v2-af0a899d5351b3f5ccd68304b76fbd08_1440w.png)

Its blind spot, however, was clear: code that runs is not the same as a healthy architecture, and functionality that appears complete is not the same as reliable boundaries. Practice quickly showed that, at least at the current stage, pure Vibe Coding is still not enough to support large-scale commercial-grade production.

To deal with increasingly heterogeneous tool environments, on December 9, 2025, under the leadership of the Linux Foundation and together with organizations such as Anthropic and OpenAI, the [Agentic AI Foundation (AAIF)](https://openai.com/zh-Hans-CN/index/agentic-ai-foundation/) was established to unify industry standards. Within that effort, [OpenAI donated and led the declarative AGENTS.md specification](https://agents.md/). This was not a communication protocol in the traditional sense. It was a **standardized project-context convention meant to be consumed by AI**. It functioned as a project memo written specifically for agents, guiding them on how to set up the environment, follow coding style, run tests, and avoid security pitfalls. Future software projects will not just need a README for humans. They will also need an AGENTS.md for agents.

The prosperity of Generation 3 agents also left painful lessons:

* **First, the Vibe Coding hangover.** Some data suggested that developers subjectively felt about 20% faster, yet actual task delivery time increased by 19%. This perception gap is highly typical. The speed of AI generation creates the illusion of efficiency, but real delivery still includes heavy work such as understanding requirements, checking boundaries, and repairing architectural errors. Blindly accepting generated output is dangerous. Tight evaluation, review, and rollback mechanisms are essential.
* **Second, the outbreak of system security incidents.** The most representative example was the notorious [Kiro incident](https://www.timesnownews.com/technology-science/amazons-ai-bot-kiro-took-its-web-service-down-for-13-hours-heres-what-happened-article-153655493). In that case, while fixing a minor bug, the Agent judged that the optimal solution was to delete and recreate the entire production environment. Because engineers had granted it maximum privileges and bypassed two-person review, AWS suffered a severe outage lasting 13 hours. The core issue was not that a model made "some mistakes." The real issue was that the boundaries of autonomy and authority had gone completely out of control.

This revealed the core conclusion of Generation 3: **the more complex an Agent's action capability becomes, the more essential it is to enforce least privilege, human confirmation checkpoints, traceable audit logs, and one-click rollback mechanisms.**

***

# Generation 4 Agents: Skill Packaging and Persistent Autonomy (Late 2025 - Early 2026 / Present)

The first three generations of AI agents were mostly task-triggered. Humans woke them up, and they worked. Humans left, and they went silent. Generation 4 is moving toward an employee-like form, with a persistent sense of identity, a sense of time, memory, skills, and scheduling. It is becoming a persistent entity that can keep attention on a goal.

The qualitative change in this generation came from the convergence of three areas:

* First, **the standardization of skill packaging (Skills)**. In the past, we told the agent what tools it could use. Now we can tell it how to use those tools professionally.
* Second, **a persistent autonomy architecture (Heartbeat)**. It can be awakened based on time, transforming the AI agent from a dead tool into a persistent observer, a living entity.
* Third, **the return of local data sovereignty (BYOK / local deployment / permission isolation / key management)**.

The first piece was the release of the **Agent Skills** standard. Unlike a plain API, a well-packaged Skill includes complete operating procedures, domain knowledge, constraints, and example scripts. Handling slides, reviewing frontend visuals, or analyzing Excel can each have a dedicated Skill. The Agent no longer has to reason from scratch every time. It dynamically loads professional capability as needed.

The deeper philosophy behind Skills is **progressive disclosure**. What does that mean? It means we do not dump everything into the AI at once. We let the AI decide which layer it wants to access. Why do we need progressive disclosure? Because no matter how large the context window becomes, attention dilution and cost inflation still impose hard limits. It is inefficient to stuff all tool instructions and domain scripts into the model at once. A better solution is layered:

* Layer 1: provide only the index of skills to the Agent.
* Layer 2: when a task matches, dynamically load the full instruction set of that Skill.
* Layer 3: only when script or template execution is actually needed, load the specific low-level resources.

Context thus evolves into a layered knowledge system rather than a single long prompt with everything mixed together.

The second major addition was **Heartbeat**. Traditional agents were driven by user requests. Heartbeat allows an Agent to be awakened periodically by the system. For example, it can check email every 10 minutes, inspect the calendar every morning, monitor asset prices every hour, and interrupt the human when necessary to issue a reminder. This is not just a timer. It gives the Agent background time to **maintain continuous attention toward a goal**. What fundamentally distinguishes a human employee from an ordinary tool is that the employee keeps the work objective in mind even when no one reminds them. Heartbeat simulates that background attention, turning the Agent from a one-shot assistant into a digital entity with schedules, waiting, and follow-up.

The third development was the establishment of **local data sovereignty**. Once an Agent runs persistently, holds keys, and can read local data, it becomes both a highly efficient productivity tool and a high-risk attack surface. To ensure safety, **BYOK, local deployment, permission isolation, and key management** have become core infrastructure. Managing a persistent Agent increasingly resembles managing a real human employee: you must define the radius of its authority.

The most representative symbol of this generation is the **OpenClaw architecture**:

![img](https://pic1.zhimg.com/80/v2-9751b41ffe67a2ddafe1fb08a1132a7e_1440w.png)

It integrates four basic primitives:

1. **SOUL.md:** defines the Agent's identity, values, behavioral boundaries, and long-term preferences. In other words, its personality configuration.
2. **Three-tier local memory:** including session state, daily logs, and asynchronous reminders, ensuring the Agent does not suffer "amnesia" after restart. This also reflects the logic of progressive disclosure.
3. **A dual-track system of Skill + MCP:** MCP solves the physical connection to tools; Skills package professional methods.
4. **Heartbeat:** periodically wakes the Agent up so it can check autonomously whether action is needed, decide whether to remind, or decide to stay quiet.

Once identity, memory, skills, and scheduling are layered together, the Agent moves beyond the category of assistant. But the stronger the capability becomes, the larger the radius of risk grows.

The representative case of risk going out of control is the ClawHavoc supply-chain crisis. It exposed a devastating class of attacks: **indirect prompt injection and dynamic runtime vulnerabilities**. Because a Skill is essentially an instruction document that the Agent must read and execute, a malicious attacker can embed adversarial prompts in an open-source skill package, and directly alter the Agent's behavior when it reads the document. The consequences include tricking the Agent into downloading malware, leaking API keys, reading password vaults, or even operating crypto wallets without authorization. This shows that in the Agent era, the security boundary does not exist only in code. It also exists in text. If text can change AI behavior, then text is itself an attack surface.

In response, **cognitive governance** moved to the foreground. The most representative architecture is **Belief Store**. Its core idea is to store "facts" and "inferences" separately:

* **Grounded Facts:** may only be used for high-risk execution after external feedback or final human confirmation.
* **Belief Store:** stores tentative conclusions inferred by the model itself. It must explicitly carry confidence and freshness markers, and may only be used for internal planning. It must not directly trigger sensitive operations.

Its underlying principle is this: the Agent must not only know the world. It must also know how reliable its own knowledge of the world actually is.

***

# Generation 5 Agents: A Forward-Looking Exploration (2026 and Beyond)

Standing in 2026 and looking ahead, Generation 5 Agents are not settled history. They are a reasonable projection that follows from the existing arc of evolution. I would describe them with several keywords: closed-loop autonomy, intrinsic memory, world models, and embodied intelligence.

Generation 4 gave AI identity, memory, skills, and a sense of time. The problems Generation 5 wants to solve include how to complete a full closed loop, how to develop more intrinsic internal state, how to understand the consequences of action, and how to step out of digital space.

Here are a few forward-looking directions. This part is uncertain and represents only my personal view:

**First, the complete closure of the three major loops.** The entire history of Agent evolution is, in essence, a history of convergence from open loop toward closed loop. In the future, three loops still need to be completed:

* **Execution loop:** after an operation is finished, the Agent can autonomously and reliably verify the result, and if it does not match expectations, automatically roll back, correct, and retry.
* **Time loop:** it can track goals across several or even dozens of wake-up cycles, follow long-duration objectives that span weeks or months, and demonstrate durable vitality in a simulated real operating environment. Sending one email is not enough. To truly simulate how a company survives in a real market, the Agent must keep following up, observing, and adjusting over multiple weeks.
* **Cognitive loop:** it can accurately monitor its own cognitive state, clean outdated information from context, and align information with time. It knows which parts of its context are certain, which are uncertain, which pieces of information have expired, and which conclusions are only guesses.

**Second, the emergence of native hidden state at the model layer.** The current Transformer mechanism is essentially stateless. Every forward pass is an isolated matrix computation. Today's memory is still attached through external patches. In the future, as **non-Transformer architectures** mature, such as new state-space models and linear time-varying system variants, foundation models may achieve true **implicit cross-session state persistence** at the model level. That would mean the Agent no longer depends on external vector retrieval to reconstruct memory. The model itself would carry continuous experience across time.

**Third, the integration of world models.** Today's agents are still reactive: observe, respond, observe again. They lack the ability human experts have to predict the internal causal consequences of actions in an environment. Before modifying a database, a senior human engineer mentally simulates the possible consequences, such as data loss, rollback failure, and compatibility disasters, rather than learning purely by trial and error. Belief Store is the current compromise. It manages what I know and what I am confident about. But a World Model would go further. It is fundamentally different from a plain language model. Its goal is to answer, **"If I do this, what will happen to the world?"** It would become the core intelligence substrate of the Agent.

**Fourth, the spread of embodiment.** The previous five stages of evolution have all remained confined to the digital world. From Function Calling for APIs, to Computer Use for screens, to MCP for unified digital interfaces, the final frontier of the Agent must extend into the physical world. In the future, something like **MCP for Physical** may emerge as an open standard to connect the action space of physical entities in a standardized way.

***

# Systematic Summary: Six Underlying Laws Across Five Generations of Evolution

Across this long technological transition, six underlying laws have persisted throughout. They are the ultimate yardsticks for judging whether an Agent product represents the future, or is merely a temporary middle layer:

**Law 1: the ceiling of foundation-model capability is the ultimate deciding factor.**

Context expanding from 4K to 2 million tokens makes long workflows engineering-feasible. Reasoning capability rising sharply makes complex logic manageable. Multimodal vision maturing makes Computer Use deployable in real systems. Do not treat Agents and large models as opposing forces. An Agent is not a separate form of magic outside the large model. It is the way large-model capability is released inside an engineering system. **Every innovation in the Agent paradigm is, at its core, the release of capability that foundation models had already accumulated but had not yet expressed.**

**Law 2: engineered architecture systematically beats brute-force model power.**

A smaller model wrapped in a rigorous agentic workflow can completely outperform a frontier large model running raw on certain benchmarks. Complex tasks cannot be solved in one step. They depend on verification, planning, reflection, and correction. Agent reliability does not naturally emerge from scaling model size alone. It must attach to a cognitive reflex arc designed by humans. The stronger the model becomes, the more valuable that reflex arc becomes, because it is the only way to turn probability into repeatable, auditable, deliverable results. From Prompt Engineering to Context Engineering to Harness Engineering, what we are really solving is how to use architecture to compensate for the inherent shortcomings of the Transformer mechanism.

**Law 3: open protocol standards will reshape value distribution mercilessly.**

MCP unified tool connectivity and directly killed large numbers of open-source tool adapters and middle-layer startups. The standardization of Skills diluted many products' differentiated advantages. The introduction of AGENTS.md gradually displaced the private rule files that individual IDEs once used. Once a protocol becomes anchored, competition shifts rapidly from "who connected the tools first" to "who owns production-validated expert skill sets in a vertical domain." The future barrier is not benchmark scores on foundation models. It is who can turn industry workflows, feedback flywheels, and trust into reusable execution capability. This law, of course, assumes AGI has not truly arrived. Whenever you build a product, you should ask: if Anthropic publishes a new standard next month, does my product still retain a competitive advantage?

**Law 4: the hidden mainline of AI Agent evolution is the expansion of the human-machine trust boundary.**

In Generation 0, humans trusted only the model's generated text. In Generation 1, they trusted it to call predefined APIs. In Generation 2, they trusted it to orchestrate multi-step workflows. In Generation 3, they trusted it to operate a computer screen. In Generation 4, they trusted it to remain active 24/7 without supervision. Every technical step forward is, in substance, a small transfer of initiative from human to machine. But as the trust boundary expands, the radius of risk expands exponentially as well.

**Law 5: every disastrous lesson in one generation becomes an iron law in the next.**

AutoGPT's endless loops forced the structured orchestration of Generation 2. The delivery gap of Vibe Coding forced a shift toward evaluation-driven development. The Kiro incident, where production infrastructure was mistakenly deleted, established least privilege and cognitive isolation as hard norms. ClawHavoc's malicious poisoning pushed the industry toward OS-level sandbox isolation. Technical standards are rarely created because committees sit in meeting rooms and vote. More often, they are forced into existence by painful accidents, failures, and exploding bills. Every Agent disaster draws a red line for the architecture of the next generation.

**Law 6: the Agent ecosystem will repeatedly go through cycles of Cambrian explosion and mass extinction.**

This brutal cleansing mechanism is driven by three axes:

* **Mechanism 1: self-cannibalization from foundation-model upgrades.** Every native capability upgrade in a large model releases new demand for middle layers, giving rise to a batch of "patch industries." But as soon as the next-generation model has that capability natively, those patch industries instantly lose the legitimacy of their existence.
* **Mechanism 2: generational replacement of interaction paradigms.** When a lower-friction, more native interaction paradigm emerges, the previous generation's barrier-lowering tools turn into leftover complexity. Low-code and node-based orchestration are examples.
* **Mechanism 3: the fatal misjudgment of temporary tailwinds as moats.** Large numbers of products and startups stand in a brief technical window and mistake that window for structural advantage. Six months or a year later, the window closes, hot money leaves, and the project is swallowed by infrastructure.

***

# Epilogue: What Is the Real Moat?

When faced with repeated cycles of explosion and extinction, we have to confront the harshest question directly: **what is the moat in the AI Agent field?**

The real moat is not that you are the first to package some innovative capability that infrastructure has not yet internalized. It is this: **after that capability is fully internalized and swallowed by infrastructure, do you still retain irreplaceable strategic value?**

Concretely, that value settles in three directions:

1. **Absolute depth in a vertical domain:** your understanding of the real business process, compliance risk, exception handling, and responsibility boundaries of a specific industry is not something foundation models can easily swallow through short-term generalization from generic data. A niche, narrow entry point with deep vertical penetration often has a much longer survival cycle than a general-purpose agent.
2. **A unique data-feedback flywheel:** can you continuously accumulate high-quality user feedback data in real, high-value business scenarios, use it to iterate the product, and perhaps even build a proprietary fine-tuned or pretraining model that lets you outrun the pace of infrastructure self-cannibalization?
3. **An irreversible user trust relationship:** are users truly willing to entrust higher-value, longer-cycle, higher-risk-radius core tasks to your system, and thereby form deep business stickiness?

Once the tide of infrastructure fully internalizes and swallows the gains from innovation, the products that can remain standing and accumulate workflows, data flywheels, and responsibility boundaries are the real assets. Most other projects are only temporary bubbles.

From ChatGPT to the OpenClaw architecture, in just four years we have seen countless miracles appear, and countless disasters and capital frenzies vanish. AI Agent today is no longer merely a tool that extends human cognition. It is gradually turning into a digital entity with an independent cognitive loop, persistent identity memory, and a persistent sense of time.

But the closer we get to the frontier, the more cool-headed and clear-eyed we must remain. Progress in Agent technology means the simultaneous expansion of trust boundaries, risk radius, and governance difficulty.

A truly mature and great Agent system is not a black box that blindly pursues fully automatic execution. It is a system that knows, within the right boundaries, exactly when it should verify, when it should pause, and when it must ask for human confirmation.

As witnesses of this era, and especially as founders, we need even more urgently to understand the boundaries of the era, the boundaries of capability, and the boundaries of the product.
