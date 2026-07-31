const STARS = [
  { top: "12%", left: "8%", size: 10, delay: "0s" },
  { top: "22%", left: "88%", size: 14, delay: "0.6s" },
  { top: "42%", left: "18%", size: 8, delay: "1.2s" },
  { top: "68%", left: "76%", size: 12, delay: "1.8s" },
  { top: "80%", left: "30%", size: 9, delay: "2.4s" },
  { top: "34%", left: "56%", size: 7, delay: "3s" },
  { top: "58%", left: "6%", size: 11, delay: "3.6s" },
  { top: "8%", left: "62%", size: 8, delay: "4.2s" },
];

export function Starfield() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {STARS.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-primary/70 animate-twinkle"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
}