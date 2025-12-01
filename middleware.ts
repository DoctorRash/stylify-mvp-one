import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session if expired
    const {
        data: { session },
    } = await supabase.auth.getSession();

    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ['/auth'];
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

    // If user is not authenticated and trying to access protected route
    if (!session && !isPublicRoute && pathname !== '/') {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/auth';
        return NextResponse.redirect(redirectUrl);
    }

    // If user is authenticated and trying to access auth page, we let them proceed
    // The client-side AuthPage will handle the redirect to dashboard if needed
    // This prevents redirect loops between middleware and server components

    // Role-based route protection
    if (session && (pathname.startsWith('/tailor') || pathname.startsWith('/customer'))) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

        // Redirect tailors trying to access customer routes
        if (pathname.startsWith('/customer') && profile?.role === 'tailor') {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = '/tailor/dashboard';
            return NextResponse.redirect(redirectUrl);
        }

        // Redirect customers trying to access tailor routes
        if (pathname.startsWith('/tailor') && profile?.role === 'customer') {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = '/customer/explore';
            return NextResponse.redirect(redirectUrl);
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
