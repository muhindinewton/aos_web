'use client';

// global-error.tsx replaces the root layout entirely when an error happens in
// it, so it must declare its own <html> and <body>. No imports from the rest
// of the app — global styles aren't loaded at this point.

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 24,
          fontFamily: 'Poppins, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          background: '#FAFAFA',
          color: '#1A1A1A',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: 'rgba(193, 18, 31, 0.10)',
            color: '#C1121F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 42,
            fontWeight: 700,
          }}
        >
          !
        </div>
        <h1 style={{ marginTop: 24, fontSize: 28, fontWeight: 700 }}>
          Application error
        </h1>
        <p style={{ marginTop: 8, maxWidth: 480, fontSize: 15, color: '#555555', lineHeight: 1.5 }}>
          A critical error prevented this page from loading. Please refresh, or contact support if the problem persists.
        </p>
        {error?.digest && (
          <p style={{ marginTop: 12, fontSize: 11, fontFamily: 'monospace', color: '#8A8A8A' }}>
            Error ref: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          style={{
            marginTop: 28,
            padding: '12px 24px',
            borderRadius: 999,
            background: '#C1121F',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: 14,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
