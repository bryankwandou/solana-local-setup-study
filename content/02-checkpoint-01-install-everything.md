# Checkpoint 01 — Install everything

> **The fast path**

**When you finish this:** all five tools installed and printing versions.

One script installs the whole toolchain. Try it first. If it completes, skip checkpoint 2 entirely.

```bash
curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash
```

It finishes by printing what it installed:

```
Installed Versions:
Rust: rustc 1.91.1 (ed61e7d7e 2025-11-07)
Solana CLI: solana-cli 3.0.10 (src:96c3a851; feat:3604001754, client:Agave)
Anchor CLI: anchor-cli 0.32.1
Surfpool CLI: surfpool 0.12.0
Node.js: v24.10.0
Yarn: 1.22.1
```

Surfpool is a local validator. The installer bundles it, this guide does not use it, and it comes up in a later class. Ignore it for now.

> ⚠️ **This takes 10 to 20 minutes**
>
> Most of that is compiling the Anchor CLI from source. The terminal looks frozen and your fan gets loud. That is normal.
>
> Do not interrupt it. If you kill it halfway, you will need checkpoint 2 to finish the job by hand.

**Close your terminal and open a new one.** The script edited your shell profile and the current session has not read it.

Now check all five tools:

```bash
rustc --version && solana --version && anchor --version && \
node --version && yarn --version
```

> ✅ **Five lines of output**
>
> If all five print a version, you are done. Skip checkpoint 2 and go to checkpoint 3.
>
> If a line says `command not found`, that one tool did not land. Install just that one from checkpoint 2.
