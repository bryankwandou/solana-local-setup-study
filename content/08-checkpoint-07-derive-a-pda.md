# Checkpoint 07 — Derive a PDA

> **Program derived addresses** · `Network` **localnet** — nothing to fund

**When you finish this:** a PDA you derived yourself, and proof that deriving is not creating.

A PDA is an address computed from a program ID plus some seeds. It has no private key, which is exactly why programs use it to own state.

Deriving one is pure local maths. No network, no SOL, nothing to fund.

In your `hello_solana` directory, create `pda.js`:

```js
const { PublicKey } = require("@coral-xyz/anchor").web3;

const programId = new PublicKey(process.argv[2]);
const seed = process.argv[3] ?? "counter";

const [pda, bump] = PublicKey.findProgramAddressSync(
  [Buffer.from(seed)],
  programId
);

console.log("program", programId.toBase58());
console.log("seed   ", seed);
console.log("pda    ", pda.toBase58());
console.log("bump   ", bump);
```

Run it with your own program ID from `anchor keys list`:

```bash
node pda.js <YOUR_PROGRAM_ID> counter
```

---

## Three things to try

1. Run it twice with the same seed. Same address, every time, on every machine. Nothing was stored anywhere — the address is *computed*.
2. Change the seed to `vault`. Completely different address, from the same program. This is how one program keeps thousands of separate accounts without tracking a single keypair.
3. Look up the address you derived. It does not exist:

```bash
solana account <THE_PDA>   # Error: AccountNotFound
```

> **Deriving is not creating**
>
> You just computed an address that nobody owns and nothing occupies.
>
> Making it a real account takes a transaction where the program allocates space and pays rent — a one-off deposit for storing data on chain, refunded when the account closes.
>
> In Anchor that becomes the `seeds` and `bump` constraints on an `init` account. The address existed before the account did.

<details>
<summary><b>Hint</b> — What the bump is for</summary>

Roughly half of all seed-and-program-ID combinations land on the Ed25519 curve, meaning a private key could exist for them — useless for a program-owned address. So the derivation appends one extra byte, the bump, and counts down from 255 until the result falls off the curve.

`findProgramAddressSync` returns the first value that works. That one is called the **canonical bump** — the bump everyone agrees to use for a given set of seeds.

Programs should always use it. A program that accepts any bump has effectively created several valid addresses for the same seeds, which is a real class of exploit.

</details>

<details>
<summary><b>Hint</b> — Cannot find module '@coral-xyz/anchor'</summary>

You are outside the project directory, or dependencies never installed. From `~/solana/hello_solana`, run `yarn install` and try again.

</details>
