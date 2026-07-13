import {
  ArrowRight,
  Code2,
  Users,
  Rocket,
  MessageSquare,
  FolderGit2,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text pb-24">

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">

        <div className="mb-6 inline-flex rounded-full border border-border bg-surface px-4 py-2 text-sm text-text-secondary">
          🚀 Build. Share. Collaborate.
        </div>

        <h1 className="mx-auto max-w-5xl text-6xl font-extrabold leading-tight tracking-tight">
          The Community Platform
          <br />
          Built For
          <span className="text-primary"> Developers.</span>
        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-text-secondary">
          Showcase your projects, discover open-source ideas, connect with
          developers, ask technical questions and build together.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-5">

          <Link
            to="/register"
            className="flex items-center gap-2 rounded-xl bg-primary px-7 py-4 font-semibold text-background transition hover:bg-primary-hover"
          >
            Join DevBoard
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/explore"
            className="rounded-xl border border-border bg-surface px-7 py-4 font-semibold transition hover:bg-surface-hover"
          >
            Explore Projects
          </Link>

        </div>

      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-6 py-24">

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">

          {[
            ["20K+", "Developers"],
            ["6K+", "Projects"],
            ["12K+", "Discussions"],
            ["900+", "Open Source Teams"],
          ].map(([number, text]) => (
            <div
              key={text}
              className="rounded-2xl border border-border bg-surface p-8 text-center"
            >
              <h2 className="text-3xl font-bold">{number}</h2>

              <p className="mt-2 text-text-secondary">
                {text}
              </p>
            </div>
          ))}

        </div>

      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="text-center">

          <h2 className="text-4xl font-bold">
            Everything developers need.
          </h2>

          <p className="mt-4 text-text-secondary">
            One place to build your developer identity.
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          <Feature
            icon={<Rocket size={30} />}
            title="Showcase Projects"
            description="Publish your portfolio, side projects and startups."
          />

          <Feature
            icon={<Users size={30} />}
            title="Developer Network"
            description="Follow developers and collaborate together."
          />

          <Feature
            icon={<MessageSquare size={30} />}
            title="Community Discussions"
            description="Ask questions and solve technical problems."
          />

          <Feature
            icon={<FolderGit2 size={30} />}
            title="Open Source"
            description="Find contributors and build together."
          />

        </div>

      </section>

      {/* Projects */}
      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="mb-10">

          <h2 className="text-4xl font-bold">
            Trending Projects
          </h2>

          <p className="mt-3 text-text-secondary">
            Discover what developers are building today.
          </p>

        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          <ProjectCard
            title="AI Interview Coach"
            description="Practice interviews using AI-generated feedback."
            tags={["React", "Node", "OpenAI"]}
          />

          <ProjectCard
            title="DevBoard API"
            description="Community backend built with Express & MongoDB."
            tags={["Express", "MongoDB", "TypeScript"]}
          />

          <ProjectCard
            title="CodeShare"
            description="Collaborative code editor with syntax highlighting."
            tags={["Next.js", "Redis", "WebSockets"]}
          />

        </div>

      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 pt-24">

        <div className="rounded-3xl border border-border bg-surface p-16 text-center">

          <Code2
            className="mx-auto mb-6"
            size={52}
          />

          <h2 className="text-5xl font-bold">
            Ready to build with thousands of developers?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">
            Join DevBoard today and start sharing projects, ideas and
            knowledge with developers around the world.
          </p>

          <Link
            to="/register"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-background transition hover:bg-primary-hover"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

    </div>
  );
}

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-8 transition hover:-translate-y-1 hover:bg-surface-hover">

      <div className="mb-5 text-primary">
        {icon}
      </div>

      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-text-secondary">
        {description}
      </p>

    </div>
  );
}

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
}

function ProjectCard({
  title,
  description,
  tags,
}: ProjectCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-7 transition hover:-translate-y-1 hover:bg-surface-hover">

      <div className="flex items-center justify-between">

        <h3 className="text-xl font-semibold">
          {title}
        </h3>

        <Star
          size={18}
          className="text-warning"
        />

      </div>

      <p className="mt-4 leading-7 text-text-secondary">
        {description}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">

        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-lg bg-background px-3 py-1 text-sm text-text-secondary"
          >
            {tag}
          </span>
        ))}

      </div>

    </div>
  );
}

export default LandingPage;