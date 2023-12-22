const crypto = require('crypto');

async function generateJWT() {
    const jwtSecret = "16bd0509-b8c1-4ffd-973a-683f07574813";

    // Set headers for JWT
    const header = {
        typ: "JWT",
        alg: "HS256",
    };

    // Prepare timestamp in seconds
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const data = {
        iss: "a7cc2052-e911-4de1-aaf3-b89313bd51a9",
        iat: currentTimestamp,
        exp: currentTimestamp + 30, // expiry time is 30 seconds from time of creation
        // jti: 'jwt_nonce'
    };

    function base64url(source) {
        // Encode in classical base64
        const encodedSource = Buffer.from(source).toString('base64');

        // Replace characters according to base64url specifications
        return encodedSource.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }

    // encode header
    const stringifiedHeader = new TextEncoder().encode(JSON.stringify(header));
    const encodedHeader = base64url(stringifiedHeader);

    // encode data
    const stringifiedData = new TextEncoder().encode(JSON.stringify(data));
    const encodedData = base64url(stringifiedData);

    // build token
    const token = `${encodedHeader}.${encodedData}`;

    // sign token
    const signature = crypto.createHmac('sha256', jwtSecret).update(token).digest('base64');
    const encodedSignature = base64url(Buffer.from(signature, 'base64'));

    const signedToken = `${token}.${encodedSignature}`;

    return signedToken;
}

module.exports = { generateJWT };
