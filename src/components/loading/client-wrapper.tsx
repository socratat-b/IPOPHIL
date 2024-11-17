'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Loading } from './loading';

const ClientRouteLoadingWrapperContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <>
      {isLoading && <Loading />}
      {children}
    </>
  );
};

export function ClientRouteLoadingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientRouteLoadingWrapperContent>
        {children}
      </ClientRouteLoadingWrapperContent>
    </Suspense>
  );
}
