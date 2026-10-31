# Unfixed

一份以 aro-spec 社群体验为中心的互动式自我探索测试。

你根据自己的吸引体验、对感情的分类方式和关系偏好答题，测试会告诉你：你描述的体验和哪些身份词的定义比较接近。

## 先说清楚

- **标签是自我认同的工具，不是诊断。** 测试只能指出"你描述的体验和哪些词的定义接近"，不替任何人决定身份。词可以换、可以不用，也可以暂时空着。
- **谁都可以来做。** 已经认同 aspec 的人、正在探索的人、allo 都可以；内容从 aro-spec 社群的体验出发。
- **不问性经历，不按年龄分流**，和性有关的题都可以跳过。
- **现在是测试版。** 题目、计分和名词库都还在打磨，名词库里有不少词条尚待审校。

## 怎么用

下载仓库，直接双击 [web/index.html](web/index.html) 在浏览器里打开，不用安装任何东西。作答记录只保存在你自己的浏览器里，不会上传。

## 仓库里有什么

文档里"见 3.7""第 11 节"这类引用，按下表找对应文件。

| 文件 | 章节 | 内容 |
|---|---|---|
| [web/](web) | — | 测试网页本体 |
| [lexicon/](lexicon/README.md) | — | 名词库：每个词的通俗释义、核心特征、体验举例、和相近词的区别、社区里的不同说法 |
| [01-framework.md](01-framework.md) | 0–2 | 图例、五个维度、横切的修饰轴，以及什么词会被收录 |
| [02-attraction-terms.md](02-attraction-terms.md) | 3–6 | 维度一（浪漫）、维度二（性）、组合标签、维度三（其他吸引）的分类和术语表 |
| [03-relationship-terms.md](03-relationship-terms.md) | 7–8 | 维度四（关系偏好）、维度五（关系结构与理念）的分类和术语表 |
| [04-constraints.md](04-constraints.md) | 9–11 | 哪些词可以同时成立、容易混淆的概念、不适合只靠测试判断的概念 |
| [05-output-rules.md](05-output-rules.md) | 12 | 结果怎么呈现 |
| [06-item-blueprint.md](06-item-blueprint.md) | 14 | 出题原则、答题流程、题量 |
| [06-items/](06-items) | 14.4–14.10 | 每一道题：题干、选项、出现条件、测的是什么 |
| [07-scoring-and-fallback.md](07-scoring-and-fallback.md) | 15 | 计分规则，以及信息不够时怎么退回到更宽的词 |
| [appendix-names-and-sources.md](appendix-names-and-sources.md) | 附录 A–B | 中文译名的取法、每个词的定义来源 |

文档里偶尔会提到 `tools/`、`generated/` 等目录或检查脚本，它们是作者本地维护用的工具，没有放进公开仓库。

## 许可

文字内容（名词库、文档、题目）采用 CC BY-SA 4.0，网页代码采用 MIT，详见 [LICENSE-CONTENT.md](LICENSE-CONTENT.md) 和 [LICENSE](LICENSE)。

## 想提意见

定义不准、译名不顺、题目让你不舒服或看不懂，都欢迎开 [Issue](https://github.com/xiaoyou5602/Unfixed/issues) 告诉我。

觉得有用的话，可以点个 star。
