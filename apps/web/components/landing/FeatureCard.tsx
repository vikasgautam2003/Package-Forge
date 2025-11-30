"use client";

import React, { useRef } from "react";

export function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    card.style.setProperty("--rotateX", `${-y / 20}deg`);
    card.style.setProperty("--rotateY", `${x / 20}deg`);
  };

  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--rotateX", "0deg");
    card.style.setProperty("--rotateY", "0deg");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      className="
        group relative p-8 rounded-2xl
        border border-green-500/40
        bg-black/40 backdrop-blur-xl
        transition-all duration-300
        hover:shadow-[0_0_60px_rgba(0,255,65,0.7)]
        hover:-translate-y-2
        transform-gpu
      "
      style={{
        transform: "perspective(800px) rotateX(var(--rotateX)) rotateY(var(--rotateY))",
      }}
    >
      <div className="
        absolute inset-0 pointer-events-none
        bg-[radial-gradient(circle_at_center,rgba(0,255,120,0.25),transparent_60%)]
        opacity-0 group-hover:opacity-30
        transition-all duration-500
        blur-xl
      " />

      <div className="
        absolute inset-0 pointer-events-none opacity-10
        bg-[linear-gradient(to_right,rgba(0,255,65,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,65,0.25)_1px,transparent_1px)]
        bg-[size:20px_20px]
      " />

      <div className="
        absolute inset-0 pointer-events-none
        border border-green-500/0 rounded-2xl
        group-hover:border-green-500/60
        group-hover:shadow-[0_0_25px_rgba(0,255,65,0.6)]
        transition-all duration-500
      " />

      <div className="
        absolute top-0 left-0 w-full h-full 
        bg-gradient-to-br from-green-400/20 to-transparent
        translate-y-full group-hover:translate-y-0
        opacity-0 group-hover:opacity-40
        transition-all duration-700
      " />

      <div className="
        relative z-10 text-green-400 mb-6 
        transition-transform duration-500
        group-hover:scale-125 
        drop-shadow-[0_0_20px_rgba(0,255,65,1)]
      ">
        {icon}
      </div>

      <h3 className="
        relative z-10 text-2xl font-bold text-white mb-3
        drop-shadow-[0_0_5px_rgba(0,255,65,0.8)]
      ">
        {title}
      </h3>

      <p className="
        relative z-10 text-gray-300 text-sm leading-relaxed 
        group-hover:text-green-200 
        transition-all duration-300
      ">
        {desc}
      </p>
    </div>
  );
}
