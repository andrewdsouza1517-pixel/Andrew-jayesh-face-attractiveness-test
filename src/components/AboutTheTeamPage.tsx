import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Code2,
  BookOpenCheck,
  BrainCircuit,
  Sigma,
  BarChart3,
  Layers,
  Search,
  ArrowRight,
  RotateCcw,
  Users,
  CheckCircle2,
} from 'lucide-react';

interface AboutTheTeamPageProps {
  onReturnToApp: () => void;
}

export const AboutTheTeamPage: React.FC<AboutTheTeamPageProps> = ({ onReturnToApp }) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const height = rect.height - window.innerHeight;
      if (height <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / height));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const andrewImage = '/assets/aistudio/e8a88879-bdba-4b0e-8956-87fdf129090e_7ff0c738.jpg';
  const apekshaImage = '/assets/aistudio/f8bf009c-5e39-4e6c-af3c-a14955427079_ec945e75.jpg';

  const connectionNodes = [
    { id: 'ai', label: 'AI', desc: 'Multimodal vision models extracting feature tensors.' },
    { id: 'math', label: 'MATHEMATICS', desc: 'Bradley-Terry probabilistic preference estimation.' },
    { id: 'data', label: 'DATA', desc: 'Structured attributes, logits, and confidence intervals.' },
    { id: 'design', label: 'DESIGN', desc: 'Editorial restraint and archival warm typography.' },
    { id: 'research', label: 'RESEARCH', desc: 'Comparative psychometrics and unbiased evaluation.' },
    { id: 'presentation', label: 'PRESENTATION', desc: 'Exhibition-grade clarity for judges and parents.' },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FAF7F2] dark:bg-[#171311] text-[#211813] dark:text-[#F5EFEB] font-sans antialiased selection:bg-[#8C5E3C] selection:text-white transition-colors duration-200">
      {/* Floating Back to App Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-[#FAF7F2]/90 dark:bg-[#171311]/90 backdrop-blur-md border-b border-[#E8E2D8] dark:border-[#3D332C] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#211813] dark:bg-[#C99765] text-[#FAF7F2] dark:text-[#171311] font-editorial font-bold flex items-center justify-center text-sm shadow-xs">
            A
          </div>
          <div>
            <span className="font-editorial font-medium text-sm text-[#211813] dark:text-[#F5EFEB]">ANDESHA</span>
            <span className="text-xs text-[#8C7D70] dark:text-[#A69688] ml-2">· About the Team</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onReturnToApp}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#211813] hover:bg-[#3D2C21] dark:bg-[#C99765] dark:hover:bg-[#DDB082] text-[#FAF7F2] dark:text-[#171311] transition shadow-xs flex items-center gap-2 cursor-pointer font-sans uppercase tracking-wider"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Return to ANDESHA</span>
        </button>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden border-b border-[#E8E2D8] dark:border-[#3D332C]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8C5E3C]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#4A6B53]/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8c5e3c10_1px,transparent_1px),linear-gradient(to_bottom,#8c5e3c10_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] text-xs font-mono text-[#8C5E3C] dark:text-[#C99765] shadow-2xs">
            <Users className="w-3.5 h-3.5" />
            <span>School Exhibition Creators</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-editorial font-medium tracking-tight text-[#211813] dark:text-[#F5EFEB] text-balance">
            THE PEOPLE BEHIND ANDESHA
          </h1>

          <p className="text-xl sm:text-2xl font-editorial italic text-[#8C5E3C] dark:text-[#C99765] max-w-2xl mx-auto leading-relaxed">
            “Built by two students with one question: what happens when artificial intelligence meets mathematics?”
          </p>

          <p className="text-sm sm:text-base font-mono uppercase tracking-widest text-[#8C7D70] dark:text-[#A69688]">
            Andrew × Apeksha
          </p>
        </div>
      </section>

      {/* 2. TEAM REVEAL (Two portraits moving together on scroll) */}
      <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#8C5E3C] dark:text-[#C99765]">
            Collaboration
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB]">
            Two contributors. One project.
          </h2>
          <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] font-sans">
            Scroll down to watch how research and engineering merge into a single unified system.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
          {/* Andrew Panel */}
          <div
            className="lg:col-span-5 transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(${Math.max(0, (1 - scrollProgress * 1.5) * 60)}px)`,
            }}
          >
            <div className="bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-2xl p-6 shadow-md dark:shadow-2xl space-y-4">
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#FAF7F2] dark:bg-[#171311] border border-[#E8E2D8] dark:border-[#3D332C]">
                <img
                  src={andrewImage}
                  alt="Andrew - Co-Creator"
                  className="w-full h-full object-cover filter contrast-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C5E3C] dark:text-[#C99765] font-semibold">
                  Co-Creator · Technology & Development
                </span>
                <h3 className="text-2xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB]">
                  Andrew
                </h3>
              </div>
            </div>
          </div>

          {/* Central Connecting Core (Appears on scroll) */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-6 lg:py-0">
            <div
              className="w-16 h-16 rounded-full bg-[#211813] dark:bg-[#C99765] text-[#FAF7F2] dark:text-[#171311] flex items-center justify-center shadow-xl transition-all duration-700"
              style={{
                opacity: Math.min(1, scrollProgress * 2),
                transform: `scale(${0.6 + Math.min(0.4, scrollProgress * 0.4)})`,
              }}
            >
              <span className="font-editorial font-bold text-xl">A²</span>
            </div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#8C7D70] dark:text-[#A69688] mt-3">
              ANDESHA
            </div>
          </div>

          {/* Apeksha Panel */}
          <div
            className="lg:col-span-5 transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(${Math.min(0, -(1 - scrollProgress * 1.5) * 60)}px)`,
            }}
          >
            <div className="bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-2xl p-6 shadow-md dark:shadow-2xl space-y-4">
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#FAF7F2] dark:bg-[#171311] border border-[#E8E2D8] dark:border-[#3D332C]">
                <img
                  src={apekshaImage}
                  alt="Apeksha - Co-Creator"
                  className="w-full h-full object-cover filter contrast-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C5E3C] dark:text-[#C99765] font-semibold">
                  Co-Creator · Research & Presentation
                </span>
                <h3 className="text-2xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB]">
                  Apeksha
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 & 4. INDIVIDUAL PROFILES: ANDREW & APEKSHA */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-16 border-t border-[#E8E2D8] dark:border-[#3D332C]">
        {/* Andrew Profile */}
        <div className="bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-2xl p-8 sm:p-12 shadow-xs dark:shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="px-3 py-1 rounded-md bg-[#FAF7F2] dark:bg-[#2B231F] border border-[#E8E2D8] dark:border-[#3D332C] text-xs font-mono uppercase tracking-wider text-[#8C5E3C] dark:text-[#C99765]">
              BUILD
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB]">
              ANDREW
            </h2>
            <p className="text-sm font-mono text-[#8C7D70] dark:text-[#A69688]">
              Co-Creator · Technology & Development
            </p>
            <p className="text-base sm:text-lg text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed font-sans max-w-xl">
              “Focused on turning the idea into an interactive digital experience, connecting the interface, AI workflow, data and mathematical components of ANDESHA.”
            </p>
          </div>

          <div className="lg:col-span-5 bg-[#FAF7F2] dark:bg-[#171311] border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-4 bg-white dark:bg-[#221C18] rounded-xl border border-[#E8E2D8] dark:border-[#3D332C] text-[#8C5E3C] dark:text-[#C99765] shadow-2xs">
              <Code2 className="w-8 h-8 animate-pulse" />
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#8C7D70] dark:text-[#A69688]">
              System Architecture & AI Pipeline
            </span>
          </div>
        </div>

        {/* Apeksha Profile */}
        <div className="bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-2xl p-8 sm:p-12 shadow-xs dark:shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="px-3 py-1 rounded-md bg-[#FAF7F2] dark:bg-[#2B231F] border border-[#E8E2D8] dark:border-[#3D332C] text-xs font-mono uppercase tracking-wider text-[#4A6B53] dark:text-[#6B9071]">
              EXPLAIN
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB]">
              APEKSHA
            </h2>
            <p className="text-sm font-mono text-[#8C7D70] dark:text-[#A69688]">
              Co-Creator · Research & Presentation
            </p>
            <p className="text-base sm:text-lg text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed font-sans max-w-xl">
              “Focused on shaping the research experience, communicating the ideas behind ANDESHA, and making the project understandable and engaging for visitors and judges.”
            </p>
          </div>

          <div className="lg:col-span-5 bg-[#FAF7F2] dark:bg-[#171311] border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-4 bg-white dark:bg-[#221C18] rounded-xl border border-[#E8E2D8] dark:border-[#3D332C] text-[#4A6B53] dark:text-[#6B9071] shadow-2xs">
              <BookOpenCheck className="w-8 h-8 animate-pulse" />
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#8C7D70] dark:text-[#A69688]">
              Research, Psychometrics & Exhibition
            </span>
          </div>
        </div>
      </section>

      {/* 5. “HOW WE WORKED TOGETHER” */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12 border-t border-[#E8E2D8] dark:border-[#3D332C]">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#8C5E3C] dark:text-[#C99765]">
            Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB]">
            TWO PERSPECTIVES. ONE SYSTEM.
          </h2>
          <p className="text-sm text-[#5C4E43] dark:text-[#D4C7BC] font-sans">
            “ANDESHA was built by combining technical experimentation with research, communication and constant testing.”
          </p>
        </div>

        {/* Horizontal Flow */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {['IDEA', 'RESEARCH', 'BUILD', 'TEST', 'EXPLAIN', 'ANDESHA'].map((stage, idx) => (
            <div
              key={stage}
              className={`p-5 rounded-xl border text-center space-y-2 shadow-2xs transition-all ${
                idx === 5
                  ? 'bg-[#211813] dark:bg-[#C99765] text-[#FAF7F2] dark:text-[#171311] border-transparent font-bold'
                  : 'bg-white dark:bg-[#1E1815] border-[#E8E2D8] dark:border-[#3D332C] text-[#211813] dark:text-[#F5EFEB]'
              }`}
            >
              <div className="text-[10px] font-mono text-[#8C7D70] dark:text-[#A69688]">0{idx + 1}</div>
              <div className="text-sm font-editorial font-semibold tracking-wider">{stage}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. INTERACTIVE TEAM CONNECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12 border-t border-[#E8E2D8] dark:border-[#3D332C]">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#8C5E3C] dark:text-[#C99765]">
            Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB]">
            Connected to the System
          </h2>
          <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] font-sans">
            Hover over any core module below to inspect its role in ANDESHA.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {connectionNodes.map((node) => {
            const isHovered = hoveredNode === node.id;
            return (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer space-y-2 ${
                  isHovered
                    ? 'bg-[#FAF7F2] dark:bg-[#2B231F] border-[#8C5E3C] dark:border-[#C99765] shadow-md -translate-y-1'
                    : 'bg-white dark:bg-[#1E1815] border-[#E8E2D8] dark:border-[#3D332C] shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C5E3C] dark:text-[#C99765]">
                    {node.label}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#4A6B53] dark:bg-[#6B9071]" />
                </div>
                <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] font-sans leading-relaxed">
                  {node.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. “BEYOND THE PROJECT” */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center space-y-8 border-t border-[#E8E2D8] dark:border-[#3D332C]">
        <span className="text-xs font-mono uppercase tracking-wider text-[#8C5E3C] dark:text-[#C99765]">
          Reflection
        </span>
        <h2 className="text-3xl sm:text-5xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] tracking-tight">
          WHY WE BUILT IT
        </h2>
        <p className="text-base sm:text-lg text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed max-w-2xl mx-auto font-sans">
          “We wanted to create more than an AI demo. We wanted to make the process visible: how an image can become structured information, how mathematics can compare that information, and how data can be turned back into something people can understand.”
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 font-mono text-sm tracking-widest text-[#8C5E3C] dark:text-[#C99765]">
          <span className="px-4 py-2 rounded-lg bg-white dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] shadow-2xs">
            01 — QUESTION
          </span>
          <span className="px-4 py-2 rounded-lg bg-white dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] shadow-2xs">
            02 — EXPERIMENT
          </span>
          <span className="px-4 py-2 rounded-lg bg-white dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] shadow-2xs">
            03 — UNDERSTAND
          </span>
        </div>
      </section>

      {/* 8. FINAL TEAM STATEMENT */}
      <section className="py-28 px-6 max-w-5xl mx-auto text-center space-y-8 border-t border-[#E8E2D8] dark:border-[#3D332C]">
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-6xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] tracking-tight">
            BUILT WITH CURIOSITY.
          </h2>
          <h3 className="text-3xl sm:text-5xl font-editorial italic text-[#8C5E3C] dark:text-[#C99765]">
            EXPLAINED WITH DATA.
          </h3>
          <p className="text-xl sm:text-2xl font-mono uppercase tracking-widest text-[#8C7D70] dark:text-[#A69688] pt-2">
            POWERED BY ANDREW × Apeksha
          </p>
        </div>

        <div className="space-y-2 pt-4">
          <p className="text-lg font-editorial font-bold text-[#211813] dark:text-[#F5EFEB]">
            ANDESHA
          </p>
          <p className="text-xs font-sans text-[#8C7D70] dark:text-[#A69688]">
            See Beyond the Image. Understand the Data.
          </p>
        </div>

        <div className="pt-6">
          <button
            type="button"
            onClick={onReturnToApp}
            className="px-8 py-4 min-h-[48px] rounded-xl text-sm font-semibold bg-[#211813] hover:bg-[#3D2C21] dark:bg-[#C99765] dark:hover:bg-[#DDB082] text-[#FAF7F2] dark:text-[#171311] transition shadow-md hover:-translate-y-0.5 flex items-center gap-2.5 mx-auto cursor-pointer uppercase tracking-wider font-sans"
          >
            <span>Explore ANDESHA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
