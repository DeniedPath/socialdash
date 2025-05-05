// scripts/debug-user.js
// Run with: node scripts/debug-user.js [email]

const { connectToDatabase } = require('../lib/db');
const User = require('../app/models/User');

async function debugUser() {
  try {
    const email = process.argv[2]; // Get email from command line
    
    if (!email) {
      console.error('Please provide an email address as a parameter');
      console.error('Example: node scripts/debug-user.js test@gmail.com');
      process.exit(1);
    }
    
    console.log('Connecting to database...');
    await connectToDatabase();
    
    console.log(`Looking up user with email: ${email}`);
    
    // First try without password
    const userWithoutPassword = await User.findOne({ email });
    
    if (!userWithoutPassword) {
      console.error(`No user found with email: ${email}`);
      process.exit(1);
    }
    
    console.log('\n-----------------------------------------------');
    console.log('USER FOUND (without password field):');
    console.log('-----------------------------------------------');
    console.log(JSON.stringify(userWithoutPassword.toObject(), null, 2));
    
    // Now get with password
    const userWithPassword = await User.findOne({ email }).select('+password');
    
    console.log('\n-----------------------------------------------');
    console.log('USER WITH PASSWORD FIELD:');
    console.log('-----------------------------------------------');
    console.log(JSON.stringify({
      ...userWithPassword.toObject(),
      // Only show beginning of password hash for security
      password: userWithPassword.password 
        ? `${userWithPassword.password.substring(0, 10)}... (${userWithPassword.password.length} chars total)` 
        : null
    }, null, 2));
    
    const passwordInfo = userWithPassword.password 
      ? `Password hash exists (${userWithPassword.password.length} characters)`
      : 'Password field is empty or missing';
    
    console.log('\n-----------------------------------------------');
    console.log('DIAGNOSIS:');
    console.log('-----------------------------------------------');
    console.log(`- User ID: ${userWithPassword._id}`);
    console.log(`- Email: ${userWithPassword.email}`);
    console.log(`- Password: ${passwordInfo}`);
    
    if (userWithPassword.password && userWithPassword.password.startsWith('$2')) {
      console.log('- Password format appears to be valid bcrypt hash (starts with $2)');
    } else if (userWithPassword.password) {
      console.log('- WARNING: Password does not appear to be a valid bcrypt hash!');
    }
    
    console.log('\nTo test logging in, use these credentials in your application.');
    process.exit(0);
  } catch (error) {
    console.error('Error debugging user:', error);
    process.exit(1);
  }
}

debugUser();
