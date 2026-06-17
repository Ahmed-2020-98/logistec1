export function Spinner({ className = "py-20" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="size-10 animate-spin rounded-full border-4 border-line border-t-brand-600" />
    </div>
  );
}
