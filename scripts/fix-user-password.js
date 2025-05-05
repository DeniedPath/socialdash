// scripts/fix-user-password.js
// Run with: node scripts/fix-user-password.js [email] [new-password]

const { connectToDatabase } = require('../lib/db');
const User = require('../app/models/User');
const bcrypt = require('bcrypt');

async function fixUserPassword() {
  try {
    const email = process.argv[2]; // Get email from command line
    const newPassword = process.argv[3]; // Get new password from command line
    
    if (!email || !newPassword) {
      console.error('Please provide an email address and new password as parameters');
      console.error('Example: node scripts/fix-user-password.js test@gmail.com newpassword123');
      process.exit(1);
    }
    
    console.log('Connecting to database...');
    await connectToDatabase();
    
    console.log(`Looking up user with email: ${email}`);
    
    // Get user with password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.error(`No user found with email: ${email}`);
      process.exit(1);
    }
    
    console.log(`User found. ID: ${user._id}`);
    
    // Hash the password properly with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    console.log(`Password updated successfully for ${email}`);
    console.log(`You can now log in with:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${newPassword}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error fixing user password:', error);
    process.exit(1);
  }
}

fixUserPassword();
