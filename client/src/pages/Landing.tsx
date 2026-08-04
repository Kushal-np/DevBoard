import { ArrowRight, ArrowUpRight, Rocket, Users, MessageSquare, FolderGit2, Terminal, Sparkles, CheckCircle2,  Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

function LandingPage() {
  return (
    <div className="bg-background text-text">
      <Hero />
      <TrustBar />
      <Features />
      <HowItWorks />
      <EarlyAccess />
      <CTA />
      <Footer />
    </div>
  );
}


function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-1/4 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-24 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-24 md:px-10 md:pb-28 md:pt-32">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7 lg:pt-4">
            <div className="mb-8 inline-flex animate-fade-in-up items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="font-mono text-xs text-text-secondary">Early access — just launched</span>
            </div>

            <h1 className="font-display text-[3rem] font-bold leading-[1.05] tracking-tight text-text sm:text-[3.5rem] md:text-[4rem] lg:text-[4.5rem]">
              A quieter place
              <br />
              to <span className="relative inline-block">
                <span className="relative z-10 text-primary">ship</span>
                <span className="absolute bottom-1 left-0 h-3 w-full bg-primary/20" />
              </span>{" "}
              your work.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-text-secondary md:text-xl">
              DevBoard just opened. It's a small, focused place to publish real projects, get
              specific feedback, and find the first people who'll actually use what you build —
              before the noise sets in.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/register">
                <Button size="md" className="group relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    Claim your spot
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="md" className="group">
                  See what's live
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </Link>
            </div>


          </div>

          {/* Terminal panel with improved design */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/80 backdrop-blur-sm shadow-2xl transition-all duration-500 hover:shadow-primary/5 hover:border-primary/20">
              <div className="flex items-center gap-2 border-b border-border bg-surface-hover/50 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-danger/80 transition-all duration-200 hover:scale-110" />
                  <span className="h-3 w-3 rounded-full bg-warning/80 transition-all duration-200 hover:scale-110" />
                  <span className="h-3 w-3 rounded-full bg-success/80 transition-all duration-200 hover:scale-110" />
                </div>
                <span className="ml-3 flex items-center gap-2 font-mono text-xs text-text-secondary">
                  <Terminal size={12} className="text-accent" />
                  devboard — publish.sh
                </span>
                <span className="ml-auto flex items-center gap-1.5 text-[10px] text-text-secondary/50">
                  <Zap size={10} />
                  ready
                </span>
              </div>

              <div className="space-y-3 px-6 py-8 font-mono text-sm leading-relaxed">
                <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                  <p className="text-text-secondary">
                    <span className="text-accent">$</span> devboard publish ./your-project
                  </p>
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                  <p className="text-text-secondary">↳ building preview…</p>
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                  <p className="text-success">✓ deployed in 2.4s</p>
                </div>

                <div className="!mt-6 animate-fade-in-up rounded-xl border border-border bg-background/50 p-5 transition-all duration-300 hover:border-accent/20" style={{ animationDelay: "0.4s" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text">your-project</p>
                      <p className="mt-0.5 text-xs text-text-secondary">v0.1.0</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                      </span>
                      live
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-text-secondary/80">Visible to the first builders on DevBoard.</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {["React", "Node", "Any stack"].map((t) => (
                      <span key={t} className="rounded-full bg-surface-hover/50 px-2.5 py-0.5 text-[11px] text-text-secondary/80 transition-colors duration-200 hover:bg-surface-hover hover:text-text">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="!mt-5 animate-pulse text-text-secondary/60">
                  <span className="text-accent">$</span> <span>▍</span>
                </div>
              </div>

              {/* Gradient overlay on bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Trust Bar --------------------------------- */

function TrustBar() {
  const stats = [
    { value: "47", label: "Builders joined", icon: <Users size={16} /> },
    { value: "12", label: "Projects live", icon: <FolderGit2 size={16} /> },
    { value: "100%", label: "Human-curated", icon: <CheckCircle2 size={16} /> },
  ];

  return (
    <section className="border-b border-border py-8">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="font-mono text-xs uppercase tracking-wider text-text-secondary/60">
            Built by developers, for developers
          </p>
          <div className="flex flex-wrap items-center gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-primary/60">{stat.icon}</span>
                <div>
                  <span className="font-display text-lg font-semibold text-text">{stat.value}</span>
                  <span className="ml-1.5 text-sm text-text-secondary">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Features -------------------------------- */

function Features() {
  const items = [
    { 
      icon: <Rocket size={22} />, 
      index: "01", 
      title: "Showcase", 
      description: "Publish a project with real context — what it does, why you built it, what's next.",
      gradient: "from-primary/20 to-accent/20"
    },
    { 
      icon: <Users size={22} />, 
      index: "02", 
      title: "Network", 
      description: "Follow the people building things you care about. No algorithm deciding for you.",
      gradient: "from-accent/20 to-primary/20"
    },
    { 
      icon: <MessageSquare size={22} />, 
      index: "03", 
      title: "Discuss", 
      description: "Ask precise questions in threads built for code, not scrolling feeds.",
      gradient: "from-primary/20 to-accent/20"
    },
    { 
      icon: <FolderGit2 size={22} />, 
      index: "04", 
      title: "Contribute", 
      description: "Find early open-source work where one contributor still makes a real difference.",
      gradient: "from-accent/20 to-primary/20"
    },
  ];

  return (
    <section className="border-b border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-16 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="font-mono text-xs uppercase tracking-wider text-text-secondary/60">
              02 — Features
            </p>
          </div>
          <div className="md:col-span-6">
            <h2 className="font-display text-3xl font-bold tracking-tight text-text md:text-4xl">
              Everything the first version needed.
            </h2>
            <p className="mt-3 text-lg text-text-secondary">
              Nothing it didn't. Focused, intentional, and built for builders.
            </p>
          </div>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
          {items.map((item) => (
            <div key={item.index} className="group relative bg-background p-8 transition-all duration-300 hover:bg-surface/80">
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className={`h-full w-full bg-gradient-to-br ${item.gradient}`} />
              </div>
              <div className="relative">
                <div className="mb-8 flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                    {item.icon}
                  </span>
                  <span className="font-mono text-sm font-medium text-text-secondary/30">/{item.index}</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-text">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary/80">{item.description}</p>
              </div>
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
    { 
      index: "01", 
      title: "Create an account", 
      description: "Takes under a minute. No invite code, no waitlist gate.",
      icon: <Users size={20} className="text-primary" />
    },
    { 
      index: "02", 
      title: "Publish your first project", 
      description: "Add a title, a description, a link — real or in-progress work, either is fine.",
      icon: <Rocket size={20} className="text-primary" />
    },
    { 
      index: "03", 
      title: "Get found by early members", 
      description: "Every post here reaches an actual person, not a ranking algorithm.",
      icon: <MessageSquare size={20} className="text-primary" />
    },
  ];

  return (
    <section className="border-b border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-16 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="font-mono text-xs uppercase tracking-wider text-text-secondary/60">
              03 — Getting started
            </p>
          </div>
          <div className="md:col-span-6">
            <h2 className="font-display text-3xl font-bold tracking-tight text-text md:text-4xl">
              Three steps. That's it.
            </h2>
          </div>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3 md:gap-12">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px bg-border md:block" />
          
          {steps.map((step) => (
            <div key={step.index} className="relative">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  {step.icon}
                </div>
                <span className="font-display text-2xl font-bold text-text-secondary/30">{step.index}</span>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-text">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary/80">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function EarlyAccess() {
  const points = [
    { icon: <MessageSquare size={18} className="text-primary" />, text: "Direct line to the people building DevBoard — feedback shapes the roadmap" },
    { icon: <Users size={18} className="text-primary" />, text: "Your username and profile locked in before it opens up more widely" },
    { icon: <Sparkles size={18} className="text-primary" />, text: "First look at every feature, before it's announced anywhere else" },
  ];

  return (
    <section className="border-b border-border bg-surface/50 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-text-secondary/60">
              04 — Why join now
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-text md:text-4xl">
              Early means early.
            </h2>
            <p className="mt-4 max-w-sm text-lg text-text-secondary/80">
              We're not going to pretend this is a mature platform — it isn't yet. That's the
              point. Founding members get a say in what it becomes.
            </p>
            <div className="mt-8">
              <Link to="/register">
                <Button size="md" className="group">
                  Join the founding members
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4">
              {points.map((point) => (
                <div key={point.text} className="group flex items-start gap-4 rounded-xl border border-border bg-background p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
                  <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary">
                    {point.icon}
                  </div>
                  <span className="text-sm leading-relaxed text-text/90">{point.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- CTA ----------------------------------- */

function CTA() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface to-surface/50 px-8 py-16 text-center md:px-16 md:py-24">
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
            <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-accent/5 blur-[100px]" />
            <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[100px]" />
          </div>
          
          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 backdrop-blur-sm">
              <Sparkles size={14} className="text-accent" />
              <span className="font-mono text-xs text-text-secondary">Limited founding members</span>
            </div>
            
            <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold tracking-tight text-text md:text-5xl">
              Be one of the first names on DevBoard.
            </h2>
            
            <p className="mx-auto mt-4 max-w-md text-lg text-text-secondary/80">
              It takes a minute to join and less than that to publish something. See what's here
              before it's crowded.
            </p>
            
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/register">
                <Button size="md" className="group relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    Claim your spot
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="secondary" size="md" className="group">
                  Browse what's live
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </Link>
            </div>
            
            <p className="mt-6 font-mono text-xs text-text-secondary/60">
              No paid tiers • No algorithmic feed • Built in the open
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- Footer ----------------------------------- */

function Footer() {
  return (
    <footer className="border-t border-border bg-surface/30 py-12">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-4">
            <span className="font-display text-xl font-semibold text-text">
              Dev<span className="text-primary">Board</span>
            </span>
            <span className="text-sm text-text-secondary/40">|</span>
            <span className="text-sm text-text-secondary/60">Built for builders</span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/about" className="text-sm text-text-secondary/60 transition-colors hover:text-text">
              About
            </Link>
            <Link to="/privacy" className="text-sm text-text-secondary/60 transition-colors hover:text-text">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-text-secondary/60 transition-colors hover:text-text">
              Terms
            </Link>
            <div className="flex items-center gap-3">
              <a href="#" className="text-text-secondary/40 transition-colors hover:text-text" aria-label="GitHub">
              </a>
              <a href="#" className="text-text-secondary/40 transition-colors hover:text-text" aria-label="Twitter">
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-text-secondary/40 md:text-left">
          © 2026 DevBoard. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default LandingPage;