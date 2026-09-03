# Run log — this guide, executed on Windows 11 native

> **Not part of the original guide.** This is the field report from actually running all ten checkpoints on one machine on 3 September 2026. Checkpoint 9 asks you to write down what broke. This is that.

The guide assumes macOS, Linux, or WSL. This machine is Windows 11 with the whole toolchain installed **natively**, no WSL distro. Eight of ten checkpoints ran clean. Two broke, both in ways the guide half-predicted.

---

## What was already on the machine

The install checkpoints (1 and 2) were no-ops — everything was present:

```
ok   rustc   rustc 1.89.0 (29483883e 2025-08-04)
ok   cargo   cargo 1.89.0 (c24e10642 2025-06-23)
ok   solana  solana-cli 3.1.13 (src:a568b955; feat:534737035, client:Agave)
ok   anchor  anchor-cli 0.32.1
ok   avm     avm 0.32.1
ok   node    v24.13.0
ok   yarn    1.22.22
```

Note the mismatches against the class baseline in checkpoint 3: Rust is **1.89**, not 1.91, and the Solana CLI is **3.1.13**, not 3.0.x. Anchor was on 1.0.0 and had to be pinned down:

```bash
avm use 0.32.1     # → anchor-cli 0.32.1
```

Everything built and deployed fine on those versions. The Anchor pin is the one that actually mattered.

---

## Checkpoint 4 — wallet

The config pointed at a keypair file that did not exist:

```
Keypair Path: C:\Users\arche\.config\solana\sayso-deployer.json
Error: No default signer found
```

That is checkpoint 4's whole lesson landing early: `solana config get` is the first thing to read, not the last.

The faucet was never used. An existing devnet wallet on this machine already held **181.7 SOL**, so the config was simply pointed at it:

```bash
solana config set --url devnet --keypair ~/.config/solana/darurat.json
```

---

## Checkpoint 5 — transaction ✅

```
Signature: 2SaSh1axKzUtHBGqU4R8Erz1ApJJcK89GyhGjw4jpdCfzJqJMSkjZwhWqa3t8Wg8nFHPEpjeQyhvhkAWeYU6GGAN
```

`solana confirm -v` printed exactly the anatomy the guide's table describes:

```
Transaction executed in slot 492312540:
  Account 0: srw- 35z7X59rtyts557Up1RAwpyYN7x2cFqcDc7RjPuNxFzr (fee payer)
  Account 1: -rw- 5udor8A2VWgFxqYfyaF9fBDJNpwJvGcXptrNMTJshFxe
  Account 2: -r-x 11111111111111111111111111111111
  Instruction 0
    Program:   11111111111111111111111111111111 (2)
    Transfer { lamports: 100000000 }
  Status: Ok
    Fee: ◎0.000005
  Compute Units Consumed: 150
Finalized
```

`srw-` on account 0 and `-rw-` on account 1 is the up-front account declaration the guide keeps pointing at — signer, writable, read-only, all fixed before execution.

Fee: 5,000 lamports. Exactly as documented.

---

## 🔴 Break #1 — `anchor init` left the project half-built

```
$ anchor init hello_solana
Error: program not found
```

Exit code 0, but only seven files landed. Missing: `package.json`, `tsconfig.json`, `tests/`, `migrations/`.

**Cause.** Anchor shells out to the package manager to finish the scaffold. On Windows that spawn failed, and Anchor reported it as `program not found` — the OS's phrase for "executable not found", not anything about a Solana *program*. Two different meanings of the same word, in the one error message.

**Fix.** Wrote the four missing files by hand from the standard Anchor 0.32 template. They are plain boilerplate.

Then dependencies. Yarn died on the network:

```
error https://registry.yarnpkg.com/@noble/curves/-/curves-1.9.7.tgz: ESOCKETTIMEDOUT
```

npm with a longer fuse worked:

```bash
npm install --fetch-timeout=600000 --fetch-retries=8
```

---

## Checkpoint 6 — build ✅

```
Compiling hello_solana v0.1.0
Finished `test` profile in 6m 00s
```

Six minutes, inside the guide's 5–15 minute estimate. `target/idl/hello_solana.json` and `target/types/hello_solana.ts` both generated.

```bash
$ anchor keys sync
All program id declarations are synced.

$ anchor keys list
hello_solana: 4AxRhzD1QKxfJGsF4je1dpR4FxZsd2yHJCLUCZsfsvBh
```

---

## 🔴 Break #2 — the local validator cannot start on Windows

```
$ anchor test
Unable to get latest blockhash. Test validator does not look started.
```

The ledger log gave the real reason:

```
Error: failed to start validator: Failed to create ledger at .anchor\test-ledger:
io error: Error checking to unpack genesis archive: IO error: Access is denied. (os error 5)
```

Reproduced standalone with `solana-test-validator` in a clean directory, so it is not an Anchor problem — `solana-test-validator` itself cannot unpack its genesis archive on this Windows filesystem.

**This is the wall the guide's very first note warns about.** "Anchor does not run on Windows natively." The tools install and build fine; it is the local validator that stops.

Then a second, funnier failure while working around it:

```
$ anchor test --skip-local-validator
Windows Subsystem for Linux has no installed distributions.
```

**Cause.** Anchor runs the `[scripts] test` line through `bash`. On Windows, `bash.exe` in `System32` is the **WSL launcher**, not a shell. With no distro installed, it exits immediately. Anchor was never running the test — it was trying to open Ubuntu.

**Fix.** Ran the exact same suite directly, against the devnet-deployed program instead of a local validator:

```bash
ANCHOR_PROVIDER_URL="https://api.devnet.solana.com" \
ANCHOR_WALLET="~/.config/solana/darurat.json" \
npx ts-mocha -p ./tsconfig.json -t 1000000 "tests/**/*.ts"
```

```
  hello_solana
Your transaction signature 3HaHCUCFnYH9C1sjEWYoZL3uApCx6Hq94jP7sa2Zx3gHEADx9TypEzXqoYzQzMgRs46zkBf2MVJ8mKQHzD1KiUhX
    ✔ Is initialized! (1541ms)

  1 passing (2s)
```

One passing test — checkpoint 6's target output, reached on devnet rather than localnet. Rust, the CLI, Anchor, and Node all proved to work together, which is the point. The localnet path stays blocked until WSL is installed.

**The proper fix** is checkpoint 0's Windows block: `wsl --install` from an elevated PowerShell, then reboot. Attempted here; it returned *"The requested operation requires elevation"* and *"Changes will not be effective until the system is rebooted."* Left for the user.

---

## Checkpoint 7 — PDA ✅

Same seed, twice, same address:

```
program 4AxRhzD1QKxfJGsF4je1dpR4FxZsd2yHJCLUCZsfsvBh
seed    counter
pda     GziSEfLP7Exk2E9PcALe8hfHYpvCgoejq99Wgd1j8Nyx
bump    255
```

Seed `vault`, same program, completely different address:

```
pda     FZPpvZWDQTUrRzbucbS9f5Vq7niwPGXA83LeMWMrhEVS
bump    255
```

And the point of the checkpoint:

```
$ solana account GziSEfLP7Exk2E9PcALe8hfHYpvCgoejq99Wgd1j8Nyx
Error: AccountNotFound
```

Both derivations came back with bump **255** — the first byte tried, off the curve on the first attempt. That is luck, not a rule; 254 and below are common.

---

## Checkpoint 8 — deploy ✅

```bash
$ solana rent $(wc -c < target/deploy/hello_solana.so)
Rent-exempt minimum: 1.143131832 SOL
```

The guide says 2–3 SOL. This was 1.14 for the 180,376-byte binary, and the *deploy* cost roughly 2.3 SOL total once the buffer is counted — which is where the guide's figure comes from.

```
Program Id: 4AxRhzD1QKxfJGsF4je1dpR4FxZsd2yHJCLUCZsfsvBh
Signature: 567xV5S4aJ9sAtTyfK9mBapN9rp9PcoJDAZxHayYTNkHbnaDrzrAtxVE6pWHyEJGUCyDkYpcK3fnadjBZ1wMuejw
Idl account created: E8U2EBsPVkEoU4tH1RWGMuEZx4f3LdPBvcu6q7SQZczJ
Deploy success
```

```
Owner: BPFLoaderUpgradeab1e11111111111111111111111
ProgramData Address: 6PWVUHD8ATqjXJVwjrqJQbxP172F3ug8p66kRWbJ1USd
Data Length: 180376 (0x2c098) bytes
Balance: 1.143416817 SOL
```

**A buffer survived a successful deploy.** The guide frames buffer cleanup as a failure-recovery step, but one was sitting there holding 1.55 SOL after a deploy that printed `Deploy success`:

```
62GHbZZGtLU9FLPgR7jGsJnA1zw44wD22Nf8h3A87kd4 | 1.55116824 SOL
```

Balance went 190.51 → 192.07 SOL after `solana program close --buffers`. Run it after every deploy, not just failed ones.

---

## Checkpoint 9 — the five points

| # | Check | Result |
|---|---|---|
| 1 | Verify script runs clean | ✅ seven `ok`, devnet RPC, balance present |
| 2 | Test passing | ✅ 1 passing — on devnet, not localnet |
| 3 | Transfer signature in explorer | ✅ [`2SaSh1a…`](https://explorer.solana.com/tx/2SaSh1axKzUtHBGqU4R8Erz1ApJJcK89GyhGjw4jpdCfzJqJMSkjZwhWqa3t8Wg8nFHPEpjeQyhvhkAWeYU6GGAN?cluster=devnet) |
| 4 | Program ID in explorer | ✅ [`4AxRhzD1…`](https://explorer.solana.com/address/4AxRhzD1QKxfJGsF4je1dpR4FxZsd2yHJCLUCZsfsvBh?cluster=devnet) |
| 5 | Describe what broke | Below |

**Point five.** Two things broke, and neither error message named its real cause.

`anchor init` said `program not found` when it meant *the package-manager executable is not on PATH* — "program" being the OS's word, not Solana's. And `anchor test` said *WSL has no installed distributions* when it meant *Anchor runs its test script through `bash`, and on Windows `bash.exe` is the WSL launcher*. In both cases the fix was upstream of the message, in a tool the message never mentioned.

That is checkpoint 1's advice in practice: **name the tool first.** Neither failure was Anchor's, and neither was Solana's.

---

## Verdict on running this natively on Windows

| Checkpoint | Native Windows |
|---|---|
| 0 · Prepare OS | ⚠️ WSL not installed; native tools work anyway |
| 1 · Install everything | ✅ already present |
| 2 · Manual path | ✅ not needed |
| 3 · Pin versions | ✅ `avm use 0.32.1` |
| 4 · Wallet and config | ✅ |
| 5 · Send a transaction | ✅ |
| 6 · First project | ⚠️ builds and tests, but only against devnet — no local validator |
| 7 · Derive a PDA | ✅ |
| 8 · Deploy to devnet | ✅ |
| 9 · Check your work | ✅ |

Everything that talks to a *remote* network works natively. Everything that needs a *local* network does not. Install WSL before the term starts.
