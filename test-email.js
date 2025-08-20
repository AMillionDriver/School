require('dotenv').config();
const emailSender = require('./server/src/utils/emailSender');

async function testEmail() {
    console.log('Testing email configuration...');
    try {
        const result = await emailSender.sendWelcomeEmail(
            'nanangnurmansah5@gmail.com',
            'Nanang'
        );
        
        if (result) {
            console.log('✅ Test email sent successfully!');
        } else {
            console.log('❌ Failed to send test email');
        }
    } catch (error) {
        console.error('Error sending test email:', error);
    }
}

testEmail();
