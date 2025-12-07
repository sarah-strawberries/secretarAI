interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div role="alert" className="error-boundary-container flex flex-col items-center justify-center h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <pre className="error-boundary-pre text-sm mb-4 p-4 rounded overflow-auto max-w-full">{error.message}</pre>
      <button onClick={resetErrorBoundary} className="error-boundary-button px-4 py-2 rounded font-semibold hover:opacity-90 transition-opacity">Try again</button>
    </div>
  );
}
