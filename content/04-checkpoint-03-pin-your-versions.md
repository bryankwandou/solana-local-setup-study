# Checkpoint 03 — Pin your versions

> **Class baseline**

**When you finish this:** your versions match the rest of the class.

Solana tooling moves fast enough that a three-month-old blog post is often wrong. When forty people debug together, mismatched versions waste more time than any real bug.

Get onto these versions. If you cannot, say so in the channel *before* you ask for help.

> ⚠️ **TODO — author: confirm these pins before publishing**
> The versions in the table below need to be checked against what the class is actually standardised on this term.

| Tool | Check | We are on | Fix a mismatch |
|---|---|---|---|
| Rust | `rustc --version` | 1.91.x | `rustup update stable` |
| Solana | `solana --version` | 3.0.x | `agave-install update` |
| Anchor | `anchor --version` | 0.32.1 | `avm install 0.32.1 && avm use 0.32.1` |
| Node | `node --version` | 22 or 24 | `nvm install --lts` |

A patch-level difference is fine. A minor-version difference in Anchor is not.

`0.31` and `0.32` generate different client code, and code from one will not compile against the other.

> **Save this line**
> Start any help request with the output of the verify script at the bottom of this page. Half the replies you would otherwise get are "what version are you on".
