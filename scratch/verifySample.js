const crypto = require('crypto');

function hmacDigest(msg, keyString) {
    const hmac = crypto.createHmac('sha256', keyString);
    hmac.update(msg);
    return hmac.digest('hex');
}

const payload = {
  "merchantId": "100000000007164",
  "aggregatorID": "A100000000007164",
  "merchantTxnNo": "76786776876898",
  "amount": "100.00",
  "currencyCode": "356",
  "payType": "0",
  "customerEmailID": "abc@gmail.com",
  "transactionType": "SALE",
  "returnURL": "https://pgpayuat.icicibank.com/tsp/pg/api/merchant",
  "txnDate": "20251209151059",
  "customerMobileNo": "919999999999",
  "customerName": "Narayan",
  "addlParam1": "000",
  "addlParam2": "111"
};

const sortedKeys = Object.keys(payload).sort();
let plainText = '';
for (const k of sortedKeys) {
    plainText += payload[k];
}

const key1 = 'db06cca0-838b-4e01-8b20-6ac446ffb6bd'; // Old key
const hash1 = hmacDigest(plainText, key1);
console.log("Expected: 229e66a35b581940fc005876efed7e35918b62cb1c42574815b44997b3c35ee6");
console.log("Hash 1:  ", hash1);

const key2 = 'd6e2f534dc994a2db585e6c57062ddd8'; // New key
const hash2 = hmacDigest(plainText, key2);
console.log("Hash 2:  ", hash2);
