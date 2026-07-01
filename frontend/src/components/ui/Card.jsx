export default function Card({
  children,
  className = "",
}) {
  return (
    <div
      className={`
      rounded-xl
      bg-[#131A26]
      border border-white/10
      p-6
      shadow-lg
      hover:border-violet-700/50
      transition-all
      duration-300
      ${className}
      `}
    >
      {children}
    </div>
  );
}