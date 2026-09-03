# Checkpoint 05 — Send a transaction

> **Transaction lifecycle** · `Network` **devnet**

**When you finish this:** a confirmed transaction you can open in the explorer.

Send a transaction yourself, then read back what the network recorded.

This runs on devnet because you need a link other people can open. The whole thing costs 5000 lamports — essentially nothing.

---

## Make somewhere to send it

Create a second keypair to receive the transfer:

```bash
solana-keygen new --no-bip39-passphrase --silent -o ~/throwaway.json
solana address -k ~/throwaway.json
```

It prints the throwaway address.

## Send

Transfer 0.1 SOL to it:

```bash
solana transfer $(solana address -k ~/throwaway.json) 0.1 --allow-unfunded-recipient
```

You get back a **signature** — a long base58 string. Copy it.

That signature is the transaction's identity. It exists because your keypair signed the message; the network did not assign it.

Now ask the network what happened:

```bash
solana confirm -v <YOUR_SIGNATURE>
```

---

## Read what you just did

Open the signature in the explorer. Keep the cluster parameter on the end.

```
https://explorer.solana.com/tx/<YOUR_SIGNATURE>?cluster=devnet
```

Match what you see on the page against the terms below:

| What you see | What it is |
|---|---|
| **Signature** | The transaction ID, produced by signing rather than assigned |
| **Fee payer** | The first signer. Pays whether or not the transaction succeeds |
| **Fee** | 5,000 lamports per signature, taken up front |
| **Instructions** | One call to the System Program. Programs do the work; a transaction just carries instructions |
| **Account inputs** | Every account the instruction touches, listed in advance and marked writable or read-only |
| **Slot** | Which block a validator packed it into |
| **Status** | Processed, then confirmed, then finalized — three levels of "it happened" |

> **The idea behind what you just did**
>
> A Solana transaction declares every account it will read or write *before* it runs.
>
> That one constraint is why the runtime can execute unrelated transactions in parallel. It also explains most of what looks like boilerplate in an Anchor program.
>
> You just sent the simplest possible example of it.

<details>
<summary><b>Hint</b> — Transaction simulation failed: insufficient funds</summary>

Check `solana balance` and `solana config get`.

Either the faucet SOL never landed, or you are pointed at a cluster where your wallet is empty.

Same fix for both: confirm the RPC URL, then fund the address that `solana address` prints.

</details>

<details>
<summary><b>Optional</b> — If devnet's public RPC is throwing errors</summary>

The default public devnet RPC is shared by everyone and rate limited. Deploys hit it hardest, sending many transactions in quick succession.

If you see 429 errors or timeouts, get a free devnet endpoint from Helius and point your CLI at it:

```bash
solana config set --url <your-helius-devnet-url>
```

This is a fallback, not a required step. Skip it unless the public RPC is actually failing on you.

</details>
