import {useEffect, useState, type ReactNode} from 'react';

interface ClientOnlyProps {
  children: () => ReactNode;
  fallback?: ReactNode;
}

/**
 * Ensures components only render on the client side to avoid SSR hydration mismatches.
 * Useful for components that depend on browser APIs or cause SSR issues.
 */
export function ClientOnly({children, fallback = null}: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children()}</>;
}