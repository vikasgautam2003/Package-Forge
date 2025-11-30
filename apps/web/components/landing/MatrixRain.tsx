// "use client";

// import { useRef, useEffect } from "react";

// export const MatrixRain = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current!;
//     const ctx = canvas.getContext("2d")!;

//     const resize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };

//     resize();

//     const chars =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$%&*(){}<>/\\|~=";

//     const fontSize = 30;
//     let columns = Math.floor(canvas.width / fontSize);
//     let drops = new Array(columns).fill(1);

//     const draw = () => {
//       ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       ctx.fillStyle = "#00FF41";
//       ctx.font = `${fontSize}px monospace`;

//       for (let i = 0; i < drops.length; i++) {
//         const char = chars[Math.floor(Math.random() * chars.length)];
//         const x = i * fontSize;
//         const y = drops[i] * fontSize;

//         ctx.fillText(char, x, y);

//         if (y > canvas.height && Math.random() > 0.98) {
//           drops[i] = 0;
//         }

//         drops[i]++;
//       }

//       requestAnimationFrame(draw);
//     };

//     requestAnimationFrame(draw);

//     const onResize = () => {
//       resize();
//       columns = Math.floor(canvas.width / fontSize);
//       drops = new Array(columns).fill(1);
//     };

//     window.addEventListener("resize", onResize);

//     return () => {
//       window.removeEventListener("resize", onResize);
//     };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-25"
//     />
//   );
// };




"use client";

import { useRef, useEffect } from "react";

export const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$%&*(){}<>/\\|~=";

    const fontSize = 24;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = new Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00FF41";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars.charAt(Math.floor(Math.random() * chars.length)); // <-- FIXED

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);

    const onResize = () => {
      resize();
      columns = Math.floor(canvas.width / fontSize);
      drops = new Array(columns).fill(1);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-25"
    />
  );
};
