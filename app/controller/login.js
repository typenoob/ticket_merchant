'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
    index() {
        console.log(this.app.auth);
        // As httpOnly cookies are to be used, do not persist any state client side.
        this.app.auth.setPersistence(firebase.auth.Auth.Persistence.NONE);
        // When the user signs in with email and password.
        this.app.auth.signInWithEmailAndPassword('admin@admin.com', '123456').then(user => {
            // Get the user's ID token as it is needed to exchange for a session cookie.
            return user.getIdToken().then(idToken => {
                // Session login endpoint is queried and the session cookie is set.
                // CSRF protection should be taken into account.
                // ...
                this.app.idToken = idToken;
            });
        }).then(() => {
            // A page redirect would suffice as the persistence is set to NONE.
            return this.app.auth().signOut();
        }).then(() => {
            // The user is signed out.
            // ...
        });
    }
}
module.exports = LoginController;
