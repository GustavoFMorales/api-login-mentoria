import dotenv from 'dotenv';

dotenv.config();

console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***' : 'undefined');
console.log('SERVER:', process.env.SERVER);
console.log('PORT:', process.env.PORT);
