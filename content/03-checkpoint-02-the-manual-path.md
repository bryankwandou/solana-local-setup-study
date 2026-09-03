# Checkpoint 02 — The manual path

> **Only if checkpoint 1 failed**

**When you finish this:** the tools checkpoint 1 missed, installed by hand.

Install one at a time, in this order, verifying each before moving on. Anchor depends on Rust and on the checkpoint 0 libraries, so order matters.

If only one tool is missing, jump straight to that block.

---

## Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
. "$HOME/.cargo/env"
rustc --version
```

## Solana CLI

```bash
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
solana --version
```

<details>
<summary><b>Aside</b> — Why it says client:Agave</summary>

The CLI is built by Anza and reports itself as `client:Agave`. Same tool — the validator client was renamed.

To update it later, run `agave-install update`, which pulls the newest stable release.

</details>

<details>
<summary><b>Hint</b> — solana: command not found after installing</summary>

PATH, essentially always. The installer printed a line and you did not run it. Find your shell first, because the file differs:

```bash
echo $SHELL   # /bash → .bashrc,  /zsh → .zshrc
```

Then append the line permanently and reload:

```bash
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Swap `.bashrc` for `.zshrc` if that is your shell. Typing `export PATH=...` directly into the terminal also works, but only until you close that window — which is why people think the install broke overnight.

</details>

---

## Node and Yarn

Anchor's test template is TypeScript, so `anchor test` needs both.

Install Node through nvm rather than your system package manager, so you can switch versions per project.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# restart your terminal, then:
nvm install --lts
npm install -g yarn
node --version && yarn --version
```

---

## Anchor, through AVM

Install the version manager, not the framework directly. Anchor makes breaking changes between minor versions, and you will eventually need two versions for two projects.

```bash
curl -sSfL https://raw.githubusercontent.com/otter-sec/anchor/master/avm/install | sh
avm --version

avm install latest
avm use latest
anchor --version
```

> **Two things people trip on here**
>
> `avm install` downloads a version. `avm use` is what points the `anchor` command at it. Skip the second and `anchor --version` keeps reporting the old one.
>
> This build takes several minutes and needs the checkpoint 0 libraries. `could not exec the linker cc` means you skipped them.

> ⚠️ **TODO — author: verify this URL before publishing**
>
> The AVM installer URL has moved between repositories more than once. Check the line above against [solana.com/docs/intro/installation/dependencies](https://solana.com/docs/intro/installation/dependencies) and update it before this guide is published.
>
> Students: opening that page to confirm a URL before piping any script into your shell is a habit worth more than this guide.
