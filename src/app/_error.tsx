// src\app\_error.tsx
import Link from 'next/link'

import { Suspense } from 'react'
import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className='flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16'>
                <div className='w-full space-y-6 text-center'>
                    <div className='space-y-3'>
                        <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl transition-transform hover:scale-110'>
                            500
                        </h1>
                        <p className='text-muted-foreground'>
                            Something went wrong. Please try again later.
                        </p>
                    </div>
                    <div className='space-x-4'>
                        <button
                            onClick={() => reset()}
                            className='inline-flex h-10 items-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
                        >
                            Try again
                        </button>
                        <Link
                            href='/'
                            className='inline-flex h-10 items-center rounded-md bg-secondary px-8 text-sm font-medium text-secondary-foreground shadow transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
                            prefetch={false}
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </Suspense>
    )
}