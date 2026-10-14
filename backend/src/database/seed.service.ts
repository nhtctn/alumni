import { Client } from 'pg';
import { SeedFactory, type AnnouncementSeed, type EventRegistrationSeed, type EventSeed, type UserProfileSeed, type UserSeed } from './seed.factory';

type InsertedUser = UserSeed & { id: number };
type InsertedEvent = EventSeed & { id: number };

export class SeedService {
  private readonly factory = new SeedFactory();
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      host: process.env.DATABASE_HOST ?? 'database',
      port: Number(process.env.DATABASE_PORT ?? 5432),
      database: process.env.DATABASE_NAME ?? 'alumni',
      user: process.env.DATABASE_USER ?? 'alumni',
      password: process.env.DATABASE_PASSWORD ?? 'change-me',
    });
  }

  async seed(): Promise<void> {
    await this.client.connect();

    try {
      await this.truncate();

      const userCount = 12;
      const userSeeds: UserSeed[] = Array.from({ length: userCount }, (_, index) => this.factory.createUser(index));

      const users = await this.insertUsers(userSeeds);
      const profiles: UserProfileSeed[] = users.map((user, index) => this.factory.createUserProfile(user.id, index));
      const announcements: AnnouncementSeed[] = users.map((user, index) => this.factory.createAnnouncement(user.id, index));
      const eventSeeds: EventSeed[] = Array.from({ length: 6 }, (_, index) => this.factory.createEvent(users[index % users.length].id, index));
      const events = await this.insertEvents(eventSeeds);
      const registrations: EventRegistrationSeed[] = [];

      for (let eventIndex = 0; eventIndex < events.length; eventIndex += 1) {
        const event = events[eventIndex];
        for (let userIndex = 0; userIndex < users.length; userIndex += 1) {
          const user = users[userIndex];
          if ((eventIndex + userIndex) % 2 === 0) {
            registrations.push(this.factory.createEventRegistration(event.id, user.id, userIndex + eventIndex + 1));
          }
        }
      }

      await this.insertProfiles(profiles);
      await this.insertAnnouncements(announcements);
      await this.insertRegistrations(registrations);

      console.log(`Seeded ${users.length} users, ${profiles.length} profiles, ${announcements.length} announcements, ${events.length} events, and ${registrations.length} registrations.`);
    } finally {
      await this.client.end();
    }
  }

  private async truncate(): Promise<void> {
    await this.client.query('TRUNCATE TABLE event_registrations, events, announcements, user_profiles, users RESTART IDENTITY CASCADE');
  }

  private async insertUsers(users: UserSeed[]): Promise<InsertedUser[]> {
    const query = `
      INSERT INTO users (email, password_hash, name, role, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, password_hash, name, role, status
    `;

    const insertedUsers: InsertedUser[] = [];
    for (const user of users) {
      const result = await this.client.query<InsertedUser>(query, [user.email, user.password_hash, user.name, user.role, user.status]);
      insertedUsers.push(result.rows[0]);
    }
    return insertedUsers;
  }

  private async insertProfiles(profiles: UserProfileSeed[]): Promise<void> {
    const query = `
      INSERT INTO user_profiles (
        user_id, graduation_year, department, city, country, bio, linkedin_url, profile_image_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    for (const profile of profiles) {
      await this.client.query(query, [
        profile.user_id,
        profile.graduation_year,
        profile.department,
        profile.city,
        profile.country,
        profile.bio,
        profile.linkedin_url,
        profile.profile_image_url,
      ]);
    }
  }

  private async insertAnnouncements(announcements: AnnouncementSeed[]): Promise<void> {
    const query = `
      INSERT INTO announcements (title, content, published_at, created_by)
      VALUES ($1, $2, $3, $4)
    `;

    for (const announcement of announcements) {
      await this.client.query(query, [announcement.title, announcement.content, announcement.published_at, announcement.created_by]);
    }
  }

  private async insertEvents(events: EventSeed[]): Promise<InsertedEvent[]> {
    const query = `
      INSERT INTO events (title, description, start_at, end_at, location, organizer_id, is_public)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, title, description, start_at, end_at, location, organizer_id, is_public
    `;

    const insertedEvents: InsertedEvent[] = [];
    for (const event of events) {
      const result = await this.client.query<InsertedEvent>(query, [event.title, event.description, event.start_at, event.end_at, event.location, event.organizer_id, event.is_public]);
      insertedEvents.push(result.rows[0]);
    }
    return insertedEvents;
  }

  private async insertRegistrations(registrations: EventRegistrationSeed[]): Promise<void> {
    const query = `
      INSERT INTO event_registrations (event_id, user_id, status)
      VALUES ($1, $2, $3)
    `;

    for (const registration of registrations) {
      await this.client.query(query, [registration.event_id, registration.user_id, registration.status]);
    }
  }
}
