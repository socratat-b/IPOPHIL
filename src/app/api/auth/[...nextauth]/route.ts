import { authOptions } from '@/lib/auth/config'
import NextAuth from 'next-auth'

const handler = NextAuth(authOptions)

export const GET = handler
export const POST = handler