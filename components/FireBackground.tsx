const SPARK_COUNT = 22;

const sparks = Array.from({ length: SPARK_COUNT }, (_, i) => {
  const left = (i * 4.54 + (i % 3) * 7) % 100;
  const delay = (i * 0.83) % 9;
  const duration = 7 + ((i * 1.7) % 6);
  const size = 1.5 + (i % 3) * 0.75;
  const drift = ((i % 5) - 2) * 12;
  return { left, delay, duration, size, drift, i };
});

export function FireBackground() {
  return (
    <div
      aria-hidden
      className="fire-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="fire-glow" />
      {sparks.map((s) => (
        <span
          key={s.i}
          className="spark"
          style={{
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            ["--spark-drift" as string]: `${s.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
