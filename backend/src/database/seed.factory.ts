export type UserSeed = {
  email: string;
  password_hash: string;
  name: string;
  role: 'admin' | 'academician' | 'alumni' | 'student' | 'guest';
  status: 'active' | 'invited' | 'suspended';
};

export type UserProfileSeed = {
  user_id: number;
  graduation_year: number | null;
  department: string | null;
  city: string | null;
  country: string | null;
  bio: string | null;
  linkedin_url: string | null;
  profile_image_url: string | null;
};

export type AnnouncementSeed = {
  title: string;
  content: string;
  published_at: Date;
  created_by: number;
};

export type EventSeed = {
  title: string;
  description: string;
  start_at: Date;
  end_at: Date;
  location: string | null;
  organizer_id: number;
  is_public: boolean;
};

export type EventRegistrationSeed = {
  event_id: number;
  user_id: number;
  status: 'registered' | 'attended' | 'cancelled';
};

export class SeedFactory {
  private readonly userRoles = ['admin', 'academician', 'alumni', 'student', 'guest'] as const;
  private readonly userStatuses = ['active', 'invited', 'suspended'] as const;
  private readonly departments = ['Computer Engineering', 'Business Administration', 'Law', 'Psychology', 'Economics', 'Medicine', 'Architecture'];
  private readonly cities = ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Kocaeli', 'Trabzon'];
  private readonly countries = ['Turkey', 'Germany', 'United Kingdom', 'United States', 'Netherlands', 'Canada', 'France'];
  private readonly titles = [
    'Career Day 2026',
    'Alumni Networking Night',
    'Research Seminar',
    'Startup Mentorship Session',
    'University Innovation Expo',
    'Graduate Career Panel',
  ];
  private readonly bioTemplates = [
    'I work in digital product development and enjoy mentoring students through career transitions.',
    'I lead engineering teams and support community-driven university partnerships.',
    'I focus on data-driven strategy, innovation, and research-led projects.',
    'I help young graduates discover opportunities in technology and business.',
  ];

  createUser(index: number, role?: (typeof this.userRoles)[number]): UserSeed {
    const firstName = ['Ada', 'Emre', 'Sena', 'Can', 'Zeynep', 'Mert', 'Leyla', 'Baran', 'Elif', 'Cem'][index % 10];
    const lastName = ['Yilmaz', 'Demir', 'Kaya', 'Aydin', 'Celik', 'Sari', 'Korkmaz', 'Aksoy', 'Arslan', 'Yildiz'][index % 10];
    const selectedRole = role ?? this.userRoles[index % this.userRoles.length];

    return {
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index + 1}@alumni.test`,
      password_hash: `hash_${index + 1}`,
      name: `${firstName} ${lastName}`,
      role: selectedRole,
      status: this.userStatuses[index % this.userStatuses.length],
    };
  }

  createUserProfile(userId: number, index: number): UserProfileSeed {
    const year = 2018 + (index % 8);

    return {
      user_id: userId,
      graduation_year: year,
      department: this.departments[index % this.departments.length],
      city: this.cities[index % this.cities.length],
      country: this.countries[index % this.countries.length],
      bio: this.bioTemplates[index % this.bioTemplates.length],
      linkedin_url: `https://linkedin.com/in/${userId}`,
      profile_image_url: `https://images.example.com/profiles/${index + 1}.jpg`,
    };
  }

  createAnnouncement(createdBy: number, index: number): AnnouncementSeed {
    return {
      title: `${this.titles[index % this.titles.length]} ${index + 1}`,
      content: `This announcement is generated for testing purposes. It highlights community activity and university milestones for alumni participants.`,
      published_at: new Date(Date.now() - index * 86400000),
      created_by: createdBy,
    };
  }

  createEvent(organizerId: number, index: number): EventSeed {
    const start = new Date(Date.now() + index * 86400000 + 3600000 * (index % 6));
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    return {
      title: `${this.titles[index % this.titles.length]}`,
      description: 'Generated event description for database seeding and integration testing.',
      start_at: start,
      end_at: end,
      location: this.cities[index % this.cities.length],
      organizer_id: organizerId,
      is_public: index % 2 === 0,
    };
  }

  createEventRegistration(eventId: number, userId: number, index: number): EventRegistrationSeed {
    return {
      event_id: eventId,
      user_id: userId,
      status: ['registered', 'attended', 'cancelled'][index % 3] as 'registered' | 'attended' | 'cancelled',
    };
  }
}
