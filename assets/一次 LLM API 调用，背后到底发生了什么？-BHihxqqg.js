import{f as e,j as t,m as n}from"./vendor~app~SearchBox~index.html~index.html~index.html~index.html~index.html~index.html~inde~msseenl2-lKcyIGt-.js";import{t as r}from"./app-Cum0icVY.js";var i=JSON.parse(`{"path":"/article/what-happens-behind-one-llm-api-call/","title":"一次 LLM API 调用，背后到底发生了什么？ | 博客","lang":"zh-CN","frontmatter":{"title":"一次 LLM API 调用，背后到底发生了什么？","createTime":"2026/09/16 19:32:22","permalink":"/article/what-happens-behind-one-llm-api-call/","excerpt":"对于大多数使用者来说，这个过程很简单。API 接收请求，模型生成答案，客户端把结果显示出来。一行代码就能完成。真正运行起来，事情要复杂得多。","outline":[2,3],"cover":"/img/inside_an_llm_call.webp","tags":["技术专栏"],"description":"本文已发表于 InfoQ 。 LLM API 调用 从 Tokenization、Routing 到 Prefill、Decode、KV Cache 与 Billing 你输入一句： 帮我分析一下这份报告。 点击发送。 过了一会儿，答案出现在屏幕上。 对于大多数使用者来说，这个过程很简单。API 接收请求，模型生成答案，客户端把结果显示出来。一行代码就...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"一次 LLM API 调用，背后到底发生了什么？\\",\\"image\\":[\\"https://zhuanfeng.netlify.app/img/inside_an_llm_call.webp\\"],\\"dateModified\\":null,\\"author\\":[]}"],["meta",{"property":"og:url","content":"https://zhuanfeng.netlify.app/article/what-happens-behind-one-llm-api-call/"}],["meta",{"property":"og:site_name","content":"朱岸峰的深度思考与分享"}],["meta",{"property":"og:title","content":"一次 LLM API 调用，背后到底发生了什么？"}],["meta",{"property":"og:description","content":"本文已发表于 InfoQ 。 LLM API 调用 从 Tokenization、Routing 到 Prefill、Decode、KV Cache 与 Billing 你输入一句： 帮我分析一下这份报告。 点击发送。 过了一会儿，答案出现在屏幕上。 对于大多数使用者来说，这个过程很简单。API 接收请求，模型生成答案，客户端把结果显示出来。一行代码就..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://zhuanfeng.netlify.app/img/inside_an_llm_call.webp"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:src","content":"https://zhuanfeng.netlify.app/img/inside_an_llm_call.webp"}],["meta",{"name":"twitter:image:alt","content":"一次 LLM API 调用，背后到底发生了什么？"}],["meta",{"property":"article:tag","content":"技术专栏"}]]},"readingTime":{"minutes":15.19,"words":4557},"git":{},"autoDesc":true,"filePathRelative":"blog/一次 LLM API 调用，背后到底发生了什么？.md","headers":[],"categoryList":[]}`),a={name:`一次 LLM API 调用，背后到底发生了什么？.md`};function o(r,i,a,o,s,c){return t(),e(`div`,null,[...i[0]||=[n(`<div class="hint-container note"><p class="hint-container-title">本文已发表于 <a href="https://xie.infoq.cn/article/ec68fd4d5dc13e6871fc9ceff" target="_blank" rel="noopener noreferrer">InfoQ</a> 。</p></div><p><img src="/img/inside_an_llm_call.webp" alt="LLM API 调用"></p><p><strong>从 Tokenization、Routing 到 Prefill、Decode、KV Cache 与 Billing</strong></p><p>你输入一句：</p><blockquote><p>帮我分析一下这份报告。</p></blockquote><p>点击发送。</p><p>过了一会儿，答案出现在屏幕上。</p><p>对于大多数使用者来说，这个过程很简单。API 接收请求，模型生成答案，客户端把结果显示出来。一行代码就能完成。</p><p>真正运行起来，事情要复杂得多。</p><p>一个生产环境中的 LLM API，前面连着网络、认证、限流和路由，后面连着 Token 计量、Safety、Streaming 和 Observability。进入模型之后，又会涉及 Prefill、Decode、KV Cache、GPU Memory、Batching 等一系列计算和调度机制。</p><p>如果模型支持 Reasoning、Web Search、Code Execution 或其他工具，一次请求还可能在模型和外部工具之间来回几轮。</p><p>可以把它看成一条完整的 <strong>AI Serving Pipeline</strong>。</p><p><em>下面这套流程主要用于理解一个典型的文本生成请求。不同 Provider、模型和部署架构之间会有差别，有些环节可能合并，有些则会拆成独立服务。</em></p><hr><h2 id="_01、请求从哪里开始" tabindex="-1"><a class="header-anchor" href="#_01、请求从哪里开始"><span>01、请求从哪里开始？</span></a></h2><p>先从 API Gateway 说起。</p><p>客户端发出的请求，大致会经过：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>Client</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Network / TLS</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>API Gateway / Edge</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Authentication</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Request Validation</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Rate Limiting</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Usage Accounting</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里处理的事情都比较熟悉。</p><p>TLS 负责安全连接，Authentication 判断调用者有没有权限，请求验证检查参数和格式，Rate Limiting 控制访问速度。与此同时，系统还需要建立这次请求的 Usage 信息，后面才能知道用了多少 Token、产生了多少费用。</p><p>限流也比“每分钟最多调用多少次”稍微复杂一些。</p><p>实际 API 通常同时存在 RPM、TPM、并发量、项目级限制、模型级限制等约束。不同服务商的具体规则不同。</p><p>因此，一个：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>429 Too Many Requests</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>未必意味着模型本身出了问题。</p><p>它可能只是说明，当前请求触碰到了某一层容量限制。</p><hr><h2 id="_02、请求接下来去哪里" tabindex="-1"><a class="header-anchor" href="#_02、请求接下来去哪里"><span>02、请求接下来去哪里？</span></a></h2><p>传统 Web 服务里，我们很容易把这一层理解成 Load Balancer：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>              Load Balancer</span></span>
<span class="line"><span>              /     |     \\</span></span>
<span class="line"><span>             ↓      ↓      ↓</span></span>
<span class="line"><span>          Server  Server  Server</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>LLM Serving 的调度通常要考虑更多事情。</p><p>系统需要知道请求使用哪个模型、哪个 Region、哪个 Replica，以及当前各个 Worker 的负载和队列情况。</p><p>对于现代推理系统，还可能进一步考虑：</p><ul><li>KV Cache 是否已经存在</li><li>Prefill Worker 的状态</li><li>Decode Worker 的状态</li><li>GPU 和节点之间的拓扑</li><li>数据传输成本</li><li>当前模型的可用容量</li></ul><p>因此，现在谈这一层，用 <strong>Routing &amp; Scheduling</strong> 更合适。</p><p>尤其值得注意的是 KV Cache。</p><p>假设某个 Worker 已经保存了大量与你当前请求相同的上下文，把新的请求送到那里，就有机会复用已有的 Cache。换一台 GPU，则可能需要重新计算。</p><p>于是，“请求发给谁”逐渐和“Cache 在哪里”联系在了一起。</p><p>NVIDIA Dynamo 等现代 Serving 系统已经提供 KV-aware routing、Prefill/Decode Disaggregation 等能力。</p><hr><h2 id="_03、模型看到的并不是文字" tabindex="-1"><a class="header-anchor" href="#_03、模型看到的并不是文字"><span>03、模型看到的并不是文字</span></a></h2><p>接下来是 Tokenization。</p><p>你输入：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>帮我分析一下这份报告</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Tokenizer 会把它转换成模型能够处理的 Token IDs：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>Text</span></span>
<span class="line"><span> ↓</span></span>
<span class="line"><span>Tokenizer</span></span>
<span class="line"><span> ↓</span></span>
<span class="line"><span>Token IDs</span></span>
<span class="line"><span> ↓</span></span>
<span class="line"><span>[ ... ]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不同模型使用的 tokenizer 并不完全相同。BPE、SentencePiece、WordPiece 都属于常见方案。</p><p>因此，同一句话交给不同模型，得到的 Token 数量可能不同。</p><p>Token 数量很重要。</p><p>它关系到 Context Window，也会影响计算量、延迟和费用。</p><p>经常有人用：</p><blockquote><p>1 Token ≈ 4 个字符</p></blockquote><p>来帮助理解 Token。</p><p>这个经验值对于英文文本可以提供一点直觉，放到中文、代码、JSON 或数学表达式里就不太可靠了。真正的 Token 数量，还是应该交给对应模型的 tokenizer 来计算。</p><hr><h2 id="_04、context-window-是怎么参与进来的" tabindex="-1"><a class="header-anchor" href="#_04、context-window-是怎么参与进来的"><span>04、Context Window 是怎么参与进来的？</span></a></h2><p>Tokenization 完成之后，系统还需要检查这次请求是否符合模型的上下文限制。</p><p>Context 里装的东西，远不止用户刚刚输入的那句话。</p><p>它可能包括：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>System Prompt + Conversation History + User Input + Tool Definitions + Retrieved Documents +</span></span>
<span class="line"><span>Previous Tool Results</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>对于 Agent，这个列表还会不断增长。</p><p>因此，“我只输入了 2000 个字”并不能直接说明这次请求用了多少 Context。</p><p>另外，Context 超限之后怎么处理，也取决于 API 的设计。有的接口允许截断历史内容，有的会直接返回错误。</p><p>Context Window 更适合被理解成：</p><blockquote><p><strong>一次推理任务可以携带的上下文预算。</strong></p></blockquote><hr><h2 id="_05、prefill-模型先把上下文读进去" tabindex="-1"><a class="header-anchor" href="#_05、prefill-模型先把上下文读进去"><span>05、Prefill：模型先把上下文读进去</span></a></h2><p>现在才真正进入模型推理。</p><p>LLM 的生成过程通常可以分成两个重要阶段：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>                Inference</span></span>
<span class="line"><span>                    │</span></span>
<span class="line"><span>          ┌─────────┴─────────┐</span></span>
<span class="line"><span>          ↓                   ↓</span></span>
<span class="line"><span>       Prefill              Decode</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Prefill 可以理解成“先处理输入”。</p><p>假设 Prompt 很长：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>10,000 Tokens</span></span>
<span class="line"><span>       ↓</span></span>
<span class="line"><span>    Prefill</span></span>
<span class="line"><span>       ↓</span></span>
<span class="line"><span>Attention States</span></span>
<span class="line"><span>       ↓</span></span>
<span class="line"><span>   KV Cache</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>模型会对这批输入 Token 进行计算，并建立后续生成所需要的中间状态。</p><p>其中非常重要的一部分，就是 <strong>Key / Value，也就是 KV Cache</strong>。</p><p>这里有一个容易产生误解的地方。</p><p>Prefill 确实可以对输入序列进行高度并行的计算，但它并不等于“10,000 个 Token 各算各的”。Transformer 的 Attention 仍然存在序列关系，实际耗时还受到模型结构、硬件利用率、Batching、Chunked Prefill 和 Cache Reuse 等因素影响。</p><p>因此，不能简单地用“10,000 Token 一定是 1,000 Token 的十倍时间”来估算。</p><p>工程系统里的实际情况会复杂一些。</p><hr><h2 id="_06-—-kv-cache-模型为什么不用每次从头算" tabindex="-1"><a class="header-anchor" href="#_06-—-kv-cache-模型为什么不用每次从头算"><span>06 — KV Cache：模型为什么不用每次从头算？</span></a></h2><p>假设你正在和一个模型进行长对话。</p><p>每生成一个新 Token，如果都重新计算之前所有上下文，重复计算会非常可观。</p><p>KV Cache 解决的就是这一部分问题。</p><p>可以粗略地想象：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>Previous Context</span></span>
<span class="line"><span>       ↓</span></span>
<span class="line"><span>   KV Cache</span></span>
<span class="line"><span>       ↓</span></span>
<span class="line"><span>    New Token</span></span>
<span class="line"><span>       ↓</span></span>
<span class="line"><span>Continue Generation</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>已经计算过的 Key 和 Value 被保存下来，后续生成可以继续使用。</p><p>问题也随之而来：</p><p><strong>KV Cache 很占内存。</strong></p><p>尤其在长上下文、高并发场景下，大量请求同时保存 KV Cache，GPU Memory 很快就会成为系统的重要资源。</p><p>于是，Serving 系统开始围绕 KV Cache 做各种优化：</p><ul><li>Paged KV Cache</li><li>Prefix Caching</li><li>KV Cache Offloading</li><li>Distributed KV Cache</li><li>KV-aware Routing</li></ul><p>有些系统还会把 Cache 放在 GPU 之外，根据性能和容量需要，在 CPU Memory、SSD 或其他存储层之间进行管理。vLLM、NVIDIA NIM 等推理系统都已经提供不同形式的 KV Cache 管理和 Offloading 能力。</p><p>这也是今天 LLM Serving 很有意思的一点。</p><p>过去讨论负载均衡时，通常关心：</p><blockquote><p>哪台服务器比较空？</p></blockquote><p>现在还要问：</p><blockquote><p><strong>哪台服务器已经有我要的 Cache？</strong></p></blockquote><hr><h2 id="_07、decode-答案开始一个-token-一个-token-的生成" tabindex="-1"><a class="header-anchor" href="#_07、decode-答案开始一个-token-一个-token-的生成"><span>07、Decode：答案开始一个 Token 一个 Token 的生成</span></a></h2><p>Prefill 完成之后，进入 Decode。</p><p>典型的自回归生成过程可以画成：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>Prompt</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Prefill</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Token 1</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Token 2</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Token 3</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Token 4</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>...</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>模型每一步都会根据当前上下文预测接下来的 Token。</p><p>这就是 LLM 和很多传统 API 在性能表现上的一个明显区别。</p><p>一个普通 API 往往是：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>Request</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Compute</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Response</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>LLM 生成则更像：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>Request</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Inference</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Token</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Token</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Token</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Token</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>...</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出越长，生成过程通常也越长。</p><p>因此，LLM 性能分析里经常会看两个指标。</p><p>TTFT：Time To First Token</p><p>从发送请求到第一个 Token 出现，需要多久？</p><p>ITL：Inter-Token Latency</p><p>相邻 Token 之间的生成间隔是多少？</p><p>对于聊天机器人、Coding Agent 等交互式应用，这两个指标都很有意义。</p><p>一个回答总共需要 8 秒，并不代表用户要等 8 秒才能看到任何东西。如果第一个 Token 在 500ms 左右就出现，后面的内容持续流出，体验会完全不同。</p><hr><h2 id="_08、attention-gpu-到底在计算什么" tabindex="-1"><a class="header-anchor" href="#_08、attention-gpu-到底在计算什么"><span>08、Attention：GPU 到底在计算什么？</span></a></h2><p>Decode 阶段会反复执行 Transformer 的计算。</p><p>把 Attention 极度简化之后，可以画成：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>Q × Kᵀ</span></span>
<span class="line"><span>   ↓</span></span>
<span class="line"><span>Attention Scores</span></span>
<span class="line"><span>   ↓</span></span>
<span class="line"><span>Softmax</span></span>
<span class="line"><span>   ↓</span></span>
<span class="line"><span>× V</span></span>
<span class="line"><span>   ↓</span></span>
<span class="line"><span>Next Layer</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现代模型中可以看到很多不同的 Attention 设计，例如：</p><ul><li>Multi-Head Attention（MHA）</li><li>Multi-Query Attention（MQA）</li><li>Grouped-Query Attention（GQA）</li><li>FlashAttention</li></ul><p>其中 GQA 和 MQA 会减少 Key / Value Head 的数量，从而降低 KV Cache 的内存压力。</p><p>FlashAttention 则从另一个方向优化 Attention 的计算和内存访问。</p><p>所以，LLM 推理性能很少只是一个“GPU 算力够不够”的问题。</p><p>计算能力、显存容量、Memory Bandwidth、Cache、Batching 和调度策略都会参与其中。</p><hr><h2 id="_09、gpu-只是计算资源的一部分" tabindex="-1"><a class="header-anchor" href="#_09、gpu-只是计算资源的一部分"><span>09、GPU 只是计算资源的一部分</span></a></h2><p>大型模型通常需要多张 GPU 或其他 AI Accelerator 协同工作。</p><p>例如：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>                  Model</span></span>
<span class="line"><span>                    │</span></span>
<span class="line"><span>        ┌───────────┼───────────┐</span></span>
<span class="line"><span>        ↓           ↓           ↓</span></span>
<span class="line"><span>      GPU 0       GPU 1       GPU 2</span></span>
<span class="line"><span>        │           │           │</span></span>
<span class="line"><span>        └───────────┼───────────┘</span></span>
<span class="line"><span>                    ↓</span></span>
<span class="line"><span>                 Serving</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>常见的并行方式包括：</p><ul><li>Tensor Parallelism</li><li>Pipeline Parallelism</li><li>Data Parallelism</li><li>Expert Parallelism</li></ul><p>硬件也一直在变化。H100、H200、B200，以及其他 GPU、TPU 和 AI Accelerator 都可能出现在实际 Serving 环境中。</p><p>对于推理来说，显存尤其重要。</p><p>模型权重需要放进去，KV Cache 需要放进去，中间状态也需要空间。</p><p>于是很多性能优化最后都会落到几个很朴素的问题上：</p><p><strong>计算能不能少一点？</strong></p><p><strong>数据能不能少搬一点？</strong></p><p><strong>已经算过的东西能不能复用？</strong></p><hr><h2 id="_10、prefill-和-decode-已经可以分开运行" tabindex="-1"><a class="header-anchor" href="#_10、prefill-和-decode-已经可以分开运行"><span>10、Prefill 和 Decode，已经可以分开运行</span></a></h2><p>这是近几年 LLM Serving 架构里非常值得关注的一件事情。</p><p>最容易理解的方式，是先把整个推理过程放在一个 Worker 里：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>Request</span></span>
<span class="line"><span>   ↓</span></span>
<span class="line"><span>Worker</span></span>
<span class="line"><span>   ↓</span></span>
<span class="line"><span>Prefill</span></span>
<span class="line"><span>   ↓</span></span>
<span class="line"><span>Decode</span></span>
<span class="line"><span>   ↓</span></span>
<span class="line"><span>Response</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但 Prefill 和 Decode 对资源的需求并不完全相同。</p><p>Prefill 更偏计算密集。</p><p>Decode 则更容易受到 Memory Bandwidth、KV Cache 和并发调度的影响。</p><p>在高负载场景下，如果大量长 Prompt 同时进入 Prefill，它们可能影响正在进行的 Decode。</p><p>因此，一些现代 Serving 架构开始把两者拆开：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>                    ┌───────────────┐</span></span>
<span class="line"><span>                    │ Prefill Pool  │</span></span>
<span class="line"><span>                    └───────┬───────┘</span></span>
<span class="line"><span>                            │</span></span>
<span class="line"><span>                         KV Cache</span></span>
<span class="line"><span>                            │</span></span>
<span class="line"><span>                            ↓</span></span>
<span class="line"><span>Request → Router → ┌───────────────┐</span></span>
<span class="line"><span>                   │  Decode Pool  │</span></span>
<span class="line"><span>                   └───────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Prefill Worker 负责建立 KV Cache，再把相关状态交给 Decode Worker。</p><p>这种架构叫：</p><blockquote><p><strong>Disaggregated Serving</strong></p></blockquote><p>NVIDIA Dynamo 当前文档已经把 Prefill/Decode Disaggregation 作为重要的 Serving 架构，并专门处理 KV Transfer、Worker 路由和拓扑问题。</p><p>当然，拆开以后也多了一次数据传输。</p><p>如果 KV Transfer 成为瓶颈，分离架构未必能够带来收益。</p><p>这件事情很典型：LLM Serving 的优化经常不是简单地“多加一种技术”，而是在计算、内存、网络和调度之间重新找平衡。</p><hr><h2 id="_11、reasoning-出现之后-一次请求可能变长了" tabindex="-1"><a class="header-anchor" href="#_11、reasoning-出现之后-一次请求可能变长了"><span>11、Reasoning 出现之后，一次请求可能变长了</span></a></h2><p>过去讨论 LLM API，常见的模型是：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>Prompt</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Answer</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>今天这个模型已经不太够用了。</p><p>对于支持 Reasoning 的模型，一次请求可能更接近：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>Prompt</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Reasoning</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Tool Call?</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Observation</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>More Reasoning</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Final Answer</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>用户最终看到的答案，可能只有几百个 Token。</p><p>模型在整个过程中实际处理的 Token 数量却可能更多。</p><p>现代 API 已经开始把 Reasoning Tokens 单独统计出来。</p><p>这也解释了一个经常出现的现象：</p><p>同一个问题，有时候模型很快给出答案，有时候却“思考”更久。</p><p>延迟和 Token Usage 都可能随之变化。</p><p>对于成本分析，只看最终回答有多少字，已经不够用了。</p><hr><h2 id="_12、tool-use-让一条-api-调用变成一段流程" tabindex="-1"><a class="header-anchor" href="#_12、tool-use-让一条-api-调用变成一段流程"><span>12、Tool Use 让一条 API 调用变成一段流程</span></a></h2><p>再看一个稍微复杂的例子。</p><p>你问：</p><blockquote><p>帮我查一下今天 NVIDIA 的股价，再分析一下上涨的原因。</p></blockquote><p>如果模型可以使用工具，后台可能是：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>User Prompt</span></span>
<span class="line"><span>     ↓</span></span>
<span class="line"><span>LLM</span></span>
<span class="line"><span>     ↓</span></span>
<span class="line"><span>Reasoning</span></span>
<span class="line"><span>     ↓</span></span>
<span class="line"><span>Tool Call</span></span>
<span class="line"><span>     ↓</span></span>
<span class="line"><span>External API / Web</span></span>
<span class="line"><span>     ↓</span></span>
<span class="line"><span>Tool Result</span></span>
<span class="line"><span>     ↓</span></span>
<span class="line"><span>LLM</span></span>
<span class="line"><span>     ↓</span></span>
<span class="line"><span>More Reasoning</span></span>
<span class="line"><span>     ↓</span></span>
<span class="line"><span>Final Answer</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里的时间已经不能简单理解成“模型生成答案用了多久”。</p><p>外部 API 需要多久，搜索需要多久，工具返回的数据有多少，模型需要进行几轮推理，这些都会加入整个过程。</p><p>所以在 Agent 系统里，一次用户操作经常对应一条更长的 Trace。</p><p>LLM 只是其中的一部分。</p><hr><h2 id="_13、safety-和-policy-也在这条链路里" tabindex="-1"><a class="header-anchor" href="#_13、safety-和-policy-也在这条链路里"><span>13、Safety 和 Policy 也在这条链路里</span></a></h2><p>安全控制的位置并不固定在最终输出之后。</p><p>一个典型的系统可能在不同阶段进行检查：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>Input</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Policy / Safety</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Model</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Tool Call</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Output</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>Policy / Safety</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>具体实现取决于 Provider 和 API。</p><p>有的系统会在输入阶段进行检查，有的会在输出阶段进行过滤，还有的会针对工具调用增加额外的策略控制。</p><p>最终响应中还可能带有某种 termination reason，例如：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>STOP</span></span>
<span class="line"><span>MAX_TOKENS</span></span>
<span class="line"><span>SAFETY</span></span>
<span class="line"><span>...</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不过这些字段和枚举并没有统一的行业标准。</p><p>因此，在工程代码里最好按照具体 Provider 的 API 定义来处理。</p><hr><h2 id="_14-、为什么答案会一个-token-一个-token-地出现" tabindex="-1"><a class="header-anchor" href="#_14-、为什么答案会一个-token-一个-token-地出现"><span>14 、为什么答案会一个 Token 一个 Token 地出现？</span></a></h2><p>因为 Streaming。</p><p>普通响应大致是：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>Request</span></span>
<span class="line"><span>   ↓</span></span>
<span class="line"><span>████████████████</span></span>
<span class="line"><span>   ↓</span></span>
<span class="line"><span>Complete Response</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Streaming 则是：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>Request</span></span>
<span class="line"><span>   ↓</span></span>
<span class="line"><span>Token 1 → Client</span></span>
<span class="line"><span>Token 2 → Client</span></span>
<span class="line"><span>Token 3 → Client</span></span>
<span class="line"><span>Token 4 → Client</span></span>
<span class="line"><span>...</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>模型仍然在做原来的计算。</p><p>改变的是数据返回方式。</p><p>因此 Streaming 对交互体验非常重要，尤其是 Chat、Coding Assistant 和 Agent UI。用户可以更早看到结果，不必等整个 Response 完成。</p><p>这也是 TTFT 值得单独监控的原因。</p><hr><h2 id="_15、然后-系统开始计算这次调用用了多少钱" tabindex="-1"><a class="header-anchor" href="#_15、然后-系统开始计算这次调用用了多少钱"><span>15、然后，系统开始计算这次调用用了多少钱</span></a></h2><p>模型生成完成之后，Usage 信息会进入计量流程。</p><p>最简单的模型可以写成：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>Cost ≈</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Input Tokens × Input Rate</span></span>
<span class="line"><span>+</span></span>
<span class="line"><span>Cached Tokens × Cached Rate</span></span>
<span class="line"><span>+</span></span>
<span class="line"><span>Output Tokens × Output Rate</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在实际的计费项目已经丰富得多。</p><p>可能涉及：</p><ul><li>Input Tokens</li><li>Cached Input Tokens</li><li>Output Tokens</li><li>Reasoning Tokens</li><li>Tool Usage</li><li>Image / Audio 等多模态用量</li><li>Batch / Priority / Flex 等不同服务模式</li></ul><p>不同 Provider、模型和服务等级采用不同的计费方式。</p><p>因此，“一次 API 调用多少钱”其实没有一个脱离具体模型和服务商的固定答案。</p><p>有一点倒是非常稳定：</p><blockquote><p><strong>Token Usage 是 AI 应用成本分析里最重要的数据之一。</strong></p></blockquote><hr><h2 id="_16、prompt-caching-为什么越来越重要" tabindex="-1"><a class="header-anchor" href="#_16、prompt-caching-为什么越来越重要"><span>16、Prompt Caching 为什么越来越重要？</span></a></h2><p>假设一个 Agent 每次请求都会携带：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>System Prompt</span></span>
<span class="line"><span>+</span></span>
<span class="line"><span>Tool Definitions</span></span>
<span class="line"><span>+</span></span>
<span class="line"><span>Company Rules</span></span>
<span class="line"><span>+</span></span>
<span class="line"><span>Long Documentation</span></span>
<span class="line"><span>+</span></span>
<span class="line"><span>User Question</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中前面几万 Token 几乎没有变化。</p><p>如果每次都重新处理，重复计算会非常多。</p><p>Caching 的思路很直接：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>First Request</span></span>
<span class="line"><span>     ↓</span></span>
<span class="line"><span>Compute</span></span>
<span class="line"><span>     ↓</span></span>
<span class="line"><span>Cache</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Later Requests</span></span>
<span class="line"><span>     ↓</span></span>
<span class="line"><span>Reuse</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现代 Provider 已经提供不同形式的 Prompt / Context Caching。</p><p>缓存命中以后，可以减少重复上下文带来的计算和费用；具体收益取决于模型、缓存策略和请求模式。OpenAI、Anthropic、Google 等主要 Provider 都已经提供相应机制。</p><p>对于 Agent，这个问题尤其值得关注。</p><p>因为 Agent 很容易反复携带：</p><ul><li>System Prompt</li><li>Tool Schema</li><li>Conversation History</li><li>User Context</li><li>Retrieved Knowledge</li></ul><p>在长上下文应用里，Cache 的位置已经逐渐从一个局部优化手段，进入 Serving Architecture 本身。</p><hr><h2 id="_17、有些任务-根本不需要实时完成" tabindex="-1"><a class="header-anchor" href="#_17、有些任务-根本不需要实时完成"><span>17、有些任务，根本不需要实时完成</span></a></h2><p>还有一类请求，对延迟并不敏感。</p><p>比如：</p><ul><li>大规模文档分类</li><li>Embedding</li><li>数据清洗</li><li>Evaluation</li><li>批量摘要</li><li>夜间数据处理</li></ul><p>这类任务可以考虑 Batch Processing。</p><p>实时请求追求：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>Low Latency</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Batch 更在意：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>Resource Utilization</span></span>
<span class="line"><span>+</span></span>
<span class="line"><span>Cost</span></span>
<span class="line"><span>+</span></span>
<span class="line"><span>Throughput</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>目前不同 Provider 对 Batch 的价格和 SLA 有不同设计，不能简单概括成一个统一的折扣比例。</p><p>但工程上的判断很简单：</p><blockquote><p><strong>业务不需要实时的时候，没必要为实时能力支付同样的成本。</strong></p></blockquote><hr><h2 id="_18、最后-你需要知道发生了什么" tabindex="-1"><a class="header-anchor" href="#_18、最后-你需要知道发生了什么"><span>18、最后，你需要知道发生了什么</span></a></h2><p>用户看到的可能只有：</p><blockquote><p>分析完成。</p></blockquote><p>后台却应该有足够的信息，让工程师能够回答：</p><blockquote><p>为什么今天变慢了？</p><p>为什么成本突然上升？</p><p>为什么 429 增多？</p><p>为什么这个用户特别慢？</p><p>为什么 Cache 没有命中？</p></blockquote><p>所以一条完整的 Trace 里，通常值得关注：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>Request ID</span></span>
<span class="line"><span>Model</span></span>
<span class="line"><span>Region</span></span>
<span class="line"><span>Latency</span></span>
<span class="line"><span>TTFT</span></span>
<span class="line"><span>ITL</span></span>
<span class="line"><span>Input Tokens</span></span>
<span class="line"><span>Cached Tokens</span></span>
<span class="line"><span>Output Tokens</span></span>
<span class="line"><span>Reasoning Tokens</span></span>
<span class="line"><span>Cache Hit / Miss</span></span>
<span class="line"><span>Tool Calls</span></span>
<span class="line"><span>Errors</span></span>
<span class="line"><span>Retries</span></span>
<span class="line"><span>Rate Limits</span></span>
<span class="line"><span>Termination Reason</span></span>
<span class="line"><span>Cost</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对于生产系统来说，这些数据比“模型平均响应时间 1.2 秒”有用得多。</p><p>因为真正的问题往往藏在平均值下面。</p><hr><h2 id="_19、把整条链路重新看一遍" tabindex="-1"><a class="header-anchor" href="#_19、把整条链路重新看一遍"><span>19、把整条链路重新看一遍</span></a></h2><p>现在再回头看一次 LLM API 调用：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>User</span></span>
<span class="line"><span> │</span></span>
<span class="line"><span> ↓</span></span>
<span class="line"><span>API Gateway / Edge</span></span>
<span class="line"><span> │</span></span>
<span class="line"><span> ├─ Authentication</span></span>
<span class="line"><span> ├─ Validation</span></span>
<span class="line"><span> ├─ Rate Limit</span></span>
<span class="line"><span> └─ Usage Accounting</span></span>
<span class="line"><span> │</span></span>
<span class="line"><span> ↓</span></span>
<span class="line"><span>Routing &amp; Scheduling</span></span>
<span class="line"><span> │</span></span>
<span class="line"><span> ├─ Model</span></span>
<span class="line"><span> ├─ Region</span></span>
<span class="line"><span> ├─ Capacity</span></span>
<span class="line"><span> ├─ KV Locality</span></span>
<span class="line"><span> └─ Prefill / Decode</span></span>
<span class="line"><span> │</span></span>
<span class="line"><span> ↓</span></span>
<span class="line"><span>Tokenization</span></span>
<span class="line"><span> │</span></span>
<span class="line"><span> ↓</span></span>
<span class="line"><span>Context Check</span></span>
<span class="line"><span> │</span></span>
<span class="line"><span> ↓</span></span>
<span class="line"><span>┌──────────────────────────┐</span></span>
<span class="line"><span>│       Inference          │</span></span>
<span class="line"><span>│                          │</span></span>
<span class="line"><span>│  Prefill → KV Cache      │</span></span>
<span class="line"><span>│              ↓           │</span></span>
<span class="line"><span>│           Decode         │</span></span>
<span class="line"><span>│              ↓           │</span></span>
<span class="line"><span>│       Token by Token     │</span></span>
<span class="line"><span>└──────────────────────────┘</span></span>
<span class="line"><span> │</span></span>
<span class="line"><span> ├───────────────┐</span></span>
<span class="line"><span> ↓               ↓</span></span>
<span class="line"><span>Reasoning      Tool Call</span></span>
<span class="line"><span> │               │</span></span>
<span class="line"><span> └───────┬───────┘</span></span>
<span class="line"><span>         ↓</span></span>
<span class="line"><span>    More Inference</span></span>
<span class="line"><span>         │</span></span>
<span class="line"><span>         ↓</span></span>
<span class="line"><span>Safety / Policy</span></span>
<span class="line"><span>         │</span></span>
<span class="line"><span>         ↓</span></span>
<span class="line"><span>Streaming</span></span>
<span class="line"><span>         │</span></span>
<span class="line"><span>         ↓</span></span>
<span class="line"><span>Usage / Billing</span></span>
<span class="line"><span>         │</span></span>
<span class="line"><span>         ↓</span></span>
<span class="line"><span>Observability</span></span>
<span class="line"><span>         │</span></span>
<span class="line"><span>         ↓</span></span>
<span class="line"><span>User</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果采用 Prefill/Decode 分离的 Serving 架构，中间的 Inference 又可以展开成：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>                    ┌───────────────┐</span></span>
<span class="line"><span>                    │ Prefill Pool  │</span></span>
<span class="line"><span>                    └───────┬───────┘</span></span>
<span class="line"><span>                            │</span></span>
<span class="line"><span>                         KV Cache</span></span>
<span class="line"><span>                            │</span></span>
<span class="line"><span>                            ↓</span></span>
<span class="line"><span>Request → Router → ┌───────────────┐</span></span>
<span class="line"><span>                   │  Decode Pool  │</span></span>
<span class="line"><span>                   └───────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这时候再看“调用一个 LLM API”这件事情，会发现它已经远远超出了一个模型文件本身。</p><p>模型只是其中最核心的一块。</p><p>围绕它运行的，还有 GPU、Memory、Cache、Network、Router、Scheduler、Tool、Policy、Billing 和 Observability。</p><hr><h2 id="写在最后" tabindex="-1"><a class="header-anchor" href="#写在最后"><span>写在最后</span></a></h2><p>调用一个 LLM API，看起来可能只有一行代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>response = client.responses.create(...)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>但这行代码背后，是一整条系统链路。</p><p>网络把请求送进来，</p><p>Gateway 完成认证和限流；</p><p>Router 决定请求去哪里；</p><p>Tokenizer 把文字转换成 Token；</p><p>Prefill 建立上下文状态；</p><p>KV Cache 保存可以复用的信息；</p><p>Decode 一个 Token 一个 Token 地生成结果。</p><p>如果模型需要 Reasoning 或 Tool Use，流程还会继续向外延伸。</p><p>最后，结果经过 Streaming 返回客户端，同时留下 Usage、Latency、Cost 和 Trace 数据。</p><p>这也是理解 LLM API 内部机制的意义。</p><p>以后看到一个 API 请求变慢，可以去看 TTFT、Queue、Prefill、Decode、Cache 和 Tool Call。</p><p>成本突然上涨，可以从 Input、Cached、Reasoning、Output Token 一路查下去。</p><p>429 增多，可以回到 Rate Limit 和 Capacity。</p><p>同样的 Prompt 有时快、有时慢，可以看看 Routing、Batching、Cache Locality 和当前系统负载。</p><p>当这些东西逐渐串起来之后，LLM API 就没有那么神秘了。</p><p>你看到的仍然是一句话和一个答案。</p><p>只是从工程角度看，中间已经站着一整套系统。</p>`,287)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};