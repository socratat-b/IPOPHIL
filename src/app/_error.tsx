import { NextPageContext } from 'next'
import Link from 'next/link'

interface ErrorProps {
    statusCode?: number;
}

function Error({ statusCode }: ErrorProps) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-600">
                    {statusCode || 'Error'}
                </h1>
                <p className="text-2xl mt-4">
                    {statusCode === 404
                        ? 'Page Not Found'
                        : statusCode === 500
                            ? 'Server Error'
                            : 'An unexpected error has occurred'}
                </p>
                <Link href="/" className="mt-6 inline-block underline">
                    Go back to Home
                </Link>
            </div>
        </div>
    );
}

// Setting up the initial props to handle the error status
Error.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
