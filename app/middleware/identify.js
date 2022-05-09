module.exports = (options, app) => {
  return async function identify(ctx, next) {
    console.log('launch identify');
    const sessionCookie = ctx.cookies.get('session') || '';
    await app.auth.verifySessionCookie(sessionCookie, true).then(async decodedClaims => {
      ctx.cookies.set('userInfo', JSON.stringify(decodedClaims));
      await next();
    }).catch(error => {
      ctx.status = 401;
    });
  }
};