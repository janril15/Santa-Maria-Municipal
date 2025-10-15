const { execSync } = require('child_process');

console.log('🔍 SYSTEM AUDIT VERIFICATION CHECK\n');

// Check 1: API Authentication
console.log('1. Checking API Authentication...');
try {
  const authCheck = execSync('grep -r "authenticateAdmin" app/api/announcements/').toString();
  console.log('✅ API Routes have authentication:', authCheck.split('\n').filter(Boolean).length, 'routes protected');
} catch (e) {
  console.log('❌ No authentication found in API routes');
}

// Check 2: Prisma Client Instances
console.log('\n2. Checking Prisma Client Usage...');
try {
  const badInstances = execSync('grep -r "new PrismaClient()" app/api/').toString();
  if (badInstances.trim()) {
    console.log('❌ Found direct PrismaClient instances:', badInstances.split('\n').filter(Boolean).length);
  } else {
    console.log('✅ No direct PrismaClient instances found');
  }
} catch (e) {
  console.log('✅ No direct PrismaClient instances found');
}

// Check 3: Data Flow
console.log('\n3. Checking Data Sources...');
try {
  const staticData = execSync('grep -r "getAllAnnouncements\\|lib/announcements" app/ components/').toString();
  if (staticData.trim()) {
    console.log('⚠️  Still using static data in:', staticData.split('\n').filter(Boolean).length, 'files');
  } else {
    console.log('✅ No static data usage found');
  }
} catch (e) {
  console.log('✅ No static data usage found');
}

console.log('\n📊 AUDIT SUMMARY:');
console.log('Run manual tests to complete verification');