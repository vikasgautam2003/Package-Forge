import Link from 'next/link';
import { MatrixRain } from '../components/landing/MatrixRain';
import { GlitchText } from '../components/landing/GlicthText';
import { Terminal, Code, Cpu, ShieldCheck, ArrowRight, Github, Linkedin, Server } from 'lucide-react';




export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-green-500 font-mono selection:bg-green-900 selection:text-white relative overflow-hidden">
      <MatrixRain />

    
      <nav
  className="
    fixed top-0 w-full px-8 py-5
    flex justify-between items-center
    z-50
    bg-black/40 backdrop-blur-xl
    border-b border-green-900/40
    shadow-[0_0_20px_rgba(0,255,65,0.05)]
    transition-all
  "
>
  <div className="flex items-center gap-3">
    <Terminal
      size={22}
      className="text-green-400 drop-shadow-[0_0_6px_rgba(0,255,65,0.6)]"
    />
    <span className="text-lg font-bold tracking-wider text-green-300">
      PACKAGE_FORGE
    </span>
  </div>

  <div className="flex items-center gap-8 text-sm font-semibold">
    <a
      href="#features"
      className="
        relative hidden sm:block text-green-300/80 hover:text-green-100 
        transition-all duration-200
      "
    >
      MODULES
      <span
        className="
          absolute left-0 -bottom-1 w-full h-[2px] scale-x-0 
          bg-green-400 transition-transform duration-300 
          group-hover:scale-x-100 hover:scale-x-100
        "
      />
    </a>

    <Link
      href="/npm"
      className="
        flex items-center gap-2 px-5 py-2 rounded-lg
        bg-green-900/20 border border-green-600/40
        text-green-200 font-bold
        hover:bg-green-500 hover:text-black
        hover:shadow-[0_0_25px_rgba(0,255,65,0.4)]
        transition-all duration-300
      "
    >
      ENTER SYSTEM <ArrowRight size={15} />
    </Link>
  </div>
</nav>



      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block border border-green-800 bg-green-900/10 px-3 py-1 rounded text-xs mb-4 animate-pulse text-green-300 tracking-widest">
            v1.0.0 SYSTEM ONLINE
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-none">
            <GlitchText text="AI-POWERED" /> <br />
            <span className="text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">SOFTWARE FACTORY</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Autonomous agentic pipeline that generates, tests, secures, and publishes npm packages in seconds. 
            <span className="block mt-2 text-green-400/80 font-semibold">No hallucinations. No broken builds. 100% Verified Code.</span>
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <Link href="/npm" className="group relative px-8 py-4 bg-green-600 text-black font-bold rounded hover:bg-green-500 transition-all overflow-hidden shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.8)]">
              <span className="relative z-10 flex items-center gap-2">
                INITIALIZE SEQUENCE <Terminal size={18} />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            
            <a href="https://github.com/vikasgautam2003/Package-Forge" target="_blank" className="px-8 py-4 border border-gray-700 text-gray-300 rounded hover:border-green-500 hover:text-green-500 transition-all flex items-center gap-2 backdrop-blur-sm hover:bg-green-900/10">
              <Github size={18} /> SOURCE CODE
            </a>
          </div>
        </div>

    
        <div className="mt-24 max-w-6xl mx-auto perspective-1000">
  <div
    className="
      bg-[#0b0b0b] border border-green-900/40 rounded-xl 
      overflow-hidden shadow-[0_0_40px_rgba(0,255,65,0.15)]
      transform hover:scale-[1.015] hover:shadow-[0_0_60px_rgba(0,255,65,0.35)]
      transition-all duration-500
      relative
    "
  >
    <div
      className="
        absolute inset-0 
        bg-gradient-to-br from-green-500/10 to-transparent
        opacity-0 group-hover:opacity-20
        transition-opacity duration-500
        pointer-events-none
      "
    />

    <div className="bg-black/70 p-4 flex items-center border-b border-green-900/30 backdrop-blur-md">
      <div className="w-3 h-3 rounded-full bg-red-500/80" />
      <div className="w-3 h-3 rounded-full bg-yellow-500/80 ml-2" />
      <div className="w-3 h-3 rounded-full bg-green-500/80 ml-2" />
      <span className="ml-4 text-xs text-green-300 tracking-widest">
        worker@package-forge:~/pipelines
      </span>
    </div>

    <div
      className="
        p-8 font-mono text-base space-y-3 
        bg-black/95 text-green-200 
        leading-relaxed tracking-wide
      "
    >
      <div className="flex gap-3">
        <span className="text-green-500 font-bold">$</span>
        <span className="text-white">forge create "cli-tool-resume"</span>
      </div>

      <div className="pl-6 space-y-2">
        <div><span className="text-blue-400">[AI]</span> Analyzing requirements...</div>
        <div><span className="text-blue-400">[AI]</span> Generating architecture (TypeScript + Node.js)...</div>
        <div><span className="text-yellow-500">[Worker]</span> Spinning up Docker sandbox...</div>
        <div><span className="text-purple-400">[Docker]</span> npm install... Done in 4.2s</div>
        <div><span className="text-cyan-400">[Test]</span> Running integration tests... <span className="text-green-500 font-bold">PASSED</span></div>
        <div><span className="text-white">[System]</span> Package ready for deployment.</div>
      </div>

      <div className="flex gap-2 animate-pulse pt-4">
        <span className="text-green-500">$</span>
        <span className="text-green-500 bg-green-400/40 w-2 h-5 block"></span>
      </div>
    </div>
  </div>
</div>


      
        <div id="features" className="grid md:grid-cols-3 gap-8 mt-32">
  <FeatureCard
    icon={<Cpu size={36} />}
    title="Self-Evolving AI Core"
    desc="Autonomous multi-agent engine capable of real-time reasoning, architecture generation, self-debugging, and cross-module optimization."
  />

  <FeatureCard
    icon={<ShieldCheck size={36} />}
    title="Isolated Code Sandboxing"
    desc="Every build executes in a sealed Docker micro-VM with runtime isolation, syscall monitoring, dependency validation, and security scanning."
  />

  <FeatureCard
    icon={<Server size={36} />}
    title="Distributed Worker Mesh"
    desc="Horizontally scalable queue-driven pipeline powered by Redis Streams and stateless workers designed for extreme workloads."
  />
</div>


        
       

      </main>
      
     
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-green-900/10 to-transparent pointer-events-none -z-10"></div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div
      className="
        group relative p-8 rounded-2xl
        border border-green-700/40 
        bg-black/40 backdrop-blur-md
        transition-all duration-300
        hover:-translate-y-2
        hover:border-green-400
        hover:bg-black/60
        hover:shadow-[0_0_35px_rgba(0,255,65,0.35)]
        overflow-hidden
      "
    >

      <div
        className="
          absolute inset-0 opacity-0 group-hover:opacity-25
          bg-gradient-to-br from-green-600/20 to-transparent
          transition-all duration-500
        "
      />

      <div
        className="
          absolute -top-12 -right-12 w-32 h-32 
          bg-green-500/20 rounded-full blur-3xl
          opacity-0 group-hover:opacity-40
          transition-all duration-700
        "
      />

  
      <div
        className="
          text-green-500 mb-6
          transition-transform duration-300
          group-hover:scale-125
          drop-shadow-[0_0_12px_rgba(0,255,65,0.9)]
        "
      >
        {icon}
      </div>

   
      <h3
        className="
          text-2xl font-bold text-white mb-3
          tracking-tight
          transition-colors
          group-hover:text-green-100
        "
      >
        {title}
      </h3>

    
      <p className="
        text-gray-300 text-sm leading-relaxed
        transition-all duration-300
        group-hover:text-gray-100
      ">
        {desc}
      </p>
    </div>
  );
}
