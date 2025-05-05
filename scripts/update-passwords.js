// scripts/update-passwords.js
// Run with: node scripts/update-passwords.js

const { connectToDatabase } = require('../lib/db');
const User = require('../app/models/User');
const bcrypt = require('bcrypt');

async function updatePasswords() {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    
    // Example: Update the test@gmail.com user's password
    // Replace 'password123' with the actual plain password you want to set
    const testEmail = 'test@gmail.com';
    const plainPassword = 'password123'; 
    
    console.log(`Updating password for ${testEmail}...`);
    
    // Note: We need to explicitly select the password field
    const user = await User.findOne({ email: testEmail }).select('+password');
    if (!user) {
      console.error(`User with email ${testEmail} not found`);
      process.exit(1);
    }
    
    // Hash the password with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    
    console.log('Current password value:', user.password);
    console.log('New bcrypt hash:', hashedPassword);
    
    // Update the user's password
    user.password = hashedPassword;
    await user.save();
    
    console.log(`Password updated successfully for ${testEmail}`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating passwords:', error);
    process.exit(1);
  }
}

updatePasswords();
