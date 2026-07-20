export const generateToken = () => {
    const token = Math.floor( Math.random() * 900000 + 100000 ).toString();
    const tokenExpiresDate = new Date( Date.now() + 60 * 1000 );

    return {
        token,
        tokenExpiresDate
    }
}