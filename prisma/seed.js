const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'admin';

  console.log('🧹 Cleaning up existing admin user...');
  
  // DELETE ALL USERS with this email to be sure
  await prisma.user.deleteMany({
    where: { 
      OR: [
        { email: adminEmail },
        { email: 'admin@gmail.com' }
      ]
    }
  });

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  console.log('👑 Creating NEW admin user...');
  
  const admin = await prisma.user.create({
    data: {
      name: 'Administrator',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin', // ⚠️ MAKE SURE THIS IS 'admin' NOT 'user'
    },
  });
  
  console.log('✅ ADMIN account created successfully!');
  console.log('📧 Email:', admin.email);
  console.log('🎯 Role:', admin.role); // THIS SHOULD SAY 'admin'
  console.log('🆔 ID:', admin.id);
  
  // Verify the role was saved correctly
  const verifyUser = await prisma.user.findUnique({
    where: { email: adminEmail }
  });
  console.log('🔍 Verification - Role in DB:', verifyUser.role);
}

main()
  .catch((e) => {
    console.error('❌ Error creating admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });