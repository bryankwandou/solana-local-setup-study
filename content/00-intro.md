# Guide 01 — Get your machine ready to ship a program

> **Solana Fall School · Guide 01**
> Install four tools, prove each one works, then put Monday's lecture to work: send a real transaction, derive a PDA, and deploy a real program. Everything here is hands-on practice for material you have already been taught.

| | |
|---|---|
| **Time** | 60–90 min |
| **OS** | macOS · Linux · WSL |
| **Networks** | Localnet · Devnet |
| **Checkpoints** | 10 |

---

## How to use this page

Work top to bottom. Every checkpoint ends with a command that prints something, and the page tells you what to expect.

If your output does not match, stop there. A broken tool carried forward throws its error three checkpoints later, pointing at the wrong thing.

Tick each checkpoint as you go. Progress is saved in this browser, so you can close the tab and come back.

> **On Windows, install WSL first**
> Anchor does not run on Windows natively, so you need Ubuntu through WSL — Solana lists it as a [prerequisite](https://solana.com/docs/intro/installation#prerequisites). Checkpoint 0 covers it, or follow the [official installation guide](https://solana.com/docs/intro/installation) instead.

---

## What you are actually installing

Four separate tools that people treat as one thing called "Solana". Knowing which is which is most of your debugging skill for the term.

| Tool | What it is |
|---|---|
| **rustc** | The Rust compiler. Your program is Rust, compiled to SBF bytecode. |
| **solana** | The CLI from Anza. Keys, cluster config, transactions, deploys. |
| **anchor** | The framework. Removes boilerplate, generates the client IDL. |
| **node** | Runs the TypeScript tests and client scripts that call your program. |

When something breaks, name the tool first. `anchor build` failing is usually rustc or a missing system library, not Anchor.

---

## Where your code runs

Three networks, all running the same software. What changes is who can see them and what the SOL is worth. A **cluster** is just one of these networks — the word comes up constantly.

| | localnet | devnet | mainnet |
|---|---|---|---|
| **SOL** | Free, unlimited | Faucet, rate limited | Real money |
| **Speed** | Instant | Real network conditions | Real network conditions |
| **Persistence** | Wiped on every restart | Persistent | Permanent |
| **Visible to others** | No | Yes, shareable explorer link | Yes |
| **Use it for** | ~95% of development | Integration testing, demos, sharing | Production |

> **Localnet is your default, not devnet**
>
> Almost all of your development time this term happens on localnet — a Solana network running on your own laptop.
>
> Localnet SOL is free and unlimited. No faucet, no airdrop request, no waiting.
>
> It is also worthless, and it cannot move to devnet or mainnet. These are separate chains that share nothing.
>
> Nobody else can see your localnet. That is the only reason this guide touches devnet at all — devnet gives you a link other people can open.
>
> `anchor test` starts and stops its own local validator automatically. You never manage one.
