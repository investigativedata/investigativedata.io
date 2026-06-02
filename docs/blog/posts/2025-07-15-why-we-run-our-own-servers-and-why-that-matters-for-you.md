---
date: 2025-07-15
slug: "why-we-run-our-own-servers-and-why-that-matters-for-you"
---

# Why We Run Our Own Servers (And Why That Matters for You)

> Owning your infrastructure means better security, lower costs, and full control without relying on the cloud.

<!-- more -->

Many teams think of cloud hosting as the easiest option, but when it comes to sensitive investigative projects, owning and controlling your infrastructure can offer significant advantages in security, cost, and long-term reliability.

## Infrastructure Built with Security in Mind

[OpenAleph](https://openaleph.org/), for example, runs entirely on physical servers that we own and operate. No AWS. No Google Cloud. No third-party black boxes.

These servers are located in a secure data center in southern Germany through colocation with a reputable provider, Hetzner. The setup was designed with input from the [Chaos Computer Club](https://www.ccc.de/en/), Europe’s largest hacker association, to ensure high security standards from the ground up.

What this looks like in practice:

- All disks on physical hosts are encrypted to keep data safe at rest.
- Each OpenAleph instance runs in its own isolated virtual environment, preventing data from crossing boundaries.
- Physical access to the servers is tightly controlled with keycards and camera surveillance.
- Daily off-site backups are stored with a specialized backup provider, ensuring geographic redundancy in case of emergencies.

The hardware setup has undergone independent audits with no deficiencies found, and software audits of OpenAleph are ongoing.

## Editorial Decisions Are Also Infrastructure Decisions

For teams working with sensitive materials, infrastructure isn’t just a technical decision. It’s an editorial one.

Where is the data physically located? Who controls the environment? What happens if a provider changes their terms or goes offline?

Owning our servers means we can answer those questions with confidence.

It also means we’re not exposed to the volatility of cloud pricing. While cloud services offer convenience, that often comes with costs that escalate quickly, especially for investigative projects where performance, search speed, and storage throughput are critical. 

We’ve run the numbers: for a typical OpenAleph setup handling a large dataset (something on the scale of the Panama Papers, for example), cloud infrastructure would cost about three times as much per year as our current self-hosted setup, with no clear gain in reliability or functionality.

To put this in perspective: fast SSD storage in the cloud can cost around 40 euros per terabyte per month. Buying the same capacity as a physical disk costs between 50 and 100 euros one time. Even after adding setup costs, the hardware pays for itself in under six months. This pattern holds true for other components, too, while giving you control over the exact configuration you need.

## Fully Managed Doesn’t Mean No One’s Watching

One of the big selling points of cloud platforms is the idea that they “just work,” and that you don’t need someone technical on your team because it’s all taken care of. But in practice, that’s rarely the case.

Whether your infrastructure lives in the cloud or on your own hardware, someone still has to keep it running. Servers need monitoring, logs need checking, updates need applying. We've seen this time and again: even the most abstracted cloud setup still has a sysadmin behind the scenes, managing resources, fixing issues, and making sure nothing catches fire.

That’s why when you host OpenAleph with us, you’re not just getting space on a server. You're getting a fully managed environment, on infrastructure we control, with people who know how it's built and what it’s for. No need to worry about provisioning VMs, setting up backups, or responding to alerts in the middle of the night.

We handle the infrastructure so you can focus on investigations.

## Backups Included, Not Billed Extra

We’ve seen cloud providers make backups costly and opaque, with unpredictable outbound traffic fees and complex pricing models. Our approach is simpler. We include daily off-site backups as a standard part of the setup. It’s not optional and it’s not an add-on. It’s part of building a resilient infrastructure for journalism.

## Why This Matters

Investigative journalism demands infrastructure that is secure, reliable, and under the control of the people using it. Self-hosting tools like OpenAleph can provide that stability without sacrificing performance or breaking the budget.

We’ve invested in this setup so investigative teams don’t have to. If you’re running OpenAleph with us, you’re benefiting from infrastructure designed specifically for this kind of work.
