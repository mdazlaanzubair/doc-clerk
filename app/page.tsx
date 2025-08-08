import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Play } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full h-full max-w-4xl flex flex-col mx-auto py-3 gap-10 my-20">
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}

// ========================
// Landing page components
// ========================

// 1. Hero section
const HeroSection = () => {
  return (
    <section id="hero-section" className="w-full h-fit flex flex-col py-3">
      <div className="max-w-lg">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance">
          Create, Send & Manage Business Docs in Seconds
        </h1>
        <p className="text-sm mt-3 font-semibold text-muted-foreground/50">
          From invoices to contracts, generate professional documents
          effortlessly. Automate your workflow, stay compliant, and get paid
          faster, all in one place.
        </p>
        <div className="flex items-center gap-2 mt-5">
          <Button variant="default" size="default">
            Get Started
          </Button>
          <Button className="group" variant="ghost" size="default">
            <Play className="group-hover:mx-1 transition-all duration-300 ease-in-out" />{" "}
            View Demo
          </Button>
        </div>

        <Separator className="my-4 max-w-xs" />
        <div className="space-y-1">
          <h4 className="text-sm leading-none font-semibold">
            No credit card required
          </h4>
          <p className="text-muted-foreground text-sm font-light">
            Trusted by freelancers and agencies worldwide
          </p>
        </div>
      </div>
    </section>
  );
};

// 2. Features section

const features = [
  {
    id: 1,
    title: "Multi-Document",
    description:
      "Create invoices, purchase orders, credit notes, contracts, and more.",
  },
  {
    id: 2,
    title: "Custom Branding",
    description:
      "Add your logo, colors, and custom fields. Your brand, your documents.",
  },
  {
    id: 3,
    title: "Tax & Currency",
    description:
      "Compliant with global tax systems (VAT, GST, WHT) and supports 100+ currencies.",
  },
  {
    id: 4,
    title: "Client Management",
    description:
      "Send documents, track payments, and manage clients without leaving the app.",
  },
  {
    id: 5,
    title: "Download & Share",
    description:
      "Export as PDF or share via secure links, no sign-up needed for recipients.",
  },
  {
    id: 6,
    title: "Audit Trail",
    description: "Keep a legal audit trail of all document actions.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features-section" className="w-full flex-1 flex flex-col py-3">
      <h1 className="text-2xl font-extrabold tracking-tight text-balance">
        Features
      </h1>
      <p className="text-sm mt-2 font-semibold text-muted-foreground/50">
        Everything You Need to Streamline Business Docs
      </p>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="w-full p-5 border border-slate-400/30 rounded-lg shadow-xs"
          >
            <h2 className="text font-semibold">{feature.title}</h2>
            <p className="text-sm font-medium mt-2 text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
