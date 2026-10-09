---
url: /article/7-ai-agent-engineering-focus-points/index.md
---
::: note 本文已发表于 [InfoQ](https://xie.infoq.cn/article/e2743dea7c6be23740aae5ad8) 。
:::

很多人理解 AI Agent，是从“大模型 + Prompt”开始。

但当 AI 开始真正执行任务，事情很快就复杂起来：

它需要知道什么？

可以使用哪些工具？

出了问题怎么办？

什么时候应该停止？

多个任务又该怎么协同？

这也是 AI 工程正在发生的一种变化：

**工程师要解决的问题，已经逐渐从“怎么让模型回答得更好”，扩展到“怎么让整个系统可靠地完成任务”。**

可以把它理解成 7 个工程化关注点。

::: center



***

# 01｜基础模型：它能做什么？

Foundation Model

首先是模型本身。

不同模型的能力、上下文长度、工具调用能力、推理表现和失败模式都不同。

所以第一步不是给模型塞更多 Prompt，而是先弄清楚：

**这个模型到底适合做什么？**

***

# 02｜提示词：让它知道该做什么

Prompt Engineering

任务是什么？

有什么规则？

输出需要什么格式？

需要给哪些示例？

Prompt 解决的是**指令问题**。

好的 Prompt 会把任务目标和约束说清楚，让结果能够被判断和验证。

***

# 03｜上下文：让它知道现在需要什么

Context Engineering

模型知道“应该做什么”之后，还需要知道：

**完成下一步任务，需要哪些信息？**

可能是文档、历史记录、记忆、数据库结果，也可能是刚刚调用工具得到的数据。

Context Engineering 关注的就是这些信息如何被选择、组织和送入模型。

***

# 04｜运行环境：让它能够真正行动

Harness Engineering

到了这里，Agent 开始接触现实世界。

它可能需要调用 API、读写文件、操作数据库、使用浏览器或者运行代码。

这时候需要设计一套运行环境：

**工具、权限、状态、执行边界、日志，以及各种安全控制。**

模型负责生成决策，Harness 决定它能在什么环境里执行这些决策。

***

# 05｜反馈循环：做错了怎么办？

Loop Engineering

真正的 Agent 不应该一次回答就结束。

它可能需要：

**行动 → 检查 → 修正 → 再行动**

例如写代码之后运行测试，测试失败后修改代码，再次运行测试。

因此系统还需要明确：

什么时候继续？什么时候重试？什么时候停止？什么时候交给人处理？

这就是 Loop Engineering 关注的问题。[相关工程讨论](https://xie.infoq.cn/link?target=https%3A%2F%2Fblog.paulserban.eu%2Fpost%2Fagent-harness-engineering-loop-engineering-and-graph-engineering-the-architecture-of-reliable-ai-agents%2F)通常把它与 Harness 区分开：

Harness 更关注 Agent 所处的运行环境，Loop 更关注行动、反馈和恢复过程。

***

# 06｜任务协同：复杂工作怎么拆？

Graph Engineering

一个复杂任务往往不是一条直线。

它可能需要：

**拆分任务 → 并行执行 → 汇总结果 → 验证 → 进入下一步**

这时候，系统需要明确任务之间的依赖、分支、合并和状态。

Graph Engineering 关注的就是：

**怎样把多个步骤、Agent 和执行状态组织成一个可以运行的系统。**

2026 年 8 月发布的[相关综述](https://xie.infoq.cn/link?target=https%3A%2F%2Farxiv.org%2Fabs%2F2608.21156)正是从这里进一步讨论 System Intelligence：当任务超过单个 Agent 的组织能力时，问题就从单个 Agent 的能力转向系统如何组织和协调。

***

# 07｜共同理解：大家说的到底是不是一回事？

Ontology Engineering

最后一个问题很容易被忽略。

假设一个系统里出现：

**Customer、Order、Approval、Completed**

大家真的知道这些词是什么意思吗？

“客户”包括什么？

什么状态算“已审批”？

什么条件才算“订单完成”？

如果不同 Agent、不同流程对这些概念理解不同，系统依然可能出错。

Ontology Engineering 关注的，就是**实体、关系、状态和业务规则的共同定义**。

[近期相关研究](https://xie.infoq.cn/link?target=https%3A%2F%2Farxivsignals.io%2Fpapers%2F2608.21156)把 Ontology Engineering 放在 Graph Engineering 之上，作为不同 Agent 和不同图结构之间的共享语义层。

***

# 从“会回答”到“能完成任务”

把这 7 个问题放在一起看，会发现一个很明显的变化：

**模型解决能力，Prompt 解决指令，Context 解决信息，Harness 解决行动，Loop 解决反馈，Graph 解决协同，Ontology 解决共同理解。**

它们也不是严格的一层套一层。

一个简单的问答可能只需要模型、Prompt 和 Context；任务越复杂，越需要运行环境、反馈机制、任务协同和统一语义。

所以，当 Agent 出现问题时，先别急着换模型、改 Prompt。

**模型答错，可能只是表象。**

可能缺信息，可能权限不对，可能工具失败，可能没有验证机制，可能任务流程设计有问题，也可能系统里的“完成”本身就没有定义清楚。

这也是 AI Agent 工程正在发生的一个变化：

> **从调一个模型，走向设计一个系统。**
