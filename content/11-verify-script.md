# Verify script — `solana-doctor`

> **Copy this whole block**

Paste this into your terminal. It prints one line per tool, marking each present or missing, then shows your current cluster and wallet. Run it before asking for help, and paste the output with your question.

```bash
#!/usr/bin/env bash
# solana-doctor — checks the toolchain for Solana Fall School

for t in rustc cargo solana anchor avm node yarn; do
  if command -v "$t" >/dev/null 2>&1; then
    printf 'ok   %-7s %s\n' "$t" "$("$t" --version 2>/dev/null | head -1)"
  else
    printf 'MISS %-7s not on PATH\n' "$t"
  fi
done

echo
solana config get 2>/dev/null | grep -E 'RPC URL|Keypair Path'
echo "address: $(solana address 2>/dev/null || echo 'no keypair yet')"
echo "balance: $(solana balance 2>/dev/null || echo 'unreachable')"
```

Healthy output has seven `ok` lines, an RPC URL pointing at devnet, and a balance. Any `MISS` line names the tool to reinstall from checkpoint 2 — and only that tool.

<details>
<summary><b>Optional</b> — Keep it as a command</summary>

Save it once and call it by name whenever something feels off:

```bash
mkdir -p ~/bin
# paste the script into ~/bin/solana-doctor, then:
chmod +x ~/bin/solana-doctor
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
solana-doctor
```

</details>
