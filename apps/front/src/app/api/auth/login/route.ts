import {resultify} from "@lib/exception";
import {client} from "@lib/client";
import {NextResponse} from "next/server";
import setCookie from 'set-cookie-parser';

export async function POST(req: Request) {

    const body = await req.json();

    const {result, ok} = await resultify(() => client.auth.login.post(body));
    if (!ok) {
        return NextResponse.json({
            error: true,
            message: 'Une erreur est survenue lors de la connexion',
        })
    }
    if (result.error) {
        return NextResponse.json({
            error: true,
            message: result.error.value.message ?? 'Une erreur est survenue lors de la connexion',
        });
    }

    const headerCookie = result.response.headers.get('set-cookie');
    if (!headerCookie) {
        return NextResponse.json({
            error: true,
            message: 'Une erreur est survenue lors de la connexion',
        });
    }

    const response = NextResponse.json({
        error: false,
        message: 'Connexion réussie',
        data: result.data,
    });

    const cookiesStrings = setCookie.splitCookiesString(headerCookie);

    const cookies = cookiesStrings.map(cookieStr => setCookie.parseString(cookieStr));

    cookies.forEach(({name, value, path, domain, expires, httpOnly, secure, sameSite}, key) => {
        response.cookies.set(name, value, {
            path,
            domain,
            expires,
            httpOnly,
            secure,
            sameSite: true
        });
    })

    return response;
}