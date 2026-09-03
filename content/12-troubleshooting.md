# Troubleshooting

> **When it breaks**

Ranked by how often it actually happens in a room of forty people.

---

<details>
<summary><b>Error</b> — Deploy failed and now I have no SOL</summary>

Buffer accounts from the failed deploy are holding it. Close them and check what came back:

```bash
solana program close --buffers
solana balance
```

Do this *before* you retry the deploy, every time. Retrying without it is how people end up at zero with nothing deployed.

</details>

<details>
<summary><b>Error</b> — Faucet says rate limited</summary>

There is a cooldown between requests. Waiting it out is the only real fix.

This is why checkpoint 4 tells you to fund your wallet at the start. If you are blocked and up against the deadline, post your address in the course Discord.

</details>

<details>
<summary><b>Error</b> — GitHub sign-in refused at the faucet</summary>

The faucet verifies GitHub accounts, and very new accounts sometimes fail that check.

Ask a TA in the course Discord to send devnet SOL to your address directly. Post the output of `solana address`.

</details>

<details>
<summary><b>Error</b> — 429 or timeout errors during deploy</summary>

The public devnet RPC is shared and overloaded. A deploy sends many transactions quickly, so it hits the limit before anything else does.

Switch to a free Helius devnet endpoint and retry:

```bash
solana config set --url <your-helius-devnet-url>
```

Check `solana program close --buffers` first if the deploy already failed once.

</details>

<details>
<summary><b>Error</b> — command not found: solana / anchor / avm</summary>

PATH, essentially always. Either you have not opened a new terminal since installing, or the export line went into the wrong shell profile. Check with `echo $SHELL`, then append the export to `.bashrc` or `.zshrc` — see the hint under checkpoint 2.

On macOS, also check you do not have a Homebrew Rust shadowing the rustup one: `which -a rustc` should show only the `~/.cargo/bin` path.

</details>

<details>
<summary><b>Error</b> — could not exec the linker cc — Permission denied (os error 13)</summary>

Missing build dependencies on Linux or WSL, despite what the message implies about permissions. Run the `apt-get install` block from checkpoint 0, then retry the Anchor install. Do not prefix `cargo` or `avm` with `sudo` — that creates root-owned files in your cargo directory and a second, worse problem.

</details>

<details>
<summary><b>Error</b> — No such file or directory (os error 2)</summary>

Anchor tried to spawn a binary and will not say which. Ask it directly — whichever comes back empty is your answer:

```bash
which rustc cargo solana anchor node yarn cargo-build-sbf
```

During `anchor test` specifically, this usually means Node or Yarn is missing, since the test template is TypeScript.

</details>

<details>
<summary><b>Error</b> — anchor test fails with a port already in use</summary>

Something is already holding port 8899, so the new validator cannot bind.

Two causes. Either a previous run crashed and left its validator behind, or you started `solana-test-validator` yourself — for example in the optional detour under checkpoint 6 — and never stopped it.

Same fix for both:

```bash
pkill -f solana-test-validator
anchor test
```

</details>

<details>
<summary><b>Error</b> — DeclaredProgramIdMismatch</summary>

The ID in `declare_id!` does not match the keypair the program was deployed under. Standard after a fresh clone or a `target/` wipe:

```bash
anchor keys sync
anchor build
anchor deploy
```

</details>

<details>
<summary><b>Error</b> — Account not found in the explorer</summary>

You are looking at mainnet. Append `?cluster=devnet` to the URL, or pick the cluster in the explorer's top-right dropdown. Anything deployed by `anchor test` will not appear there at all — that network only existed for the duration of the command.

</details>

<details>
<summary><b>Error</b> — solana airdrop fails / 429 Too Many Requests</summary>

`solana airdrop` goes through the public devnet RPC, which rate limits by IP. A lecture hall on one wifi network hits that limit constantly.

Use [faucet.solana.com](https://faucet.solana.com) signed in with GitHub instead, as checkpoint 4 describes. Ask once rather than repeatedly.

On localnet none of this applies — `solana airdrop 100` works instantly and as often as you like.

</details>

<details>
<summary><b>Error</b> — Builds are unbearably slow on Windows</summary>

Your project is on `/mnt/c`. Every file read crosses from WSL to the Windows filesystem, which is roughly an order of magnitude slower. Move it:

```bash
cp -r /mnt/c/Users/you/hello_solana ~/
cd ~/hello_solana && anchor build
```

</details>

<details>
<summary><b>Error</b> — lock file version 4 requires -Znext-lockfile-bump</summary>

Your Rust is older than the lockfile the project's dependencies expect. `rustup update stable` fixes it. The general shape of this class of error is a dependency requiring a newer toolchain than you have — read the version it names before editing anything, and use `cargo tree -i <crate>` to find which dependency pulled it in.

</details>

---

*Guide 01 · never commit a keypair · commands verified against solana.com/docs, August 2026*
