const webpush = require('web-push');

console.log('Generating VAPID keys...');
const vapidKeys = webpush.generateVAPIDKeys();

console.log('\nYour VAPID keys:');
console.log('================');
console.log('Public Key:');
console.log(vapidKeys.publicKey);
console.log('\nPrivate Key:');
console.log(vapidKeys.privateKey);
console.log('\n================');
console.log('Copy these keys to your frontend and backend files.');
