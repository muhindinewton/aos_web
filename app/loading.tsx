export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-16">
      {/* Branded spinner — primary-red ring with a transparent gap */}
      <div
        className="w-12 h-12 rounded-full border-[3px] border-primary/20 animate-spin"
        style={{ borderTopColor: 'var(--primary)' }}
        aria-label="Loading"
        role="status"
      />
      <p className="mt-4 text-sm text-theme-muted">Loading…</p>
    </div>
  );
}
