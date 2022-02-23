import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export const middleware = async (req) => {
  /* Token will exist if user is logged in */
  const token = await getToken({ req, secret: process.env.JWT_SECRET })

  const { pathname } = req.nextUrl

  /* Allow requests if ff is true:
        1. It's a request for next-auth session and provider fetching
        2. the token exists
    */
  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next()
  }

  /*  */

  /* Redirect them to login if they dont have token AND requesting a protected node */
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`)
  }
}
