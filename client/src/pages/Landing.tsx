import { ArrowRight, ArrowUpRight, Rocket, Users, MessageSquare, FolderGit2, Terminal, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

/* ------------------------------------------------------------------------
   This is a launch page, not a growth-stage marketing page — so nothing
   here claims traction that doesn't exist yet (no "20,000+ developers",
   no fake logo strip, no invented star counts). The honesty is the
   design decision: early access framing, a real publish-flow demo
   instead of a stats panel, and "what ships day one" instead of metrics.
   ------------------------------------------------------------------------ */

function LandingPage() {
  return (
    <div className="bg-background text-text">
      <Hero />
      <Features />
      <HowItWorks />
      <EarlyAccess />
      <CTA />
    </div>
  );
}

/* ---------------------------------- Hero --------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-24 h-[420px] w-[420px] rounded-full opacity-[0.14] blur-[110px]"
        style={{ background: "var(--color-primary)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-24 md:px-10 md:pb-28 md:pt-32">
        <div className="grid gap-16 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7 md:pt-4">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
              <Sparkles size={13} className="text-accent" />
              <span className="font-mono text-xs text-text-secondary">Early access — just launched</span>
            </div>

            <h1 className="font-display text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-text sm:text-6xl">
              A quieter place
              <br />
              to <span className="text-primary">ship</span> your work.
            </h1>

            <p className="mt-7 max-w-md text-lg leading-relaxed text-text-secondary">
              DevBoard just opened. It's a small, focused place to publish real projects, get
              specific feedback, and find the first people who'll actually use what you build —
              before the noise sets in.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/register">
                <Button size="md">
                  Claim your spot
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="secondary" size="md">
                  See what's live
                </Button>
              </Link>
            </div>

            <p className="mt-8 font-mono text-xs text-text-secondary">
              No paid tiers, no algorithmic feed. Just launched, built in the open.
            </p>
          </div>

          {/* Terminal-style panel — shows the actual publish flow rather
              than a stats panel, since there's nothing to boast about yet. */}
          <div className="md:col-span-5">
            <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-2 border-b border-border bg-surface-hover px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                <span className="ml-2 flex items-center gap-1.5 font-mono text-xs text-text-secondary">
                  <Terminal size={12} />
                  devboard — publish.sh
                </span>
              </div>

              <div className="space-y-3 px-5 py-6 font-mono text-[13px] leading-relaxed">
                <p className="text-text-secondary">
                  <span className="text-accent">$</span> devboard publish ./your-project
                </p>
                <p className="text-text-secondary">↳ building preview…</p>
                <p className="text-success">✓ deployed in 2.4s</p>

                <div className="!mt-5 rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-text">your-project</p>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">live</span>
                  </div>
                  <p className="mt-1.5 text-xs text-text-secondary">Visible to the first builders on DevBoard.</p>
                  <div className="mt-3 flex gap-1.5">
                    {["React", "Node", "Any stack"].map((t) => (
                      <span key={t} className="rounded-full bg-surface-hover px-2 py-0.5 text-[11px] text-text-secondary">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="!mt-5 text-text-secondary">
                  <span className="text-accent">$</span> <span className="animate-pulse motion-reduce:animate-none">▍</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Features -------------------------------- */

function Features() {
  const items = [
    { icon: <Rocket size={20} />, index: "01", title: "Showcase", description: "Publish a project with real context — what it does, why you built it, what's next." },
    { icon: <Users size={20} />, index: "02", title: "Network", description: "Follow the people building things you care about. No algorithm deciding for you." },
    { icon: <MessageSquare size={20} />, index: "03", title: "Discuss", description: "Ask precise questions in threads built for code, not scrolling feeds." },
    { icon: <FolderGit2 size={20} />, index: "04", title: "Contribute", description: "Find early open-source work where one contributor still makes a real difference." },
  ];

  return (
    <section className="border-b border-border py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-14 grid gap-6 md:grid-cols-12">
          <p className="font-mono text-xs uppercase tracking-wide text-text-secondary md:col-span-2">
            /02 — what it does
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-text md:col-span-6">
            Everything the first version needed. Nothing it didn't.
          </h2>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4">
          {items.map((item) => (
            <div key={item.index} className="group relative bg-background p-7 transition-colors duration-150 hover:bg-surface">
              <div className="mb-10 flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-150 group-hover:-translate-y-0.5">
                  {item.icon}
                </span>
                <span className="font-mono text-xs text-text-secondary">/{item.index}</span>
              </div>
              <h3 className="font-display text-lg font-medium text-text">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- How it works ------------------------------ */

function HowItWorks() {
  const steps = [
    { index: "01", title: "Create an account", description: "Takes under a minute. No invite code, no waitlist gate." },
    { index: "02", title: "Publish your first project", description: "Add a title, a description, a link — real or in-progress work, either is fine." },
    { index: "03", title: "Get found by early members", description: "Every post here reaches an actual person, not a ranking algorithm." },
  ];

  return (
    <section className="border-b border-border py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <p className="mb-3 font-mono text-xs uppercase tracking-wide text-text-secondary">/03 — getting started</p>
        <h2 className="mb-14 font-display text-3xl font-semibold tracking-tight text-text">
          Three steps. That's it.
        </h2>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, i) => (
            <div key={step.index} className="relative">
              <div className="mb-5 flex items-center gap-4">
                <span className="font-display text-2xl font-semibold text-text-secondary">{step.index}</span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <h3 className="font-display text-lg font-medium text-text">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{step.description}</p>

              {i < steps.length - 1 && (
                <ArrowRight
                  size={16}
                  className="absolute right-[-28px] top-2 hidden text-text-secondary/40 md:block"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Early access ------------------------------ */

function EarlyAccess() {
  const points = [
    "Direct line to the people building DevBoard — feedback shapes the roadmap",
    "Your username and profile locked in before it opens up more widely",
    "First look at every feature, before it's announced anywhere else",
  ];

  return (
    <section className="border-b border-border bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <p className="mb-3 font-mono text-xs uppercase tracking-wide text-text-secondary">/04 — why join now</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-text">
              Early means early.
            </h2>
            <p className="mt-4 max-w-sm text-text-secondary">
              We're not going to pretend this is a mature platform — it isn't yet. That's the
              point. Founding members get a say in what it becomes.
            </p>
          </div>

          <div className="md:col-span-7">
            <ul className="space-y-5">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-4 border-t border-border pt-5 first:border-t-0 first:pt-0">
                  <span className="mt-0.5 font-mono text-xs text-primary">→</span>
                  <span className="text-sm leading-relaxed text-text">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- CTA ----------------------------------- */

function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface px-8 py-16 text-center md:px-16 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full opacity-[0.12] blur-[100px]"
            style={{ background: "var(--color-primary)" }}
          />
          <div className="relative">
            <p className="mb-4 font-mono text-xs uppercase tracking-wide text-text-secondary">/05 — get started</p>
            <h2 className="mx-auto max-w-xl font-display text-3xl font-semibold tracking-tight text-text md:text-4xl">
              Be one of the first names on DevBoard.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-text-secondary">
              It takes a minute to join and less than that to publish something. See what's here
              before it's crowded.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link to="/register">
                <Button size="md">
                  Claim your spot
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="secondary" size="md">
                  Browse what's live
                  <ArrowUpRight size={14} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingPage;