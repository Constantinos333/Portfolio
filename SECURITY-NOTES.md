# Security Notes

The login/register code in this portfolio is an educational browser-side prototype.

It is **not production authentication**.

The current version avoids storing plaintext passwords by hashing the entered password with the browser Web Crypto API before saving the demo record. This is still not sufficient for a real authentication system because the application remains entirely client-side.

A production implementation should instead use a trusted backend or authentication provider with:

- salted, slow password hashing designed for credentials;
- server-side authorization;
- secure session or token handling;
- rate limiting and lockout controls;
- protected transport and storage;
- proper account recovery and verification flows;
- security logging and monitoring.

The prototype is retained to document learning progress in form validation, state management, and application structure—not as a security reference implementation.
