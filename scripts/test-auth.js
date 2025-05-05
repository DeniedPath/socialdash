// scripts/test-auth.js
// Run with: node scripts/test-auth.js

const { connectToDatabase } = require('../lib/db');
const mongoose = require('mongoose');
const User = require('../app/models/User');
const bcrypt = require('bcrypt');

// Test user details
const TEST_USER = {
  email: 'test@example.com',
  username: 'testuser',
  password: 'password123'
};

async function cleanup() {
  try {
    // Delete test user if exists
    await User.deleteOne({ email: TEST_USER.email });
    console.log(`Cleaned up test user: ${TEST_USER.email}`);
  } catch (error) {
    console.error('Error cleaning up:', error);
  }
}

async function createTestUser() {
  try {
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(TEST_USER.password, saltRounds);
    
    // Create user with properly hashed password
    const user = new User({
      email: TEST_USER.email,
      username: TEST_USER.username,
      password: hashedPassword
    });
    
    await user.save();
    console.log(`Created test user: ${user.email} (ID: ${user._id})`);
    return user;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
}

async function verifyUserPassword() {
  try {
    // Fetch user WITH password
    const user = await User.findOne({ email: TEST_USER.email }).select('+password');
    
    if (!user) {
      console.error('User not found in database!');
      return false;
    }
    
    console.log(`Retrieved user: ${user.email}`);
    console.log(`Password field exists: ${!!user.password}`);
    
    if (!user.password) {
      console.error('Password field is missing or empty!');
      return false;
    }
    
    // Verify password works with bcrypt
    const isPasswordValid = await bcrypt.compare(TEST_USER.password, user.password);
    
    console.log(`Password verification result: ${isPasswordValid ? 'SUCCESS' : 'FAILED'}`);
    return isPasswordValid;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

async function runTests() {
  try {
    console.log('==== AUTHENTICATION FLOW TEST ====');
    console.log('Connecting to database...');
    await connectToDatabase();
    
    console.log('\n1. Cleaning up any existing test data...');
    await cleanup();
    
    console.log('\n2. Creating test user...');
    await createTestUser();
    
    console.log('\n3. Verifying password authentication...');
    const passwordVerified = await verifyUserPassword();
    
    console.log('\n==== TEST RESULTS ====');
    if (passwordVerified) {
      console.log('✅ Authentication test PASSED!');
      console.log('\nYou can now log in with:');
      console.log(`Email: ${TEST_USER.email}`);
      console.log(`Password: ${TEST_USER.password}`);
    } else {
      console.log('❌ Authentication test FAILED!');
      console.log('Check the logs above for details on what went wrong.');
    }
    
    console.log('\nClosing database connection...');
    await mongoose.connection.close();
    
    process.exit(passwordVerified ? 0 : 1);
  } catch (error) {
    console.error('Test error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

runTests();
