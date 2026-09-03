# Checkpoint 00 — Prepare your OS

> **Before anything else**

**When you finish this:** your machine has the system libraries every later step depends on.

Everything after this checkpoint is identical on all three platforms. Do only the block that matches your machine, then rejoin at checkpoint 1.

---

## Windows

Solana tooling does not run on Windows natively. WSL gives you a real Ubuntu inside Windows. Run this in **PowerShell as administrator**:

```bash
wsl --install
```

Reboot, then open the **Ubuntu** app from the Start menu and set a username and password.

From here on, "your terminal" means that Ubuntu window, never PowerShell. Run the Linux block below inside it.

> **Where you put your project matters**
>
> Keep your code in the Linux home directory (`~/solana`), not in `/mnt/c/Users/...`.
>
> Reading Windows files from WSL crosses a filesystem boundary. A `cargo build` that takes 90 seconds in `~` can take ten minutes on `/mnt/c`.
>
> To edit in VS Code, install the WSL extension and open the folder from inside Ubuntu with `code .`

---

## Linux and WSL

Anchor compiles from source and needs a C toolchain plus a few libraries. Missing these is the most common install failure.

```bash
sudo apt-get update
sudo apt-get install -y \
    build-essential \
    pkg-config \
    libudev-dev llvm libclang-dev \
    protobuf-compiler libssl-dev
```

> **If apt says protobuf-compiler is not available**
> You skipped `apt-get update`. Run it and try again. On Fedora or RHEL the equivalents are `gcc gcc-c++ pkgconf-pkg-config systemd-devel llvm clang-devel protobuf-compiler openssl-devel`.

---

## macOS

Install Apple's command line tools, which include the linker Rust calls.

```bash
xcode-select --install
xcode-select -p   # should print a path, not an error
```

If they were already installed, the first line says so and the second prints a path.

> ⚠️ **Do not install Rust with Homebrew**
>
> Use rustup instead — the next checkpoint does it for you. A Homebrew Rust lands in a directory Anchor does not search.
>
> The failure shows up much later as `No such file or directory (os error 2)`. If you already have one: `brew uninstall rust`.
