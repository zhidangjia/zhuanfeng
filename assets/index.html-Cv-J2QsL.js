import{_ as a,c as n,a as t,o as p}from"./app-CkGQld4I.js";const e={};function l(i,s){return p(),n("div",null,s[0]||(s[0]=[t('<blockquote><p>作者：<a href="https://zhuanfeng.netlify.app/" target="_blank" rel="noopener noreferrer">朱岸峰</a></p></blockquote><hr><p>最近看到一篇文章<a href="https://ethanzuckerman.com/2023/12/22/how-big-is-youtube/" target="_blank" rel="noopener noreferrer">How Big is YouTube?</a>，采用了一种称为 **“drunk dialing”（随机拨号）**的方法。这种方法通过生成 11 个字符的随机 YouTube 视频 URL 来尝试访问现有视频。URL 由字母（a–z、A–Z）、数字（0–9）以及两个特殊字符（_ 和 -）组成。由于可能的组合数量极其庞大（接近2的64次方），随机命中有效视频的概率很低。然而，他们通过一些优化手段，提高了成功率，最终能够找到有效视频并进行数据分析。通过这种方法，他们估算出 2023 年 YouTube 平台上传的视频总数超过 40 亿条。</p><p>由此延申开，想到一个同样的也无厘头的问题：</p><p><strong>B站有多少视频？</strong></p><p>你可能会说，简单，直接查公司年报啥的不就得了。我特地问了Deepseek还有chaptgpt，得到的答案都是：</p><p><strong>根据哔哩哔哩（B站）公开发布的财务报告和投资者演示资料，目前并未找到关于平台视频总数的直接数据。</strong></p><p>得想其他方法了。</p><hr><h3 id="📌-方法一-用搜索引擎测算" tabindex="-1"><a class="header-anchor" href="#📌-方法一-用搜索引擎测算"><span><strong>📌 方法一：用搜索引擎测算</strong></span></a></h3><p>比如：用Bing搜索site:bilibili.com/video/，得到的答案是：</p><p>✔ <strong>约 175,000,000 个结果</strong> 也就是 <strong>1.75</strong>亿个视频。感觉少了。</p><hr><h3 id="📌-方法二-写爬虫或调api" tabindex="-1"><a class="header-anchor" href="#📌-方法二-写爬虫或调api"><span><strong>📌 方法二：写爬虫或调API</strong></span></a></h3><p>B站肯定有反爬策略，麻烦，过~<br> 调API统计某一时段的数量再推测总数，麻烦，过~</p><hr><h3 id="📌-方法三-bv号转av号测算" tabindex="-1"><a class="header-anchor" href="#📌-方法三-bv号转av号测算"><span><strong>📌 方法三：BV号转AV号测算</strong></span></a></h3><p>找个最新视频，获取BV号，再随便搜个在线工具转成AV号。我得到的结果是 <strong>113961320128496</strong>, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mn>10</mn><mn>14</mn></msup></mrow><annotation encoding="application/x-tex">10^{14}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8141em;"></span><span class="mord">1</span><span class="mord"><span class="mord">0</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">14</span></span></span></span></span></span></span></span></span></span></span></span>量级，十万亿，明显不对。而且AV号如果是自增的，前面的数字再转成BV号，却没有对应视频。</p><hr><h3 id="📌-方法四-随机拨号" tabindex="-1"><a class="header-anchor" href="#📌-方法四-随机拨号"><span><strong>📌 方法四：随机拨号</strong></span></a></h3><p>也就是用开头提到的办法:</p><ul><li><p><strong>请求 URL</strong>，统计 <strong>有效 BV 号 / 总尝试数</strong> 的比率。</p></li><li><p><strong>结合历史数据</strong>（如已知的最新 AV 号），估算 B 站视频总数。<br> 例如：</p></li><li><p>如果我们随机生成 <strong>100 万</strong> 个 BV 号，其中 <strong>1 万个有效</strong>，说明有效率为 <strong>1%</strong>。</p></li><li><p>假设 BV 号的总空间约为 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mn>58</mn><mn>10</mn></msup><mo>≈</mo><mn>2.15</mn><mo>×</mo><msup><mn>10</mn><mn>17</mn></msup></mrow><annotation encoding="application/x-tex">58^{10} \\approx 2.15 \\times 10^{17}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8141em;"></span><span class="mord">5</span><span class="mord"><span class="mord">8</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">10</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">≈</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">2.15</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">×</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.8141em;"></span><span class="mord">1</span><span class="mord"><span class="mord">0</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">17</span></span></span></span></span></span></span></span></span></span></span></span>，则可估算当前 B 站视频总数为 <strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>2.15</mn><mo>×</mo><msup><mn>10</mn><mn>17</mn></msup><mo>×</mo><mn>1</mn><mi mathvariant="normal">%</mi><mo>=</mo><mn>2.15</mn><mo>×</mo><msup><mn>10</mn><mn>15</mn></msup></mrow><annotation encoding="application/x-tex">2.15 \\times 10^{17} \\times 1\\% = 2.15 \\times 10^{15}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">2.15</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">×</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.8974em;vertical-align:-0.0833em;"></span><span class="mord">1</span><span class="mord"><span class="mord">0</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">17</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">×</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.8056em;vertical-align:-0.0556em;"></span><span class="mord">1%</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">2.15</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">×</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.8141em;"></span><span class="mord">1</span><span class="mord"><span class="mord">0</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">15</span></span></span></span></span></span></span></span></span></span></span></span></strong>。</p></li></ul><p>文章提到的核心优化手段包括：</p><ol><li><strong>限制搜索范围</strong>（基于已知 ID，提高命中率）。</li><li><strong>优化 ID 生成</strong>（加权采样，避免无效组合）。</li><li><strong>使用并行请求</strong>（多线程，提高访问效率）。</li><li><strong>结合 API</strong>（减少 404，提高数据质量）。</li><li><strong>计算有效 ID 占比</strong>（基于统计，推算总数）。</li></ol><p>想了下，也有点麻烦的。</p>',25)]))}const m=a(e,[["render",l],["__file","index.html.vue"]]),o=JSON.parse('{"path":"/article/an-article-about-bilibili-videos-total/","title":"问题 - B站有多少视频？","lang":"zh-CN","frontmatter":{"title":"问题 - B站有多少视频？","createTime":"2025/02/07 10:30:44","permalink":"/article/an-article-about-bilibili-videos-total/","excerpt":"本文探讨了如何估算 B 站的视频总数，列出了几种可能的方案","outline":[2,3],"tags":["技术专栏","产品管理"],"description":"作者：朱岸峰 最近看到一篇文章How Big is YouTube?，采用了一种称为 **“drunk dialing”（随机拨号）**的方法。这种方法通过生成 11 个字符的随机 YouTube 视频 URL 来尝试访问现有视频。URL 由字母（a–z、A–Z）、数字（0–9）以及两个特殊字符（_ 和 -）组成。由于可能的组合数量极其庞大（接近2的6...","head":[["meta",{"property":"og:url","content":"https://zhuanfeng.netlify.app/article/an-article-about-bilibili-videos-total/"}],["meta",{"property":"og:site_name","content":"朱岸峰的个人网站"}],["meta",{"property":"og:title","content":"问题 - B站有多少视频？"}],["meta",{"property":"og:description","content":"作者：朱岸峰 最近看到一篇文章How Big is YouTube?，采用了一种称为 **“drunk dialing”（随机拨号）**的方法。这种方法通过生成 11 个字符的随机 YouTube 视频 URL 来尝试访问现有视频。URL 由字母（a–z、A–Z）、数字（0–9）以及两个特殊字符（_ 和 -）组成。由于可能的组合数量极其庞大（接近2的6..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:tag","content":"技术专栏"}],["meta",{"property":"article:tag","content":"产品管理"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"问题 - B站有多少视频？\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[]}"]]},"headers":[],"readingTime":{"minutes":2.5,"words":750},"git":{},"autoDesc":true,"filePathRelative":"技术专栏/问题 - B站一共有多少视频.md","categoryList":[{"id":"9742da","sort":10000,"name":"技术专栏"}],"bulletin":false}');export{m as comp,o as data};
