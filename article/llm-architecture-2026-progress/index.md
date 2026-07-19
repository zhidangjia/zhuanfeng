---
url: /article/llm-architecture-2026-progress/index.md
---
### 从Gemma 4到DeepSeek V4：新一代开放权重的大模型如何降低长上下文成本？

2026上半年，密集发布的开放权重大模型最突出的趋势是：新一代模型架构全部围绕**长上下文效率**展开优化。

随着推理模型与Agent工作流需要在更长时间内保留更多Token，KV缓存规模、内存数据传输、注意力计算开销，很快就成为系统的主要瓶颈。为此，大模型研发人员引入了越来越多架构层面的优化技巧来削减上述开销。

本文主要讨论以下几个典型案例：

* Gemma 4的KV共享与逐层Embedding
* Laguna XS.2逐层注意力预算（Layer-wise Attention Budgeting）
* ZAYA1-8B压缩卷积注意力，
* DeepSeek V4的mHC+压缩注意力组合。

这些改动大多只是一些看似不起眼的小调整；但实际上，其中不少都是相当复杂的架构设计变化，值得进行更深入的讨论。

![img](https://picx.zhimg.com/80/v2-6532adcce331ac0ce233370e414aebf0_1440w.jpg?source=ccfced1a)

图1：2026年4–5月主流开源权重大模型架构总图。图中未列出全部模型规模；例如，Qwen3.6包含27B与35B-A3B变体，ZAYA1仅展示8B版本（不含基础版与推理专用基础版）。虚线框内架构为本文重点讲解对象。

需要说明的是，本文关注的是**模型架构设计**，因此不会展开数据集配比、训练调度、后训练细节、强化学习方案、基准测试跑分、产品横向对比等内容。即便只聚焦于架构层面，仍然有大量内容需要讨论。因此全文将仅聚焦Transformer模块、残差流（Residual Stream）、KV缓存以及注意力计算（Attention Computation）内部发生了哪些变化。

## 一、跨层复用KV张量，缩减KV缓存占用（Gemma 4）

我们先回到 4 月初，当时 Google 发布了新一代开放权重模型**Gemma 4**系列。该系列主要包含三类模型：

Gemma 4 E2B / E4B：面向移动端、嵌入式物联网设备（IoT）的轻量化模型；

Gemma 4 26B MoE混合专家模型：主打本地推理高效性；

Gemma 4 31B稠密模型：面向最高模型质量以及更便于后训练（由于 MoE 模型训练和微调更复杂）。

![img](https://pica.zhimg.com/80/v2-3601b176db53c17a304249e34759547b_1440w.png?source=ccfced1a)

图2：Gemma 4架构图

E2B 和 E4B 两个版本首先引入了一项小幅架构改进：采用共享KV Cache机制。具体来说，后续 Transformer 层会复用前面层已经计算好的 Key-Value（KV）状态，从而降低长上下文场景下的内存占用和计算开销。

需要说明的是，KV 共享并不是 Gemma 4 首创。例如，Brandon 等人在论文\*\*《》（NeurIPS 2024）\*\*中就提出了这一思想。不过，这是第一次看到这一概念被应用到一款主流模型架构中。

在进一步介绍 KV 共享之前，我们先简单说明一下它背后的动机。

目前 LLM 架构设计的一个重要方向，就是**缩减 KV Cache 的规模**。而缩减 KV Cache 的根本目的，是降低模型运行所需的内存占用，从而支持更长的上下文长度。这一点在推理模型和Agent日益普及的今天尤为重要。

以一个经典例子（Gemma 4 目前仍在采用）来说，**Grouped Query Attention（分组查询注意力，GQA）**已经通过让多个**Query（Q）头**共享同一组\*\*Key（K）**和**Value（V）\*\*头，来降低 KV Cache 的大小，如下图所示。

![img](https://picx.zhimg.com/80/v2-a09470d067ccdb42f588757a641c5d9b_1440w.png?source=ccfced1a)

图3：GQA通过让多个 Query（Q）头共享同一组 Key（K）和 Value（V）头，减少 KV Cache 的存储需求。

前面提到，Gemma 4 本身采用了 GQA。不过，除了 GQA 内部针对 Query 的 KV 共享之外，Gemma 4 还进一步实现了**跨层共享 KV 投影（KV Projections）**：不同 Transformer 层之间共享 K 和 V 投影，而不是像传统 Transformer 那样，每一层的注意力模块都重新计算一次。这种 KV 共享方案，也称为**Cross-layer Attention（跨层注意力）**，如下图所示。

![img](https://picx.zhimg.com/80/v2-31b9924db6852fe6849ac0808379858d_1440w.png?source=ccfced1a)

图 4：传统 Transformer 模块（左）会在每个注意力模块中分别计算独立的 Q、K、V 投影；跨层注意力（右）则让多个 Transformer 层共享同一组 K、V 投影。

如图2的架构概览所示，Gemma 4 E2B采用了普通GQA与滑动窗口注意力（Sliding-window Attention） 按4:1的比例交替排列。（更准确地说，Gemma 4 E2B实际采用的是MQA，它可以视为GQA在仅保留一个KV头情况下的特殊形式。）

在GQA（或 MQA）的基础上，Gemma 4的跨层KV共享机制工作方式如下：

后续Transformer层不再计算自己的Key和Value投影，而是直接复用同一种注意力类型中，距离最近的前一个非共享层已经计算好的KV Tensor。

换句话说：

滑动窗口注意力层复用前一个滑动窗口注意力层生成的KV；

全局注意力层复用前一个全局注意力层生成的KV。

不过，每一层仍然会计算自己的 Query 投影。因此，每一层依旧能够形成各自不同的注意力模式，而真正计算量大、内存占用高的KV Cache则可以在多个Transformer 层之间复用。

以 Gemma 4 E2B为例，它包含35个Transformer层，其中只有前15层计算自己的KV投影；最后20层都复用同类型最近一个非共享层生成的KV Tensor。

类似地，Gemma 4 E4B共包含42层，其中24层计算自己的KV，而最后18层则采用共享机制。

那么，这种设计究竟能节省多少资源？

由于大约有一半Transformer层共享了KV，因此KV Cache的存储规模也大约减少了一半。

对于最小的E2B模型，在128K长上下文、bfloat16精度下，可节省约2.7 GB的KV Cache内存，如下图所示。（对于E4B，在相同条件下约可节省6GB。）

![img](https://picx.zhimg.com/80/v2-1ea703beb6e7ca2431d648a5d52f27a9_1440w.png?source=ccfced1a)

图5：Gemma 4 E2B类似配置下，GQA与跨层KV共享带来的 KV Cache内存节省效果。为简化展示，图中未包含滑动窗口注意力带来的额外节省。

当然，KV共享的代价在于，它本质上是一种近似（Approximation）。

更准确地说，它降低了模型的表达能力，因为部分Transformer层不再拥有独立的K、V 表示。

不过，根据Cross-layer Attention论文的实验结果，对于其测试的小规模模型而言，这种影响可以非常有限。

## 二、逐层Embedding（PLE）：Gemma 4如何实现“有效参数规模”设计

Gemma 4 的 E2B和E4B版本还引入了第二项以效率为导向的设计——逐层 Embedding（Per-layer Embeddings，PLE）。这一机制与前面介绍的KV 共享（KV Sharing） 是彼此独立的。

KV共享的目标是缩减KV Cache；而PLE的目标则是提高参数效率。它使小型Gemma 4模型能够利用更多与Token相关的信息，同时又无需像拥有相同总参数规模的稠密模型（Dense Model）那样，将整个 Transformer主干（Stack）的计算成本提高到同一水平。

例如，Gemma 4 E2B和E4B中的E表示Effective（有效）。

具体来说，Gemma 4 E2B标称拥有23 亿（2.3B）有效参数（Effective Parameters）；如果将Embedding参数也计算在内，则总参数量达到51 亿（5.1B）。同样，Gemma 4 E4B标称45亿（4.5B）有效参数，包含Embedding后的总参数量则达到 80 亿（8B）。

简而言之，在这些E系列模型中，Transformer主干的实际计算规模更接近前者（较小的有效参数规模），而后者（较大的总参数规模）则包含了额外的Embedding表（Embedding Table）参数。

从概念上来看，PLE引入了一条新的计算路径，如下图所示。

![img](https://pica.zhimg.com/80/v2-c6ff7d6bacd0f1753408f51e85bbc33b_1440w.jpg?source=ccfced1a)

图6：加入PLE残差路径后的 Gemma 4模块（简化示意图）。标准Transformer模块首先完成注意力分支和前馈网络分支的残差更新；随后，得到的隐藏状态（Hidden State）用于控制（Gate）该层对应的PLE向量。经过线性投影后，PLE更新会作为额外的一次残差更新，加到模块末尾。

PLE向量本身是在重复堆叠的Transformer模块之外预先构建好的。

简化来看，PLE的构建包含两个输入来源：

第一，Token ID会经过一次逐层Embedding查表（Per-layer Embedding Lookup）；

第二，普通的Token Embedding会经过一次线性投影，映射到同一个打包后的PLE空间（Packed PLE Space）。

随后，这两部分结果相加、缩放，并重新调整形状，形成一个Tensor，其中包含每个Transformer层对应的一份切片。

需要注意的是，每个Transformer模块最终只会接收到属于自己的那一份切片。

![img](https://picx.zhimg.com/80/v2-7bd2a995cfcfb6b6fb9e7753f268f742_1440w.jpg?source=ccfced1a)

图7：PLE的构建过程（简化示意图）。Token ID提供逐层 Embedding查表结果；普通 Token Embedding被投影到相同空间；两部分结果融合后重新组织，使每个Transformer 模块都能获得属于自身的一份逐层PLE切片。

这里最重要的一点是，PLE并不会为每个Transformer模块都复制一整套普通Token Embedding层。

相反，逐层Embedding查表只执行一次。随后，如前所述，它会通过 “reshape / select layer l” 操作，为每一层提供一个较小的、与Token相关的Embedding切片。

也就是说，对于每一个输入Token，Gemma 4都会预先生成一个打包后的PLE Tensor，其中包含了每个 Decoder层对应的一小段向量。

在前向传播过程中，第 l 层只会取出属于自己的那一份切片（即图6代码中Gemma4WithPLEBlock的 ple\_l）。

在Transformer模块内部，常规的注意力分支和前馈网络分支仍然按照原有方式执行。

首先，模块计算注意力分支产生的残差更新；随后计算前馈网络分支的残差更新。

完成第二次残差相加之后，得到的隐藏状态（即图 6 伪代码中记为**z**的变量）会作为门控信号，作用于该层对应的PLE向量。

经过门控后的PLE向量会被重新投影回模型隐藏维度，随后进行归一化，最后作为一次额外的残差更新加入当前模块的输出。

因此，一个比较容易理解的思维模型是：

Transformer模块的主体结构——注意力分支和前馈网络分支——保持不变；Gemma 4只是在前馈网络之后，额外加入了一条小型的、与当前层对应的Token向量更新路径。

这种设计通过增加Embedding参数以及少量投影层，提高了模型的表示能力。虽然会带来一定的额外计算开销，但相比将整个Transformer主干扩展到更大的参数规模，其成本要低得多。

那么，为什么要采用PLE呢？

一种更简单的方案，是直接缩小稠密模型，例如减少Transformer层数、缩小隐藏维度，或者缩减前馈网络（FFN）的规模。这样确实能够降低内存占用和推理延迟，但与此同时，也会削弱模型主要计算部分的表达能力。

而PLE的设计思路则不同。它让计算成本最高的Transformer模块保持在较小的有效参数规模，同时将额外的模型容量存放到逐层Embedding表中。相比增加更多注意力权重或 FFN 权重，这些逐层Embedding的使用成本要低得多，因为它们本质上主要是查表式参数，并且可以进行缓存。

当然，目前我们只能暂时相信 Google 的结论，即这种设计确实有效且值得采用。

如果未来能看到一些对比实验，例如将 Gemma 4 E2B与普通Gemma 4 2.3B模型以及普通Gemma 4 5.1B模型进行直接比较，将会非常有参考价值。

此外，从原理上来说，PLE并不仅限于小模型。我们同样可以为更大的模型加入逐层Embedding切片。不过，大型模型本身已经拥有足够高的表示能力，因此这些额外的Embedding带来的收益可能不会太明显。

另一方面，对于大型模型，我们通常已经采用混合专家（MoE）架构来提升模型容量，同时尽量控制计算成本，因此PLE的优势也就没有那么突出。

## 三、逐层注意力预算（Layer-wise Attention Budgeting，Laguna XS.2）

Laguna是欧洲公司Poolside发布的首个开放权重模型。Poolside专注于训练面向代码生成应用的大语言模型。下图所示的Laguna XS.2架构乍一看相当传统。不过，有一个细节没有画进架构图中（或者说，没有设法把它塞进去），那就是我们可以称之为逐层注意力预算（Layer-wise Attention Budgeting）的设计理念。

![img](https://picx.zhimg.com/80/v2-874f5ba565da9ab2c2c30bef0220fe90_1440w.jpg?source=ccfced1a)

图8：Poolside的Laguna XS.2 架构。

这里所谓的注意力预算，核心思想是：并非为每一个Transformer层都分配相同的完整注意力预算，而是根据不同层的特点，动态调整各层的注意力计算成本。

Laguna XS.2共包含 40 个 Transformer 层，其中：

30 层采用滑动窗口注意力；

10 层采用全局注意力（Global Attention，也称 Full Attention）。

与通常一样，滑动窗口注意力层只关注局部窗口内的Token（这里窗口大小为512 个 Token），因此能够有效降低KV Cache的规模以及注意力计算成本。相比之下，全局注意力层的计算开销更高，但它能够访问整个上下文窗口中的所有信息，从而保留模型的全局建模能力。

这种滑动窗口注意力 + 全局注意力相结合的设计，并不是Laguna XS.2独有的。许多模型架构（包括 Gemma 4）都采用了类似方案。

不过，Laguna XS.2的新颖之处在于，它引入了逐层不同的Query Head数量（Per-layer Query-head Counts）。例如，在Hugging Face的中，可以看到一个名为num\_attention\_heads\_per\_layer的配置项，它允许不同Transformer层使用不同数量的Query Head，同时保持KV Head的结构一致，从而保证KV Cache的形状保持兼容。

![img](https://picx.zhimg.com/80/v2-9609410b93c8e50e20cf975b6738ac71_1440w.jpg?source=ccfced1a)

图9：Laguna的逐层Query Head预算分配。全局注意力层中，每个KV Head对应6个 Query Head；滑动窗口注意力层中，每个KV Head对应8个 Query Head。

因此，在Laguna XS.2中：

滑动窗口注意力层分配了更多的Query Head；

全局注意力层则分配了更少的Query Head；

与此同时，KV Head的数量始终固定为8个。

这正是配置文件中真正实现的逐层Head预算分配（Layer-wise Head Budgeting）。

Laguna XS.2是近期开放权重模型中，采用这种逐层Query Head预算分配设计最具代表性的案例之一。

不过，更广义地说，根据不同Transformer层调整模型容量这一思想，至少可以追溯到Apple于2024年发布的。

那么，这种设计究竟有什么意义？

与前面介绍的KV共享类似，其核心思想都是：将有限的注意力资源投入到最有价值的地方，而不是让所有Transformer层都拥有完全相同的预算。

具体而言，全局注意力层由于需要访问整个上下文，因此本身计算成本已经很高，所以Laguna为这些层配置了较少的Query Head；而计算成本较低的滑动窗口注意力层，则可以配置更多的Query Head。

此外，还有一个相对较小的实现细节：Laguna还采用了按Head的注意力输出门控（Per-head Attention-output Gating）。这一机制与Qwen3-Next等模型中的做法较为类似。

## 4. 压缩卷积注意力（Compressed Convolutional Attention，CCA，ZAYA1-8B）

与 Laguna 类似，**ZAYA1-8B**也是开放权重模型领域的一位新成员。它由开发，而此次发布的一个值得关注的细节是：该模型是在 AMD GPU 上完成训练的，而不是目前更为常见的 NVIDIA GPU（或 Google TPU）平台。

不过，从架构角度来看，更值得关注的是它采用了**压缩卷积注意力（Compressed Convolutional Attention，CCA）**，并结合 Grouped Query Attention（分组查询注意力，GQA） 使用。与 DeepSeek 系列模型中的 Multi-head Latent Attention（多头潜在注意力，MLA）不同，CCA 并不是仅将潜在表示（Latent Representation）作为一种紧凑的 KV Cache 存储格式，而是直接在压缩后的潜在空间（Compressed Latent Space）中完成注意力计算。

顺便提一句：ZAYA1-8B 的中列出了 80 个交替排列的层（Layer），而不是传统意义上的 40 个 Transformer 模块。这些层在 CCA/GQA 注意力层与 MoE 前馈层之间交替排列。不过，为了便于展示架构图，本文将其表示为 40 个重复的「注意力 + MoE」模块，两种表示方式在概念上是等价的。

![img](https://pic1.zhimg.com/80/v2-ba160e6559e3eeb128a99614b8efc2b7_1440w.jpg?source=ccfced1a)

图 10：ZAYA1（8B）架构示意图，其 Transformer 模块采用压缩卷积注意力（CCA）。

如图所示，ZAYA1-8B 采用 CCA，并结合 4:1 的 GQA 布局。这里最关键的一点在于，它的注意力模块建立在 CCA 之上，而不是传统的滑动窗口注意力（Sliding-window Attention）。

那么，什么是压缩卷积注意力（CCA）？

从设计理念上来看，CCA 与 DeepSeek 的 MLA 有一定相似之处，因为两者都在注意力模块中引入了压缩后的潜在表示（Compressed Latent Representation）。不过，它们对这一潜在空间的利用方式并不相同。MLA 的主要目标是缩减 KV Cache。在 MLA 中，KV Tensor 会以压缩形式存储，然后在真正执行注意力计算之前，再投影到注意力 Head 对应的表示空间。

![img](https://picx.zhimg.com/80/v2-a83524be85991b72289fe8549db4ea3a_1440w.jpg?source=ccfced1a)

图 11：传统多头注意力（MHA）与多头潜在注意力（MLA）对比。

CCA 则采取了不同的思路。它首先对 Q、K、V 全部进行压缩，然后直接在压缩后的潜在空间中执行注意力计算。正因为如此，CCA 不仅能够减少 KV Cache 的大小，还能够降低预填充阶段以及训练阶段的注意力计算 FLOPs（浮点运算量）。

![img](https://picx.zhimg.com/80/v2-a68ac0a4b47b2a57708575336a7637b8_1440w.jpg?source=ccfced1a)

图 12：多头潜在注意力（MLA）与压缩卷积注意力（CCA）对比。

如图 12 所示，在 CCA 中，压缩后的潜在表示会直接进入注意力计算过程，得到的压缩注意力向量随后再通过升维投影（Up-projection）恢复到模型所需的表示空间。

需要注意的是，它之所以称为 CCA，而不是简单的压缩注意力，是因为其中还加入了一步额外的卷积混合（Convolutional Mixing）。由于篇幅限制，图 13 中没有画出这一部分，否则整个示意图会显得过于拥挤。不过，这一机制本身并不复杂。

正如图 12 所暗示的那样，卷积混合直接作用于压缩后的 Q 和 K Tensor。这样设计的原因在于：

虽然压缩可以让 Q、K、V 的维度更低，从而减少计算量和缓存开销，但与此同时，也可能削弱注意力机制的表达能力。因此，在计算注意力分数之前，CCA 利用卷积操作，以较低的成本为压缩后的 Q 和 K 引入更多的局部上下文信息。

需要说明的是，卷积混合只作用于 Q 和 K，而不会作用于 V。原因是：

Q 和 K 决定了注意力分数的计算；V 表示最终通过这些注意力分数进行加权平均的内容本身。

![img](https://pic1.zhimg.com/80/v2-c609c2def570f7af8059bde713ae961c_1440w.jpg?source=ccfced1a)

图 13：序列混合卷积（Sequence-mixing Convolution）的概念示意图

除了图 13 所示的序列混合（Sequence Mixing）之外，CCA 还包含一个通道混合（Channel Mixing）模块。不过，两者在原理上比较相似，因此这里不再单独绘制示意图。

CCA 看起来是 Zyphra 提出的原创注意力机制，其出现时间甚至早于。介绍这一机制的独立论文最早发表于 2025 年 10 月，首次正式提出了 CCA。随后，ZAYA1-8B 将其作为模型架构中的核心组成部分之一。

那么，一个自然的问题就是：**CCA 是否优于 MLA？**

根据 CCA 论文作者自己的实验结果，答案是肯定的。在相同压缩比例的设置下，他们报告 CCA 的性能优于 MLA。

![img](https://picx.zhimg.com/80/v2-e719999d6df0d66f3df910e7ecae4d88_1440w.jpg?source=ccfced1a)

图 14：CCA 论文中的标注图示。来源：https://arxiv.org/abs/2510.04476

总体而言，这部分最值得关注的，还是全新的注意力机制本身。

当然，ZAYA1-8B 还采用了一种相当激进（即非常稀疏）的 MoE 架构，每个 Token 在推理过程中仅激活一个路由专家。不过，这类设计如今已经比较常见。

相比之下，CCA 更具新意，因为它直接在压缩后的潜在空间中完成注意力计算，并通过对压缩后的 Q 和 K 进行卷积混合，弥补压缩表示可能带来的表达能力损失。

因此，可以说，ZAYA1-8B 不仅试图降低前馈网络的计算开销，也在注意力机制本身上进一步减少了计算成本。

## 5. CSA/HCA、mHC 与压缩注意力缓存（Compressed Attention Caches，DeepSeek V4）

DeepSeek V4 是今年迄今为止最重磅的发布，无论是市场关注度还是模型规模都创下新高。值得注意的是，从下表可以看到，DeepSeek V4-Pro 也是其中参数激活比例（active-parameter share）最低的 MoE 模型，即在所有参数中，推理时实际激活的参数占比最低。

![img](https://pic1.zhimg.com/80/v2-a4d25509a43f0d2d2e59993fdb15077d_1440w.jpg?source=ccfced1a)

图15： MoE 模型的参数激活比例（Percent Active Parameter）对比

需要说明的是，参数激活比例只是衡量模型效率的一个维度。 它并不能反映 KV Cache 大小、注意力模式、上下文长度、路由开销、硬件执行效率或训练质量等因素。但作为比较稀疏模型的快速指标，它仍然具有参考价值。

关于 DeepSeek V4，还有很多值得讨论的内容。不过，由于它已经获得了大量关注，同时为了聚焦本文的主题——模型架构改进，下面主要介绍与以往架构相比新增的两个最重要的部分：

**mHC（Manifold-Constrained Hyper-Connections）**：用于构建更宽的残差路径（Residual Pathway）；

**CSA/HCA**：用于长上下文注意力压缩与稀疏化。

从下面的 DeepSeek V4 架构图来看，整个系统似乎相当复杂。更容易理解的方法，是把它拆分成两个部分来看：

残差路径（Residual Path）上的改动：mHC

注意力路径（Attention Path）上的改动：CSA/HCA 与压缩注意力缓存（Compressed Attention Caches）

![img](https://pic1.zhimg.com/80/v2-c33d3c10cbce1aee38accc951c6f9e70_1440w.jpg?source=ccfced1a)

图16： DeepSeek V4-Pro 架构概览

### 5.1 流形约束超连接（Manifold-Constrained Hyper-Connections，mHC）

先来看 DeepSeek V4 中的**mHC**。

这一技术最早来自 DeepSeek 团队去年（2025 年 12 月 31 日）发布的论文。不过，当时论文仅在一个**27B**参数的实验模型上进行了验证。而如今，它已经出现在 DeepSeek 的旗舰模型中，这说明这一方案已经足够成熟，能够真正应用于生产环境。

mHC 的核心思想，是重新设计 Transformer 模块内部的残差连接（Residual Connections）。

这一点令人耳目一新，因为近年来 Transformer 的架构改进大多集中在：

注意力机制

归一化层的放置方式

MoE 结构

而很少有人去重新设计残差连接本身。

实际上，mHC 建立在之前提出的 Hyper-Connections（超连接） 工作之上（参见 Zhu 等人在 2024 年发表的），因此先简单介绍一下 Hyper-Connections。

Hyper-Connections 的核心思想，是将 Transformer 模块内部原本只有一条残差流（Residual Stream），扩展为多条并行残差流，并在这些残差流之间加入可学习的映射（Learned Mappings）。

可以把 Hyper-Connections 理解为将残差流加宽。模型维护多条并行的残差流，同时增加一个 Res Mapping 线性变换，在不同层之间对这些残差流进行混合。由于 Attention 层和 MoE 层本身仍然工作在原始隐藏维上，因此 Hyper-Connections 又增加了两组映射：

**Pre Mapping**：将多条残差流合并成一条标准隐藏向量，供 Attention 或 MoE 层使用；

**Post Mapping**：将层输出重新分配回多条并行残差流。

这一过程如下图所示。

![img](https://picx.zhimg.com/80/v2-071f2c7476945915dc9a7a1f9e47f9c5_1440w.jpg?source=ccfced1a)

图17： 普通 Transformer 模块（上）与采用 Hyper-Connections 的 Transformer 模块（下）。图片基于 mHC 论文（https://arxiv.org/abs/2512.24880）进行了标注。

图中主要展示的是 Transformer 模块中 Attention 层对应的部分，但同样的思想也适用于围绕 MoE 层的另一条残差分支。

Hyper-Connections 的目的，是在不增加 Attention 或 MoE 层宽度的情况下，使残差路径具有更强的表达能力。其额外 FLOPs 开销非常小，因为新增映射操作是在较小的残差流维度上进行的，例如 DeepSeek V4 中的 n=4，而不是在巨大的隐藏维度上执行。

在最初的 Hyper-Connections 论文中，以 7B OLMo MoE 实验为例，每个 Token 的 FLOPs 从 13.36G 增加到 13.38G，几乎没有变化。论文报告的性能提升虽然不算巨大，但具有稳定的一致性，如下图所示。

（不过，仅仅观察 FLOPs 其实有些片面。扩展后的残差状态仍然需要存储、在内存中传输以及进行混合，因此实际开销更多可能来自内存带宽和工程实现复杂度，而非纯计算量。这一点论文并未直接测量。不过，考虑到 DeepSeek V4 整体都围绕效率进行设计，这项改动显然是值得的。）

![img](https://picx.zhimg.com/80/v2-f3517fffcbed862751b4a57f34aa061e_1440w.jpg?source=ccfced1a)

图18： Hyper-Connections 与基线模型的性能对比。图片基于 Hyper-Connections 论文（https://arxiv.org/abs/2409.19606）进行了标注。

此外，从图中还可以看到，Hyper-Connections 大约只需基线模型一半左右的训练 Token，便能达到相同的性能水平。

从普通 Hyper-Connections（HC） 到 Manifold-Constrained Hyper-Connections（mHC），最大的变化在于：映射不再是无约束的。在普通 HC 中，Res Mapping 是一个可学习矩阵，用于混合多条残差流。但当大量这样的矩阵连续堆叠时，信号可能会被不断放大，也可能不断衰减，导致数值行为难以控制。

mHC 则将这一残差映射投影到双随机矩阵（Doubly Stochastic Matrix）流形（Manifold）上。也就是说：

所有元素均为非负；

每一行元素之和等于 1；

每一列元素之和也等于 1。

这样，残差流之间的信息交换更像是一种稳定的信息重新分配，而不是任意的放大或缩小。与此同时，Pre Mapping 和 Post Mapping 也被约束为非负且有界，这样可以避免在读取和写回扩展后的残差状态时发生相互抵消。简而言之，mHC 保留了 HC 更丰富的残差信息混合能力，同时通过这些约束提高了数值稳定性。这一点对于规模更大、层数更深的模型尤为重要。

除此之外，mHC 的整体思想仍然是利用多条并行残差流，如下图所示。

![img](https://picx.zhimg.com/80/v2-61efec85c6900aba564af278fd42f87f_1440w.jpg?source=ccfced1a)

图19： Hyper-Connections（HC）与 Manifold-Constrained Hyper-Connections（mHC）的 Transformer 模块。图片基于 mHC 论文（https://arxiv.org/abs/2512.24880）进行了标注。

在 mHC 论文中，DeepSeek 团队基于 27B 参数模型进行实验。采用融合、重计算以及流水线调度等优化后，在所有 Transformer 模块中使用 4 条残差流（n=4），相比单残差流基线模型，训练时间仅增加 6.7%。

总结来说，HC/mHC 的主要作用，是通过将原本的一条残差流替换为多条能够相互交互的残差流，从而改变信息在 Transformer 模块中的传递方式。mHC 又进一步加入稳定性约束，在几乎不增加计算开销的情况下，实现了更丰富的残差信息表达。此外，它与后文介绍的 CSA/HCA 十分契合，因为后者修改的是 Transformer 模块中的另一部分——注意力机制。

### 5.2 基于 CSA 与 HCA 的压缩注意力

DeepSeek V4 的另一项重要架构改进发生在注意力机制上。其出发点依然是：当上下文长度非常大时，注意力计算的成本不仅来自注意力分数的计算，KV Cache 也会随着序列长度不断增长，成为主要开销之一。为了解决这一问题，DeepSeek V4 采用了一种结合两种压缩注意力机制的方案：

CSA（Compressed Sparse Attention）

HCA（Heavily Compressed Attention）

首先需要强调的是，DeepSeek V4 中的 CSA/HCA，与 DeepSeek V2/V3 所采用的 MLA 属于不同维度的压缩方式。MLA 的主要思路，是压缩每个 Token 对应的 KV 表示；而 CSA 与 HCA 压缩的是序列维度（sequence dimension），也就是说，它们不再为历史中的每一个 Token 都保留一个完整（或压缩后的）KV 条目，而是将一组 Token 汇总为数量更少的压缩 KV 条目。因此，KV Cache 本身的长度也随之缩短。DeepSeek V4 同时也采用了紧凑型压缩条目（Compact Compressed Entries）以及共享 KV 注意力（Shared-KV Attention），但与 MLA 最大的区别仍然是：它压缩的是序列长度，而不是单个 Token 的表示。如下图所示：

![img](https://picx.zhimg.com/80/v2-965b5a2ca244ee7d1b47bd7722bf6fef_1440w.jpg?source=ccfced1a)

图20： MLA、CSA 与 HCA 的概念性比较。MLA 压缩的是每个 Token 的潜在 KV 表示，但仍然为每个 Token 保留一个潜在 KV 条目；CSA 以 m=4 对序列进行较轻度压缩，并结合稀疏 Top-k 选择；HCA 则采用 m'=128 的高压缩率，大幅缩短序列，并在更短的缓存上执行稠密注意力。

CSA/HCA 与 MLA 在模型质量上的权衡也有所不同。如图所示，MLA 虽然压缩了每个 Token 存储的表示，但仍然保留每个 Token 一个 KV 条目。CSA，尤其是 HCA，则进一步减少了序列中的 KV 条目数量。因此，它们牺牲了一部分 Token 级别的信息，以换取显著降低的长上下文计算成本。

归根结底，它们的目标仍然是降低长上下文成本。但如果压缩过于激进，也可能影响模型建模质量。因此，DeepSeek V4 并没有只采用一种压缩方案，而是交替使用 CSA 与 HCA。其中：

CSA 采用较低的压缩率，并结合类似 DeepSeek Sparse Attention（DSA） 的选择器；

HCA 则采用更高的压缩率，以更低成本提供全局信息覆盖；

两者都保留了一条局部滑动窗口分支，用于保存最近未压缩的 Token。

CSA 中的稀疏选择机制建立在 DSA 基础之上。

HCA 是两者中更激进的一种方案。它将每 128 个 Token 压缩为一个 KV 条目，随后在这些高度压缩后的 KV 条目上执行稠密注意力（Dense Attention）。换句话说：

CSA 保留更多细节，但采用稀疏选择；

HCA 保留的条目更少，因此可以在整个压缩缓存上执行稠密注意力。

如下图所示：

![img](https://pica.zhimg.com/80/v2-132bd1d5c3612e077256ffaf84dc6977_1440w.jpg?source=ccfced1a)

图21： CSA 从压缩后的历史块中选择一个稀疏子集进行注意力计算；HCA 则在压缩率更高的历史块上执行稠密注意力。两种机制都通过 128 Token 滑动窗口保留最近未压缩的 KV 条目。

正因为两者具有互补性，DeepSeek V4 采用的是交替插入 CSA 与 HCA 层，而不是只使用其中一种。

DeepSeek V4 论文报告称，在 100 万 Token 上下文长度下，相比采用 MLA 与 DSA 的 DeepSeek V3.2：

DeepSeek V4-Pro 的单 Token 推理 FLOPs 仅为其 27%，KV Cache 大小仅为 10%；

DeepSeek V4-Flash 则进一步降低至 10% 的推理 FLOPs 和 7% 的 KV Cache 大小。

![img](https://pica.zhimg.com/80/v2-92041545b0d10e24bfe92bbd5ca8d2be_1440w.jpg?source=ccfced1a)

图22： DeepSeek V4 论文报告的 100 万 Token 上下文效率数据（相对于 DeepSeek V3.2）

顺便说明一下，不建议笼统地认为 CSA/HCA 一定优于 MLA。CSA/HCA 更像是一种针对超长上下文优化的高压缩设计，而且实现复杂度也更高。遗憾的是，论文并未提供消融实验，因此目前还无法明确判断各项改进分别带来了多大贡献。总体来看，论文展示了非常优秀的整体建模结果。例如：

DeepSeek V4-Flash-Base 在多数基础模型基准测试中超过了 DeepSeek V3.2-Base；

在 100 万 Token 检索任务上也取得了优异表现。

不过，需要注意的是，这些结果来自完整的 DeepSeek V4 技术方案，其中不仅包括 CSA/HCA，还包括：

更高质量的训练数据；

基于 Muon 的优化器；

mHC；

精度与存储优化；

训练与推理系统层面的改进。

因此，就目前而言，可更倾向于将 CSA/HCA 看作是一种以长上下文效率为核心目标的架构设计。它在 DeepSeek 的大型旗舰模型中，看起来能够较好地保持模型质量，但并不能据此认为它在所有场景下都普遍优于 MLA。

## 6. 总结

总体来看，今年一个值得关注的趋势是：大多数新的开放权重模型都在努力降低长上下文推理成本，而不是简单地通过缩小模型总参数规模来实现效率提升。 例如：

Gemma 4 通过跨层 KV 共享（Cross-layer KV Sharing）降低了 KV Cache 的内存占用，并利用逐层嵌入增加模型容量。

Laguna XS.2 调整了各层所分配的注意力容量。

ZAYA1-8B 将注意力计算迁移到压缩后的潜在空间中。

DeepSeek V4 引入了受约束的残差流混合以及面向长上下文的压缩注意力。

所有这些改进都增加了模型架构的复杂性，而这似乎正是当前 LLM 架构的发展方向。

最大的体会是：Transformer 模块仍在不断演进，但这种演进已经变得更加有针对性。它的基本框架仍然建立在最初 GPT 解码器式 Transformer（Decoder-only Transformer） 架构之上，但其中的许多组成部分已经得到升级或被替换，并且越来越针对更长的上下文和更高效的推理进行了专门优化。与此同时，模型建模能力的提升，似乎仍然主要取决于训练数据的质量（以及规模）和训练方案。

很多人都会有一个问题：Transformer 什么时候（或者是否）会被其他架构所取代？

当然，也存在诸如扩散模型（Diffusion Models）等其他架构设计，但至少目前来看，Transformer 仍然是当前最先进模型发布时的主流架构。

不过，随着每个季度都有越来越多的新模型发布，我们看到的架构改动也越来越多。过去，一个最基础的 Transformer 模块，也许只需要 50～100 行 PyTorch 代码就能够实现。而如今，这些不断加入的改进（尤其是各种注意力机制变体）已经让代码复杂度增加了大约 10 倍。这本身并不是一件坏事，因为这些改进的目标是降低运行时成本，而不是增加成本。但另一方面，它也使得人们越来越难以清晰地理解各个组成模块及其相互作用关系。

![img](https://picx.zhimg.com/80/v2-ad75e00c213240bea4448381abc56d11_1440w.jpg?source=ccfced1a)

图23： 从 GPT-2（2019）到 DeepSeek V4-Pro（2026）的演进

例如，对于第一次接触 LLM 架构的人来说，看到 DeepSeek V4 的源码时，很可能会感到无所适从。不过，如果从最初的解码器式 LLM（GPT/GPT-2）开始学习，再逐步引入并理解这些新增组件，一次只学习一种新机制，那么整个学习过程仍然是可控的。

持续学习，一次理解一种架构。

参考：《Recent Developments in LLM Architectures》，Sebastian Raschka
