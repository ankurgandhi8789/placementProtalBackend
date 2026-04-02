require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const SiteContent = require('./src/models/SiteContent');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Create superadmin
  const exists = await User.findOne({ email: 'superadmin@maasavitri.com' });
  if (!exists) {
    await User.create({
      name: 'Super Admin',
      email: 'superadmin@maasavitri.com',
      password: 'Admin@123',
      role: 'superadmin',
    });
    console.log('✅ Superadmin created: superadmin@maasavitri.com / Admin@123');
  } else {
    console.log('ℹ️  Superadmin already exists');
  }

  // Create default site content
  const content = await SiteContent.findOne();
  if (!content) {
    await SiteContent.create({
      stats: { happyClients: 500, successfulPlacements: 1200, conversionRate: 95, awards: 15 },
      aboutText: 'Maa Savitri Consultancy Services connects skilled teachers with top schools, ensuring quality education and professional growth.',
      contactInfo: {
        phone: '+91 98765 43210',
        email: 'info@maasavitri.com',
        address: 'New Delhi, India',
      },
    });
    console.log('✅ Default site content created');
  }

  await mongoose.disconnect();
  console.log('Done!');
};

seed().catch(console.error);
