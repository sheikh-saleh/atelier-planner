import { MarketingNav } from "./components/MarketingNav";
import { MarketingFooter } from "./components/MarketingFooter";
import { AnimatedPage } from "@/components/motion";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNav />
      <main className="flex-1"><AnimatedPage>{children}</AnimatedPage></main>
      <MarketingFooter />
    </div>
  );
}
