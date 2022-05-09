'use strict';

const Controller = require('egg').Controller;

class SessionController extends Controller {
    async create() {
        // Get the ID token passed and the CSRF token.
        const idToken = this.ctx.request.body.idToken || "";
        console.log('launch session');
        // Set session expiration to 5 days.
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        // Create the session cookie. This will also verify the ID token in the process.
        // The session cookie will have the same claims as the ID token.
        // To only allow session cookie setting on recent sign-in, auth_time in ID token
        // can be checked to ensure user was recently signed in before creating a session cookie.
        await this.app.auth.createSessionCookie(idToken, { expiresIn }).then(
            (sessionCookie) => {
                // Set cookie policy for session cookie.
                const options = { maxAge: expiresIn, httpOnly: true, secure: false };
                this.ctx.cookies.set('session', sessionCookie, options);
                this.ctx.status = 200;
                this.ctx.body = "OK";
            },
            (error) => {
                this.ctx.status = 401;
                this.ctx.body = "UNAUTHORIZED REQUEST!";
                return;
            }
        );
    }
}

module.exports = SessionController;
