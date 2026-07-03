const crypto = require('crypto');
const axios = require('axios');

const mid = '100000000007164';
const key = 'db06cca0-838b-4e01-8b20-6ac446ffb6bd';
const aggId = 'A100000000007164';
const orderId = 'TXN12345';
const amount = '100';
const returnUrl = 'http://localhost:3000';
const txnDate = '20260703120000';

function getHash(str) {
  const hmac = crypto.createHmac('sha256', key);
  return hmac.update(str).digest('hex');
}

async function testFormat(formatName, str) {
  const hash = getHash(str);
  const payload = {
    merchantId: mid,
    aggregatorID: aggId,
    merchantTxnNo: orderId,
    amount: amount,
    txnDate: txnDate,
    returnURL: returnUrl,
    secureHash: hash
  };
  
  try {
    const res = await axios.post('https://pgpayuat.icicibank.com/tsp/pg/api/v2/initiateSale', payload);
    console.log(`[SUCCESS] Format: ${formatName} =>`, res.data);
    return true;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.responseDescription) {
       console.log(`[FAILED] Format: ${formatName} => ${err.response.data.responseDescription}`);
    } else {
       console.log(`[ERROR] Format: ${formatName} =>`, err.message);
    }
    return false;
  }
}

async function run() {
  // Test different common patterns
  
  // 1. Pipe separated alphabetical
  await testFormat('Pipe Alphabetical', `${aggId}|${amount}|${mid}|${orderId}|${returnUrl}|${txnDate}`);
  
  // 2. Original I used without txnDate
  await testFormat('Original No txnDate', `${mid}|${orderId}|${amount}|INR|${returnUrl}|${aggId}`);
  
  // 3. With txnDate added
  await testFormat('Original With txnDate', `${mid}|${orderId}|${amount}|INR|${returnUrl}|${aggId}|${txnDate}`);
  
  // 4. merchantId|merchantTxnNo|amount|txnDate|returnURL|aggregatorID
  await testFormat('Logical Order 1', `${mid}|${orderId}|${amount}|${txnDate}|${returnUrl}|${aggId}`);

  // 5. Without INR
  await testFormat('Logical Order 2', `${mid}|${orderId}|${amount}|${txnDate}|${returnUrl}|${aggId}`);
  
  // 6. Eazypay format: merchantId|merchantTxnNo|amount|returnUrl
  await testFormat('Eazypay standard', `${mid}|${orderId}|${amount}|${returnUrl}`);
  
  // 7. Double colon separated
  await testFormat('Double Colon', `${mid}::${orderId}::${amount}::${txnDate}::${returnUrl}::${aggId}`);
  
  // 8. Tilde separated
  await testFormat('Tilde Separated', `${mid}~${orderId}~${amount}~${txnDate}~${returnUrl}~${aggId}`);
}

run();
