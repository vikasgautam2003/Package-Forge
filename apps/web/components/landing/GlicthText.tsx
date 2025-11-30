import React from 'react';

export const GlitchText = ({ text }: { text: string }) => {
  return (
    <div className="relative inline-block group">
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-red-500 opacity-70 animate-pulse group-hover:translate-x-[2px] group-hover:translate-y-[1px]">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-blue-500 opacity-70 animate-pulse group-hover:-translate-x-[2px] group-hover:-translate-y-[1px]">
        {text}
      </span>
    </div>
  );
};