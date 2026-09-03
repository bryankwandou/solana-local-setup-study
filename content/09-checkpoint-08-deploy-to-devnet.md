# Checkpoint 08 — Deploy to devnet

> **A real network** · `Network` **devnet** — this is the expensive step

**When you finish this:** your program live on devnet, visible in the explorer.

Same program as checkpoint 6, but a network you do not control. It costs real devnet SOL and takes a minute rather than a second.

Follow these six steps in order. Do not skip step 4.

---

## 1 · Check where you are and what you have

```bash
solana config get       # RPC URL must say devnet
solana balance          # need at least 3 SOL
```

Short on SOL? Go back to checkpoint 4 and use the faucet before you continue.

## 2 · Point Anchor at devnet

Edit `Anchor.toml`:

```toml
[provider]
cluster = "devnet"
wallet = "~/.config/solana/id.json"
```

## 3 · Build

```bash
anchor build
```

This should take seconds — you already built once.

## 4 · Preview the cost before you spend it

Ask what storing the compiled program will cost:

```bash
solana rent $(wc -c < target/deploy/hello_solana.so)
```

Expect a figure in the region of 2 to 3 SOL for a small Anchor program.

Two things make it that high. Solana allocates roughly double your binary size, leaving room to upgrade the program later.

The deploy also creates **buffer accounts** — temporary accounts that hold your program's bytes while they upload. They cost SOL too.

## 5 · Deploy

```bash
anchor deploy
```

It prints your program ID when it succeeds.

## 6 · If the deploy failed, run this before retrying

```bash
solana program close --buffers
```

> ⚠️ **Do not just run anchor deploy again**
>
> A failed deploy leaves buffer accounts holding your SOL.
>
> Retry without closing them and you will run out of SOL with nothing deployed — and then you are waiting on the faucet cooldown.
>
> Close the buffers, check `solana balance`, then retry.

---

## See it on the network

Open your program ID in the explorer, keeping the cluster on the URL:

```
https://explorer.solana.com/address/<PROGRAM_ID>?cluster=devnet
solana program show <PROGRAM_ID>
```

Your program is now an account on a public network, owned by the BPF loader, holding your compiled bytecode. Same account model as everything else you have touched today.

> **Forgetting `?cluster=devnet`**
>
> This is the single most common source of confusion here. Without it, the explorer looks on mainnet, finds nothing, and says the account does not exist.
>
> Your deploy was fine. This costs people about twenty minutes each, once.

---

## Clean up when you are done

Close the program to reclaim most of the SOL:

```bash
solana program close <PROGRAM_ID> --bypass-warning
solana program close --buffers   # reclaims leftovers from failed deploys
```

Have a look at it in the explorer first — closing is irreversible.

<details>
<summary><b>Optional</b> — If devnet's public RPC is throwing errors</summary>

Deploys hit the shared public RPC hard, sending many transactions in quick succession. 429 errors and timeouts here are common.

If that happens, get a free devnet endpoint from Helius and point your CLI at it, then retry from step 1:

```bash
solana config set --url <your-helius-devnet-url>
```

Optional fallback. Only bother if the public RPC is failing on you.

</details>
