'use strict';

const bcrypt = require('bcrypt');
const { randomUUID } = require('crypto');

module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash('ChangeMe123!', 12);

    await queryInterface.bulkInsert('users', [
      {
        id: randomUUID(),
        fullName: 'Demo Admin',
        email: 'demo.admin@nest.local',
        passwordHash,
        role: 'admin',
        isActive: true, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      email: 'demo.admin@nest.local',
    });
  },
};
