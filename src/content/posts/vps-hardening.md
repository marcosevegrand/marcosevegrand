---
title: "Hardening a Fresh VPS: Enumeration, Threat Modeling, and Defense in Depth"
date: 2026-10-11
tags: [security, linux, vps, hardening, enumeration, thread modeling]
summary: "My walkthrough of hardening a brand-new VPS, starting with Enumeration and Threat Modeling."
draft: false
---

> [!TIP] TL;DR
>
> - TBD

## 1. Why this post

I started a master's in cybersecurity and wanted to actually do something with what I was learning instead of only reading about it, so I rented a VPS and decided to harden it before installing anything. The server came with a single root account, password login enabled, and a public IP address, which is about the worst starting point a machine can have and a reasonable place to begin.

I'm not an expert. This is a student writing down what I did and what I'd do differently, not a definitive guide, and I got plenty of things wrong along the way. If you're early in this too, I think the reasoning matters more than the commands, because you can copy a command from anywhere but you still have to decide whether it belongs on your machine.

I kept the build reproducible as an Ansible repo, so the steps here line up with the sections below and you can rebuild the same setup yourself if you want.

## 2. Scope, assets, and assumptions

Before I changed anything I wrote down what the server was, what was on it, and who would realistically come after it. It's tempting to skip this and jump straight to commands, but without a clear idea of the assets and the threats you can't tell whether a control is protecting anything.

### 2.1 Starting point

| Item | Value |
|---|---|
| OS | AlmaLinux 10 (RHEL-compatible) |
| Resources | 4 vCPU, 8 GB RAM, roughly 160 GB disk |
| Network | One static public IPv4 (plus IPv6) |
| Initial access | root account with password login enabled |
| Domain and DNS | example.com, DNS hosted at Cloudflare |
| Applications | none yet, which was on purpose |

I hardened the foundation before adding applications on purpose. Doing it in that order meant I had to think about the security boundaries while there was nothing on the machine to distract me from them.

### 2.2 Assets

The things worth protecting were these:

- The host itself, since whoever owns the machine owns everything running on it.
- Admin access, meaning the SSH keys, the VPN keys, and the provider console.
- Data and configuration, which matters more once apps exist but already shapes the design.
- Backups, both the copies of the data and the credentials that reach them.
- The domain and its DNS records, since whoever controls DNS controls where users end up.
- Availability and reputation, because a server abused for spam or taken offline is a real cost even for a hobby project.

### 2.3 Adversary assumptions

A realistic threat model for a brand new VPS is mostly automated and doesn't involve sophisticated actors. I assumed this:

- Scanners that sweep the whole IPv4 space looking for open ports and known-vulnerable services, which usually hit a new server within minutes.
- Credential brute force against SSH, which is very likely with a root account and a password.
- Exploitation of exposed services once an application is running.
- Post-compromise expansion, where someone who gets into one service tries to reach data, credentials, or the host.

I also assumed my public IP is discoverable, which means I can't lean on obscurity as a control. The design had to hold even if an attacker knew exactly where the server was.

### 2.4 Constraints

Being honest about constraints makes the reasoning easier to follow:

- One server and one admin, so no team, no single sign-on, no enterprise tooling.
- Free tiers where I could, which meant Cloudflare and its R2 storage free tier instead of paid add-ons.
- A learning project, so every choice had to be something I could explain and not just copy from a script.

### 2.5 Out of scope

- The applications themselves, since a website and a file host come later and each gets its own trust boundary.
- Physical and provider-level security, because I trust the provider's datacenter and hypervisor.
- Full compliance, since I used the CIS Benchmark as a reference where it helped but this is a student project and not an audit.

With the scope and the adversary written down, the next thing I needed was a method.

## 3. Methodology

"Harden the VPS" isn't a task you can start or finish until you've decided what secure means for this specific machine, so before touching anything I settled on four things that build on each other. They are a small set of goals, a threat model, an organising principle, and a recognised baseline to measure against, plus a way to check the result at the end.

### 3.1 Goals

The goals come from the CIA triad. Confidentiality means keeping data readable only by the right people, integrity means data and configuration can't be changed without detection, and availability means the service keeps running. On a single host this turns into concrete worries: keeping keys and passwords secret, stopping an attacker from quietly changing configuration or data, and keeping the machine online and responsive.

### 3.2 Threat model with STRIDE

STRIDE is a threat modelling framework that was built for software, and it splits threats into spoofing, tampering, repudiation, information disclosure, denial of service, and elevation of privilege. Instead of pointing it at the machine as one big system, which gives you a vague result, I pointed it at each trust boundary separately, so the internet, the VPN, the host, and later each container each get their own small pass. The point isn't to produce a document, it's to make sure every control later in the post traces back to a specific threat it answers.

| Threat | Example on this host | Where the control points |
|---|---|---|
| Spoofing | Password SSH lets an attacker pretend to be the admin | Key-only auth and a VPN that gates access |
| Tampering | A compromised service changes config or data | File ownership and permissions, SELinux, read-only container filesystems |
| Repudiation | No record of who did what after an incident | auditd and centralised logs |
| Information disclosure | Backup credentials or keys leak to a compromised app | Per-service credentials and strict file permissions |
| Denial of service | A flood or a runaway process takes the server down | Firewall defaults, resource limits, Cloudflare in front |
| Elevation of privilege | A service escapes its container and reaches root | Rootless containers, dropped capabilities, SELinux |

### 3.3 Defense in depth

The organising principle is defense in depth, which just means I don't trust any single control to be the one that saves me. If the firewall is misconfigured, SELinux still limits what a process can do, and if a container is compromised the attacker lands as an unprivileged user with no path to the other services. Every layer assumes the layer in front of it already failed, which is a sturdier way to think than hunting for the one perfect setting.

### 3.4 A baseline to measure against

"Hardened" is a vague word, so I wanted an outside reference instead of my own opinion. The CIS Benchmark for AlmaLinux 10 gives concrete, checkable controls for exactly this kind of host, and NIST SP 800-123 is a broader guide to general server security. I didn't implement everything, partly because some of it assumes an enterprise environment, but using a recognised baseline kept me honest about what I skipped and why.

### 3.5 Verifying by assuming a breach

The part most hardening guides skip is verification, because it's easy to call a server secure once the commands have run. I treated the build as unproven until I could show that specific attacks fail, so the last stage is a set of tests written from the attacker's side, like trying to read another service's data from inside a container or trying to reach SSH from the internet. MITRE ATT&CK is handy here because it gives a catalogue of real techniques to test against instead of me guessing.

### 3.6 Why not something heavier

I looked at PASTA and full attack trees, which are more thorough, but for one host with one admin they add ceremony without much extra clarity. STRIDE plus defense in depth plus a known baseline covers the same ground at a scale that fits the project, and the verification stage is what gives the model teeth.

With the method settled, the first practical step was to look at the server exactly as it was before changing anything.

## 4. Enumeration

The first real task was to look at the machine from the outside and from the inside, and to save the output so I could compare it later. Enumeration is where a threat model meets reality, because it swaps assumptions about what's exposed for a list of what's actually running and reachable.

### 4.1 From the outside

I started from my own laptop, which is the same spot an attacker sits in, and scanned the public IP.

```console
# Scan every TCP port on the public IP, skipping host discovery
$ nmap -Pn -p- 203.0.113.10
PORT   STATE SERVICE
22/tcp open  ssh
```

One open port, SSH. On a fresh AlmaLinux this is expected, because firewalld is already running and denies nearly everything by default, but the default policy allows SSH so the provider and the customer can get in. The thing worth noticing is that the only exposed service is also the one with the weakest starting config, since it takes passwords and allows the root account, and that's the exact combination brute-force tools look for.

I checked IPv6 too, because a server reachable over both protocols is only as safe as the weaker one.

```bash
nmap -6 -Pn -p- 203.0.113.10
```

### 4.2 From the inside

I logged in as root over SSH and recorded the state of the machine so I could put a before and after next to each other later. These are the commands that mattered most.

```bash
# Listening sockets
ss -tulpn

# Running services
systemctl list-units --type=service --state=running

# Mandatory access control status
sestatus

# Firewall configuration
firewall-cmd --list-all

# Accounts with a usable shell
getent passwd | awk -F: '$7 !~ /(nologin|false)$/ {print $1}'

# How much software is installed
rpm -qa | wc -l
```

What stood out was that SELinux was already enforcing, so the right move was to leave it alone instead of disabling it like a lot of tutorials tell you to, and that firewalld was active with a public zone allowing only SSH and DHCPv6 client traffic. There were no application accounts or web services and the package count was small, so the attack surface was already fairly contained and the real problem was access rather than exposure.

I saved the raw output to a file so I wouldn't have to scroll back through the terminal later.

```bash
mkdir -p ~/audit
{
  date
  ss -tulpn
  systemctl list-units --type=service --state=running
  sestatus
  firewall-cmd --list-all
} > ~/audit/before.txt
```

### 4.3 What enumeration told me

Two things came out of this first look. The exposed surface was small and the real risk sat in how access was granted, since SSH with a password and a root login is the easiest way into a new server. And the platform already gave me useful building blocks in SELinux and firewalld, so the work ahead was less about installing new tools and more about configuring what was there and adding the few things that were missing.

Next I turned those observations into the threat model that would drive the rest of the build, mapping each threat to the control that answers it.

## 5. The threat model in detail

Section 3.2 gave the quick version. This is the working model I actually used, and I wrote it boundary by boundary because that's the only way it stayed specific enough to be useful. For each boundary I asked what sits on it, what could go wrong, and which control answers that.

### 5.1 The internet

This is everything outside the server that can reach it. The assets here are the public edge, the domain and its DNS, and anything the edge exposes.

The threats I cared about were denial of service, since a public IP gets hammered and I can't stop that at the server alone, exploitation of whatever the edge runs because that's the one thing internet users can talk to, discovery of the origin IP so an attacker could skip Cloudflare and hit the server directly, and traffic that pretends to come from Cloudflare so it slips through the firewall.

The controls are Cloudflare in front for DDoS and WAF, a firewall that only allows 80 and 443 from Cloudflare's IP ranges, and a client certificate requirement on top of that. Even a connection that passes the IP check fails unless it's really my Cloudflare account, because Caddy demands a certificate signed by my own CA. SSH isn't here at all, and the edge runs a placeholder with no application logic yet.

### 5.2 The admin path

This is how I get in, and it's the boundary I care about most because it's the one that leads to the host.

The threats were brute force or credential stuffing against the login, theft of an admin key, lateral movement between devices on the VPN, and leaking the endpoint's address.

WireGuard answers most of this. Each device gets its own key pair plus a pre-shared key, so revoking one device is just deleting its entry, clients only route the VPN subnet so it stays a bastion and not a full tunnel, and the server doesn't forward between peers so my devices can't reach each other. SSH only listens on the VPN interface, the endpoint isn't published in DNS, and WireGuard doesn't answer unauthenticated packets, so a scan just sees silence.

### 5.3 The host

The machine itself, its kernel, its configuration, its accounts, and the secrets on disk.

The threats were privilege escalation from a service or a user, a misconfiguration that quietly opens a hole, kernel information leaks that help an attacker, and persistence after a compromise.

SELinux stays enforcing, the sysctl settings cut down common info leaks and some exploit primitives, the installed package set is small, auditd records activity, file permissions are tight, and updates apply automatically.

### 5.4 The containers

Once apps exist, each one is its own boundary, and the assumption is that any single app could be compromised.

The threats were a service escaping its container, one service reading another service's data or credentials, credential theft from inside a container, and using a compromised service to reach out and exfiltrate data.

Containers run rootless with all capabilities dropped and no new privileges, the root filesystem is read-only, there's no Podman socket mounted, and each service has its own user, network, data directory, Unix socket, and credentials. Egress is meant to go only through an allowlist proxy.

### 5.5 The backup channel

The path data takes to leave the server.

The threats were theft of the storage credentials, disclosure of the backup contents, tampering with backups, and losing everything because the backups were never actually tested.

The storage credentials exist only in the backup user and nowhere else, restic encrypts everything before it leaves, backups go off-site to R2, retention is bounded so the free tier holds, and I plan to test restores instead of assuming they work.

The model isn't a one-time document. Every time I add an application I add a boundary and revisit these, which is part of why I'm keeping apps out of the initial build.

## 6. Checkpoint

The main thing I took away is that hardening is a way of reasoning about exposure, trust, and failure, and not a checklist you finish. Every control in this post came from a specific question about a specific boundary, and the parts I'm least sure about are the ones I've been most honest about. For a first hands-on project it did exactly what I wanted, which was to turn a semester of concepts into something I actually had to think through and get wrong a few times.

I kept the whole build reproducible as an Ansible repository, so the same result can be rebuilt from scratch and the reasoning lives next to the configuration instead of only in this post. The next step is adding applications on top of the foundation, where each one gets its own trust boundary and the same verification drill.

## Appendix

### References

- CIS Benchmark for AlmaLinux 10
- NIST SP 800-123, Guide to General Server Security
- WireGuard documentation
- Cloudflare Authenticated Origin Pulls documentation
- MITRE ATT&CK
- restic documentation
- Podman and Quadlet documentation
