import { NextResponse } from "next/server";

export async function middleware(req) {
    console.log("req", req);

    if (req.nextUrl.searchParams) {
        let encodedAuth = req.nextUrl.searchParams.get("params");
        return NextResponse.redirect(new URL("/encrypted-signin?params=" + encodedAuth, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/profile",
}