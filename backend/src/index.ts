// ===== FILE: src/index.ts =====
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// ===== VALIDATION SCHEMAS =====
const bookingSchema = z.object({
  slotId: z.string().uuid(),
  quantity: z.number().int().min(1).max(8),
  userName: z.string().min(2),
  userEmail: z.string().email(),
  promoCode: z.string().optional()
});

// ===== UTILITY FUNCTIONS =====
function generateReferenceId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function calculateDiscount(promoCode: string, subtotal: number): number {
  const promoCodes: Record<string, { type: 'percentage' | 'flat'; value: number }> = {
    'SAVE10': { type: 'percentage', value: 10 },
    'FLAT100': { type: 'flat', value: 100 },
    'FIRST20': { type: 'percentage', value: 20 }
  };

  const promo = promoCodes[promoCode.toUpperCase()];
  if (!promo) return 0;

  if (promo.type === 'percentage') {
    return Math.round((subtotal * promo.value) / 100);
  }
  return promo.value;
}

// ===== API ROUTES =====

// GET /api/experiences - Get all experiences
app.get('/api/experiences', async (req: Request, res: Response) => {
  try {
    const { search, location, minPrice, maxPrice } = req.query;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { category: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (location) {
      where.location = { contains: location as string, mode: 'insensitive' };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseInt(minPrice as string);
      if (maxPrice) where.price.lte = parseInt(maxPrice as string);
    }

    const experiences = await prisma.experience.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { slots: true }
        }
      }
    });

    res.json({
      success: true,
      data: experiences,
      count: experiences.length
    });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experiences'
    });
  }
});

// GET /api/experiences/:id - Get experience details with slots
app.get('/api/experiences/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        slots: {
          where: {
            date: { gte: new Date() }
          },
          orderBy: [{ date: 'asc' }, { time: 'asc' }]
        }
      }
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    res.json({
      success: true,
      data: {
        experience,
        slots: experience.slots
      }
    });
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experience details'
    });
  }
});

// POST /api/bookings - Create a booking
app.post('/api/bookings', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = bookingSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: validation.error.errors
      });
    }

    const { slotId, quantity, userName, userEmail, promoCode } = validation.data;

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get slot with lock
      const slot = await tx.slot.findUnique({
        where: { id: slotId },
        include: { experience: true }
      });

      if (!slot) {
        throw new Error('Slot not found');
      }

      // Check availability
      const availableSeats = slot.capacity - slot.bookedCount;
      if (availableSeats < quantity) {
        throw new Error(`Only ${availableSeats} seats available`);
      }

      // Calculate pricing
      const subtotal = slot.experience.price * quantity;
      const taxes = Math.round(subtotal * 0.06);
      const discount = promoCode ? calculateDiscount(promoCode, subtotal) : 0;
      const total = subtotal + taxes - discount;

      // Create booking
      const booking = await tx.booking.create({
        data: {
          slotId,
          userName,
          userEmail,
          promoCode: promoCode || null,
          quantity,
          subtotal,
          taxes,
          discount,
          total,
          referenceId: generateReferenceId(),
          status: 'confirmed'
        }
      });

      // Update slot booked count
      await tx.slot.update({
        where: { id: slotId },
        data: { bookedCount: slot.bookedCount + quantity }
      });

      return booking;
    });

    res.status(201).json({
      success: true,
      data: {
        booking: result,
        referenceId: result.referenceId
      },
      message: 'Booking confirmed successfully'
    });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create booking'
    });
  }
});

// POST /api/promo/validate - Validate promo code
app.post('/api/promo/validate', async (req: Request, res: Response) => {
  try {
    const { code, subtotal } = req.body;

    if (!code || !subtotal) {
      return res.status(400).json({
        success: false,
        message: 'Code and subtotal are required'
      });
    }

    const discount = calculateDiscount(code, subtotal);

    if (discount === 0) {
      return res.json({
        success: false,
        data: {
          valid: false,
          discount: 0,
          newTotal: subtotal
        },
        message: 'Invalid promo code'
      });
    }

    res.json({
      success: true,
      data: {
        valid: true,
        discount,
        newTotal: subtotal - discount
      },
      message: 'Promo code applied successfully'
    });
  } catch (error) {
    console.error('Error validating promo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate promo code'
    });
  }
});

// GET /api/bookings/:referenceId - Get booking by reference ID
app.get('/api/bookings/:referenceId', async (req: Request, res: Response) => {
  try {
    const { referenceId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { referenceId },
      include: {
        slot: {
          include: {
            experience: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking'
    });
  }
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});


// ===== FILE: prisma/schema.prisma =====
/*
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Experience {
  id          String   @id @default(uuid())
  title       String
  description String
  location    String
  price       Int
  imageUrl    String
  duration    String
  category    String
  rating      Float    @default(4.5)
  reviewCount Int      @default(0)
  slots       Slot[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([category])
  @@index([location])
}

model Slot {
  id            String      @id @default(uuid())
  experienceId  String
  experience    Experience  @relation(fields: [experienceId], references: [id], onDelete: Cascade)
  date          DateTime
  time          String
  capacity      Int
  bookedCount   Int         @default(0)
  bookings      Booking[]
  createdAt     DateTime    @default(now())

  @@unique([experienceId, date, time])
  @@index([experienceId])
  @@index([date])
}

model Booking {
  id            String   @id @default(uuid())
  slotId        String
  slot          Slot     @relation(fields: [slotId], references: [id])
  userName      String
  userEmail     String
  promoCode     String?
  quantity      Int      @default(1)
  subtotal      Int
  taxes         Int
  discount      Int      @default(0)
  total         Int
  referenceId   String   @unique
  status        String   @default("confirmed")
  createdAt     DateTime @default(now())

  @@index([slotId])
  @@index([referenceId])
  @@index([userEmail])
}

model PromoCode {
  code          String   @id
  discountType  String
  discountValue Int
  active        Boolean  @default(true)
  createdAt     DateTime @default(now())
}
*/


// ===== FILE: prisma/seed.ts =====
/*
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create experiences
  const experiences = await Promise.all([
    prisma.experience.create({
      data: {
        title: 'Kayaking',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Udupi',
        price: 999,
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
        duration: '3 hours',
        category: 'Adventure'
      }
    }),
    prisma.experience.create({
      data: {
        title: 'Nandi Hills Sunrise',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Bangalore',
        price: 899,
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        duration: '4 hours',
        category: 'Nature'
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
        category: 'Culture'
      }
    }),
    prisma.experience.create({
      data: {
        title: 'Boat Cruise',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Sundarban',
        price: 999,
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
        duration: '2 hours',
        category: 'Adventure'
      }
    }),
    prisma.experience.create({
      data: {
        title: 'Bunjee Jumping',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Manali',
        price: 999,
        imageUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80',
        duration: '1 hour',
        category: 'Adventure'
      }
    }),
    prisma.experience.create({
      data: {
        title: 'Mountain Trekking',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Udupi, Karnataka',
        price: 999,
        imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80',
        duration: '6 hours',
        category: 'Adventure'
      }
    })
  ]);

  // Create slots for each experience
  for (const experience of experiences) {
    const dates = [
      new Date('2025-10-22'),
      new Date('2025-10-23'),
      new Date('2025-10-24'),
      new Date('2025-10-25'),
      new Date('2025-10-26')
    ];

    const times = ['07:00 am', '09:00 am', '11:00 am', '01:00 pm'];

    for (const date of dates) {
      for (const time of times) {
        await prisma.slot.create({
          data: {
            experienceId: experience.id,
            date,
            time,
            capacity: 8,
            bookedCount: Math.random() > 0.7 ? Math.floor(Math.random() * 8) : 0
          }
        });
      }
    }
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
*/