# Solana Local Setup — Guide 01 (personal study remake)

A remake of **Solana Fall School · Guide 01** for personal study: every module reproduced as Markdown, the page rebuilt as an interactive single-page site, and a **run log** added from actually executing all ten checkpoints on a Windows 11 machine.

Original: <https://solana-local-setup.vercel.app>

---

## What is in here

```
content/     the whole guide as Markdown, one file per module
public/      the interactive site — index.html + styles.css + app.js
```

### Markdown modules

| File | Module |
|---|---|
| [`00-intro.md`](content/00-intro.md) | How to use this page · the four tools · localnet vs devnet vs mainnet |
| [`01-checkpoint-00-prepare-your-os.md`](content/01-checkpoint-00-prepare-your-os.md) | Prepare your OS — WSL, Linux, macOS |
| [`02-checkpoint-01-install-everything.md`](content/02-checkpoint-01-install-everything.md) | Install everything — the fast path |
| [`03-checkpoint-02-the-manual-path.md`](content/03-checkpoint-02-the-manual-path.md) | The manual path — Rust, CLI, Node, AVM |
| [`04-checkpoint-03-pin-your-versions.md`](content/04-checkpoint-03-pin-your-versions.md) | Pin your versions — class baseline |
| [`05-checkpoint-04-wallet-and-config.md`](content/05-checkpoint-04-wallet-and-config.md) | Wallet and config — keys and clusters |
| [`06-checkpoint-05-send-a-transaction.md`](content/06-checkpoint-05-send-a-transaction.md) | Send a transaction — transaction lifecycle |
| [`07-checkpoint-06-first-project.md`](content/07-checkpoint-06-first-project.md) | First project — scaffold and build |
| [`08-checkpoint-07-derive-a-pda.md`](content/08-checkpoint-07-derive-a-pda.md) | Derive a PDA |
| [`09-checkpoint-08-deploy-to-devnet.md`](content/09-checkpoint-08-deploy-to-devnet.md) | Deploy to devnet |
| [`10-checkpoint-09-check-your-work.md`](content/10-checkpoint-09-check-your-work.md) | Check your work |
| [`11-verify-script.md`](content/11-verify-script.md) | The `solana-doctor` verify script |
| [`12-troubleshooting.md`](content/12-troubleshooting.md) | Troubleshooting — 13 ranked failures |
| [`13-run-log-windows-native.md`](content/13-run-log-windows-native.md) | **Run log** — all ten checkpoints, actually executed |

Content is a faithful reproduction of the original, including the collapsed hints, asides, and the author's two unresolved `TODO` notes. The run log is the only addition.

---

## What the site adds over the original

| | |
|---|---|
| **Progress ring** | Completion count and percentage in the rail, persisted to `localStorage` |
| **Command palette** | `⌘K` / `Ctrl+K` or `/` — fuzzy search across every checkpoint and heading |
| **Keyboard nav** | `j` / `k` move between sections, `t` cycles theme, `esc` closes |
| **Copy buttons** | Every code block gets terminal chrome and one-click copy |
| **Theme** | Three-state — system, light, dark |
| **Lamports converter** | Live SOL ↔ lamports, preset to the fee and rent figures on the page |
| **Confetti** | On each checkpoint, and a finale at 10/10 |
| **Scrollspy** | The rail tracks where you are; sections fade in as you reach them |
| **Reading bar** | Top-of-page progress, plus a back-to-top control |
| **Run log** | A whole section of real terminal output, including both failures |

All state is per-browser. Nothing is sent anywhere; there is no backend.

---

## Run it locally

The site is static — no build step.

```bash
cd public
python -m http.server 8000
# or: npx serve .
```

Then open <http://localhost:8000>.

---

## The short version of the run log

Ten checkpoints, executed on Windows 11 with the toolchain installed natively and **no WSL distro**. Eight ran clean. Two broke:

1. **`anchor init` left the project half-built** — exited 0, printed `Error: program not found`, and skipped `package.json`, `tsconfig.json`, `tests/`, and `migrations/`. Anchor's spawn of the package manager failed, and "program" there is the OS's word for an executable, not a Solana program.

2. **The local validator will not start** — `solana-test-validator` cannot unpack its genesis archive (`Access is denied. (os error 5)`), so `anchor test` never gets a network. Working around it with `--skip-local-validator` then failed with *"Windows Subsystem for Linux has no installed distributions"*, because Anchor runs its test script through `bash`, and on Windows `bash.exe` is the WSL launcher.

The test suite was run directly against the devnet-deployed program instead, and passed.

**On-chain proof:**

- Transfer — [`2SaSh1a…U6GGAN`](https://explorer.solana.com/tx/2SaSh1axKzUtHBGqU4R8Erz1ApJJcK89GyhGjw4jpdCfzJqJMSkjZwhWqa3t8Wg8nFHPEpjeQyhvhkAWeYU6GGAN?cluster=devnet)
- Program — [`4AxRhzD1QKxfJGsF4je1dpR4FxZsd2yHJCLUCZsfsvBh`](https://explorer.solana.com/address/4AxRhzD1QKxfJGsF4je1dpR4FxZsd2yHJCLUCZsfsvBh?cluster=devnet)

Full write-up: [`content/13-run-log-windows-native.md`](content/13-run-log-windows-native.md)

---

## A note the guide makes, worth repeating

**Never commit a keypair.** `id.json` is an unencrypted private key. This repository contains public keys and transaction signatures only — those are public by design. No private key or seed phrase is in here, and none should ever be.

---

*Personal study material. Original guide by Solana Fall School.*
