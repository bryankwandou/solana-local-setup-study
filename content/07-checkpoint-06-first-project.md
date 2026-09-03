# Checkpoint 06 — First project

> **Scaffold and build** · `Network` **localnet** — no SOL needed

**When you finish this:** a generated Anchor project that builds and passes its test.

Anchor generates a working program, a test, and the config that ties them together.

Everything here runs on your own machine. `anchor test` handles the network itself, so there is no faucet and no SOL involved.

Do this somewhere sensible — on WSL, inside your Linux home directory:

```bash
mkdir -p ~/solana && cd ~/solana
anchor init hello_solana
cd hello_solana
```

---

## What it made

| Path | What it holds | You edit it? |
|---|---|---|
| `programs/hello_solana/src/lib.rs` | The on-chain program | Constantly |
| `tests/hello_solana.ts` | TypeScript tests that call it | Constantly |
| `Anchor.toml` | Cluster, wallet, program IDs | Sometimes |
| `target/deploy/` | Compiled `.so` and the program keypair | Never by hand |
| `target/idl/` | Generated interface the client reads | Never by hand |

Open `lib.rs` and read it before building. It is about fifteen lines: a program ID, one instruction, one log.

The instruction takes a `Context` listing its accounts — the same up-front account declaration you saw in the explorer at checkpoint 5. Everything you write this term is a variation on that shape.

---

## Build it

Compile the program to SBF bytecode:

```bash
anchor build
```

Expect no output for a long time. That is normal.

> **The first build takes 5 to 15 minutes**
> It compiles the entire dependency tree from source. Later builds take seconds. Do not cancel it just because nothing is printing.

Building also generates a keypair for your program. Its public key is the program ID.

That ID appears in two text files as well, and they start out disagreeing with the keypair. Sync them:

```bash
anchor keys sync
anchor keys list
```

Both should now print the same program ID.

<details>
<summary><b>Hint</b> — Why a program has its own keypair</summary>

A program on Solana lives in an account like everything else, and that account needs an address. `anchor build` generates one at `target/deploy/hello_solana-keypair.json`. The address is baked into your compiled binary through the `declare_id!` macro, so if `lib.rs` claims one ID and the deployed account sits at another, every instruction fails with `DeclaredProgramIdMismatch`.

`anchor keys sync` rewrites `declare_id!` and `Anchor.toml` to match the keypair. Run it after your first build and any time you clone someone else's repo.

</details>

---

## Test it

Build, deploy locally, and run the TypeScript tests:

```bash
anchor test
```

You should see one passing test and a transaction signature.

That single command started a disposable network on your machine, deployed to it, ran the tests, then tore the network down. You never start or stop anything yourself.

> ✅ **Target output**
> One passing test means Rust, the Solana CLI, Anchor, and Node all worked together. That is the whole point of this guide.

<details>
<summary><b>Optional · 5 min</b> — See the validator that anchor test hides</summary>

`anchor test` starts and stops a local validator for you, so you never see one. Run it yourself once to see what is actually happening, and to meet `solana logs` — the real debugging tool for Solana work.

Start a validator in a second terminal and leave it running:

```bash
solana-test-validator          # leave this running
solana config set --url localhost
solana airdrop 100
solana balance
```

100 SOL, instantly. No GitHub sign-in, no cooldown, no faucet page. Compare that to what you just went through on devnet.

Now open a third terminal and watch the network:

```bash
solana logs
```

Every `msg!` your program prints shows up here live. This is how you debug a program that is misbehaving.

### Clean up — not optional

Point your CLI back at devnet and stop the validator:

```bash
solana config set --url devnet
pkill -f solana-test-validator
```

> ⚠️ **Skip the cleanup and checkpoint 8 breaks**
>
> A validator left running holds port 8899.
>
> The next `anchor test` then fails with a port-in-use error that looks nothing like its actual cause, and you will lose time hunting the wrong problem.

</details>
