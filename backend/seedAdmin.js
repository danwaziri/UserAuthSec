const bcrypt = require('bcryptjs');
const { User } = require('./src/models');
require('dotenv').config();

async function seedAdmin() {
    try {
        const password = 'Admin@123456';
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const [user, created] = await User.findOrCreate({
            where: { email: 'admin@uaauthsec.com' },
            defaults: {
                email: 'admin@uaauthsec.com',
                password: password, // The hook will hash it if we use User.create, but findOrCreate uses defaults which also triggers hooks for creation
                full_name: 'System Administrator',
                role: 'admin',
                is_active: true
            }
        });

        if (!created) {
            // Update existing user password
            user.password = password;
            await user.save();
            console.log('✓ Admin password updated successfully.');
        } else {
            console.log('✓ Admin user created successfully.');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
