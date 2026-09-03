# Checkpoint 04 — Wallet and config

> **Keys and clusters** · `Network` **devnet**

**When you finish this:** a wallet with about 5 devnet SOL in it, and a CLI pointed at devnet.

The CLI keeps one small config file. It decides which network your commands talk to and which keypair signs them.

Almost every "it worked yesterday" story is one of those two being different from what you assumed. Look at it first:

```bash
solana config get
```

You should see something like this:

```
Config File: /Users/you/.config/solana/cli/config.yml
RPC URL: https://api.mainnet.solana.com
WebSocket URL: wss://api.mainnet.solana.com/ (computed)
Keypair Path: /Users/you/.config/solana/id.json
Commitment: confirmed
```

---

## Point at devnet

Switch the network your commands talk to:

```bash
solana config set --url devnet
solana config get   # confirm the RPC URL now says devnet
```

The RPC URL should now say devnet. Check it before you blame your code — this one line explains a lot of confusing errors.

<details>
<summary><b>Aside</b> — Short forms for switching cluster</summary>

`solana config set -ud` does the same thing as `--url devnet`. `-um` switches to mainnet and `-ul` switches to your local machine.

</details>

---

## Create a keypair

Write a new keypair to the default path:

```bash
solana-keygen new
solana address
```

It prints a public key and a twelve-word seed phrase. That public key is your address on every Solana network at once.

> **Treat this key as disposable, and never commit it**
>
> `id.json` is an unencrypted private key sitting on disk. Fine for a course where it only holds test SOL. Not fine for anything with value.
>
> It must never reach GitHub. A bot will find it within minutes and drain it.
>
> Anchor's `.gitignore` covers `target/deploy/*.json`. If you copy a keypair anywhere else in the repo, add that path yourself. Never reuse this key on mainnet.

---

## Get devnet SOL from the faucet

Do this now, at the start. Four steps:

1. Go to [faucet.solana.com](https://faucet.solana.com).
2. **Sign in with GitHub.** This unlocks the higher limit of **5 SOL**. The faucet works signed out, but gives you less than the checkpoint 8 deploy needs.
3. Paste in the address that `solana address` printed.
4. Confirm it landed.

```bash
solana balance
```

You want to see roughly 5 SOL.

> ⚠️ **Fund your wallet now, not before the deploy**
>
> Faucet requests are rate limited with a cooldown between them.
>
> If you reach checkpoint 8 short of SOL, you may be waiting hours to top up. Get your 5 SOL at the start and the rest of the guide never blocks.

> **If GitHub sign-in is refused**
> The faucet verifies GitHub accounts, and very new accounts are occasionally refused. Post your address in the course Discord and a TA will send you devnet SOL directly.
