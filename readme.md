![AI Coded Pacman](logo.png "AI Coded Pacman")

# AI Coded Pacman

This is an experiment to see how capable LLMs are working with code. Can prompts replace coding? Is there a difference between LLMs? What are the most efficient ways to utilize LLMs in development?

The goal is to make LLMs do the coding. We anticipate the manual involvement will be necessary, but we aim to keep it minimal. We will utilize AI for refactoring as much as possible while being productive. Hopefully, LLM will produce quality code and perform code cleanups as it goes. If not, we may try refactoring via prompting.

### LLMs and Tech Stack

We picked [Pacman](https://en.wikipedia.org/wiki/Pac-Man) game for our implementation subject. Javascript for ease of deployment and the [p5.js](https://p5js.org/) game dev library for the engine. [Github Pages](https://pages.github.com/) host the game.

The p5.js / Javascript combo fits our goals well. We have no prior experience with p5.js lib, nor do we use Javascript professionally as our main language.

We plan to try different LLMs as we go. Freely available [Google Gemini](https://gemini.google.com/), [Microsoft Copilot](https://copilot.microsoft.com/) (ChatGPT4-Turbo?) and [ChatGPT 3.5](https://chatgpt.com/). Self-hosting Open Source models via [Oolama](https://ollama.com/). Paid variations of Gemini 1.5, and other LLMs that become available.

## Latest deploy
🎮 https://bryndin.github.io/ai-coded-pacman

## Dev Journal
📒[Step-by-step dev log](journal.md)

There we track development progress. List the problem for each step to work on, prompts used, LLM answers, and our notes. It's THE essence of the project.

## Notes & Findings
These are general summary notes, for the detailed development notes see the [Dev Journal](journal.md).

### **LLM choice for a bootstrap** (ordered best to worst)
  - *Gemini*: good job generating a prototype with all major entities.
  - *llama3:8b-instruct-q6_K*: usable prototype, less logically structured compared to Gemini.
  - *MS Copilot* simple generic p5lib.js bootstrap. Not good.
  - *deepseek-coder:6.7b* p5lib.js bootstrap, Pacman logic is a throwaway.

### "Averaged" generated code that varies upon regeneration
There must be a volume of Pacman implementations, with many making it into the training sets. The LLM generated code feels "averaged". Regenerating it produces a similar, yet slightly different version. Global variables are replaced by function arguments, or class attributes and vice versa. Controls are based on arrows and/or WASD, etc.

These variations complicate putting different code blobs together and require human attention to make them compatible. We still need a developer familiar with the programming language.

### Limits on Context Window in LLMs
With a larger codebase (>5k tokens) supplying code to LLMs via prompt becomes a challenge. Public LLMs don't publish their context window sizes. Even with large contexts, limits are smaller on the prompts and even stricter on the output. This leads to truncated generated code, or functions being replaced with "insert needed logic here" comments.

Possible solution is to refactor code into decoupled, smaller chunks to be used in prompts.
