const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookies(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];

        if (!tokenCookieValue) {
            return next(); // No token? Move on
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload; // Attach user data to request
        } catch (error) {
            console.warn("Invalid token:", error.message);
            // Optional: res.clearCookie(cookieName);
        }

        next(); // ✅ Only one next call, clean and safe
    };
}

module.exports = checkForAuthenticationCookies;
