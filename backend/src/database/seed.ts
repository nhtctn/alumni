import { SeedService } from './seed.service';

async function bootstrap(): Promise<void> {
  const seedService = new SeedService();
  await seedService.seed();
}

bootstrap().catch((error) => {
  console.error('Database seeding failed:', error);
  process.exit(1);
});
