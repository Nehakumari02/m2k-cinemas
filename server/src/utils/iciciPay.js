const crypto = require('crypto');

/**
 * Computes an HMAC SHA256 digest for ICICI Payment Gateway
/**
 * Computes an HMAC SHA256 digest for ICICI Payment Gateway
 * @param {string} msg - The message/payload string to hash
 * @param {string} keyString - The secret key provided by ICICI
 * @returns {string} The computed hexadecimal digest
 */
function hmacDigest(msg, keyString) {
    const hmac = crypto.createHmac('sha256', keyString);
    hmac.update(msg);
    return hmac.digest('hex');
}

/**
 * Generates the payload and hash for initiating a sale with ICICI
 */
function generateInitiateSalePayload(amount, orderId, returnUrl) {
    const mid = '100000000007164';
    const key = 'db06cca0-838b-4e01-8b20-6ac446ffb6bd'; // Correct UAT key from original prompt
    const aggId = 'A100000000007164';
    const txnDate = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);

    const payload = {
        addlParam1: '000',
        addlParam2: '111',
        aggregatorID: aggId,
        amount: Number(amount).toFixed(2), // ICICI often expects .00 format
        currencyCode: '356',
        customerEmailID: 'user@m2k.com', // Placeholder for now
        customerMobileNo: '919999999999',
        customerName: 'User',
        merchantId: mid,
        merchantTxnNo: orderId,
        payType: '0',
        returnURL: returnUrl,
        transactionType: 'SALE',
        txnDate: txnDate
    };

    // 1. Sort the Json request packet in alphabetical order based on the key
    const sortedKeys = Object.keys(payload).sort();
    
    // 2. Create a string concatenating all the values from the sorted string
    let plainText = '';
    for (const k of sortedKeys) {
        plainText += payload[k];
    }

    // 3. Create securehash
    payload.secureHash = hmacDigest(plainText, key);

    return payload;
}

module.exports = {
    hmacDigest,
    generateInitiateSalePayload,
    iciciKey: 'db06cca0-838b-4e01-8b20-6ac446ffb6bd'
};
