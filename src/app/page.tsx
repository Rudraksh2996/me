import Afterlight from "@/components/Afterlight";
import ChapterRail from "@/components/ChapterRail";
import Contact from "@/components/Contact";
import Hero from "@/components/hero/Hero";
import Nav from "@/components/Nav";
import Origin from "@/components/Origin";
import Works from "@/components/Works";

// Chapters are rendered in scroll order; pinned sections (Hero, Works, Afterlight)
// must stay in DOM order so ScrollTrigger computes their pin spacing top-down.
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Origin />
        <Works />
        <Afterlight />
        <Contact />
      </main>
      {/* after <main> so its triggers are created after the pinned sections and account for their spacing */}
      <ChapterRail />
    </>
  );
}
