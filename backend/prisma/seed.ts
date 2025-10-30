import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.experience.deleteMany();

  // Create experiences with UNIQUE images
  const experiences = await Promise.all([
    prisma.experience.create({
      data: {
        title: 'Kayaking',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Udupi',
        price: 999,
        imageUrl: 'https://images.unsplash.com/photo-1569965335962-2317ff2a7658?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=738',
        duration: '3 hours',
        category: 'Water Sports'
      }
    }),
    prisma.experience.create({
      data: {
        title: 'Nandi Hills Sunrise',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Bangalore',
        price: 899,
        imageUrl: 'https://plus.unsplash.com/premium_photo-1663091802527-d22997fe51f8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
        duration: '4 hours',
        category: 'Adventure'
      }
    }),
    prisma.experience.create({
      data: {
        title: 'Coffee Trail',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Coorg',
        price: 1299,
        imageUrl: 'https://images.unsplash.com/photo-1635958067037-4c1c034eb528?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=707',
        duration: '5 hours',
        category: 'Nature'
      }
    }),
    prisma.experience.create({
      data: {
        title: 'Kayaking',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Udupi, Karnataka',
        price: 999,
        imageUrl: 'https://images.unsplash.com/photo-1689841667551-eeaee48f2247?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
        duration: '3 hours',
        category: 'Water Sports'
      }
    }),
    prisma.experience.create({
      data: {
        title: 'Nandi Hills Sunrise',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Bangalore',
        price: 899,
        imageUrl: 'https://plus.unsplash.com/premium_photo-1706626270683-96ce29b74b6d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
        duration: '4 hours',
        category: 'Adventure'
      }
    }),
    prisma.experience.create({
      data: {
        title: 'Boat Cruise',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Sunderban',
        price: 999,
        imageUrl: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&q=80',
        duration: '2 hours',
        category: 'Water Sports'
      }
    }),
    prisma.experience.create({
      data: {
        title: 'Bunjee Jumping',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Manali',
        price: 999,
        imageUrl: 'https://images.unsplash.com/photo-1559677624-3c956f10d431?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1025',
        duration: '1 hour',
        category: 'Adventure'
      }
    }),
    prisma.experience.create({
      data: {
        title: 'Coffee Trail',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Coorg',
        price: 1299,
        imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80',
        duration: '5 hours',
        category: 'Nature'
      }
    })
  ]);

  console.log(`✅ Created ${experiences.length} experiences`);

  // slots for each experience
  let slotCount = 0;
  for (const experience of experiences) {
    const today = new Date();
    const dates = Array.from({ length: 5 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i + 1);
      return date;
    });

    const times = ['07:00 am', '9:00 am', '11:00 am', '1:00 pm'];
    for (const date of dates) {
      for (const time of times) {
        await prisma.slot.create({
          data: {
            experienceId: experience.id,
            date,
            time,
            capacity: 8,
            bookedCount: Math.random() > 0.7 ? Math.floor(Math.random() * 4) : 0
          }
        });
        slotCount++;
      }
    }
  }

  console.log(`✅ Created ${slotCount} slots`);
  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });