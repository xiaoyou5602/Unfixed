# Unfixed 🌌

[简体中文](README.md) | [繁體中文](README.zh-TW.md) | [English](README.en.md) | [日本語](README.ja.md)

An interactive self-exploration guide to **attraction, feelings, and close relationships**.

Does liking someone necessarily mean wanting to date them? Have you ever wanted to be close to someone and share your life with them, but found it hard to tell whether that feeling was friendship, romantic attraction, or something else? Perhaps how you relate to each other matters more to you than what the relationship is called.

Unfixed invites you to explore your experiences from five perspectives and discover the language people use to describe attraction and relationships. You can work through the questions or browse the glossary directly.

**[Explore Unfixed online](https://unfixed.lumenw.withtoge.us)** (accessible from mainland China) · [Alternative link](https://unfixed.lumenw.workers.dev)

> The interactive test is currently available in **Simplified Chinese only**.

## What can you explore?

- **Romantic attraction:** How romantic feelings arise and how they may change.
- **Sexual attraction:** Distinguishing sexual attraction from libido, attitudes toward sex, and willingness to engage in sexual relationships.
- **Other forms of attraction:** Platonic, sensual, aesthetic, alterous, and other kinds of attraction.
- **Relationship preferences:** The kinds of relationships you want and the forms of closeness and companionship you value.
- **Relationship structures and perspectives:** Your views on exclusivity, number of partners, priorities, and socially expected relationship paths.

## Where do the terms come from?

The terminology draws on community resources such as AUREA, AVEN, and LGBTQIA Wiki, alongside other public discussions, original writings about the concepts, and relevant research. The glossary covers the aromantic and asexual (aro/ace) spectra, different forms of attraction, relationship types, and approaches to relationships.

Some microlabel definitions and Chinese translations remain contested. The glossary is still being expanded and reviewed. Sources, translation decisions, and terms requiring further verification are documented in the [sources appendix](appendix-names-and-sources.md).

## How should you interpret your results?

The results suggest terms that may be close to your experiences across different dimensions, so you can read further and compare them. You may choose to use a label, leave a question open, or use no labels at all. If romantic and sexual attraction are hard to distinguish, you can also choose to answer without separating them.

The questions and result-matching rules were developed for this project and have **not been validated through psychometric testing**. This is a self-exploration guide.

## How to use it

The test does not route people based on age or ask about sexual history, and questions related to sex can be skipped. Anyone curious about their experiences or views on relationships is welcome; no prior knowledge of the terminology is needed.

In the local version, responses to individual questions are stored in your browser.

The project is still being tested and refined. Feedback on questions, results, and glossary entries is welcome.

## Repository guide

References such as “see §3.7” or “Section 11” in the documentation point to the files below.

| File | Sections | Contents |
|---|---|---|
| [web/](web) | — | The interactive test website |
| [lexicon/](lexicon/README.md) | — | Glossary: plain-language descriptions, defining features, examples, distinctions from related terms, and differing community usage |
| [01-framework.md](01-framework.md) | 0–2 | Notation, five dimensions, cross-cutting modifier axes, and inclusion criteria |
| [02-attraction-terms.md](02-attraction-terms.md) | 3–6 | Classification and terms for romantic attraction, sexual attraction, combined labels, and other attraction |
| [03-relationship-terms.md](03-relationship-terms.md) | 7–8 | Classification and terms for relationship preferences, structures, and perspectives |
| [04-constraints.md](04-constraints.md) | 9–11 | Compatible terms, commonly confused concepts, and concepts that cannot reliably be assessed by a test alone |
| [05-output-rules.md](05-output-rules.md) | 12 | How results are presented |
| [06-item-blueprint.md](06-item-blueprint.md) | 14 | Question design principles, response flow, and question count |
| [06-items/](06-items) | 14.4–14.10 | Each question's wording, options, display conditions, and intended measure |
| [07-scoring-and-fallback.md](07-scoring-and-fallback.md) | 15 | Scoring rules and fallback to broader terms when information is insufficient |
| [appendix-names-and-sources.md](appendix-names-and-sources.md) | Appendices A–B | Chinese translation choices and definition sources |

Most repository documentation is currently written in Simplified Chinese.

You may see references to directories such as `tools/` and `generated/`, or to validation scripts. These are used by the maintainer locally and are not included in the public repository.

## Data and privacy

The website collects simple aggregate statistics: how many tests are started and completed, and the overall distribution of result labels. These are used only to understand usage and guide improvements.

**Individual answers to each question are not saved by the website.**

## License

Written content (the glossary, documentation, and questions) is licensed under CC BY-SA 4.0. The website code is licensed under MIT. See [LICENSE-CONTENT.md](LICENSE-CONTENT.md) and [LICENSE](LICENSE).

## A final note

If you spot an inaccurate definition, an awkward translation, or a question that is confusing or uncomfortable, please open an [Issue](https://github.com/xiaoyou5602/Unfixed/issues) and let me know.

If this project is useful to you, consider leaving a star (๑¯◡¯๑)～
