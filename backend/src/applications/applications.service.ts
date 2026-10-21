import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Client } from 'pg';
import {
  CreateApplicationDto,
  CreateDirectApplicationDto,
  ReplaceApplicationDto,
  UpdateApplicationDto,
} from './application.dto';
import { Application } from './application.entity';

@Injectable()
export class ApplicationsService {
  private readonly client: Client;
  private connected = false;

  constructor() {
    this.client = new Client({
      host: process.env.DATABASE_HOST ?? 'database',
      port: Number(process.env.DATABASE_PORT ?? 5432),
      database: process.env.DATABASE_NAME ?? 'alumni',
      user: process.env.DATABASE_USER ?? 'alumni',
      password: process.env.DATABASE_PASSWORD ?? 'change-me',
    });
  }

  private async ensureConnected(): Promise<void> {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
    }
  }

  private async ensureUserExists(userId: number): Promise<void> {
    const result = await this.client.query(
      'SELECT id FROM users WHERE id = $1',
      [userId],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
  }

  private async ensureJobPostingExists(jobPostingId: number): Promise<void> {
    const result = await this.client.query(
      'SELECT id FROM job_postings WHERE id = $1',
      [jobPostingId],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException(
        `Job posting with id ${jobPostingId} not found`,
      );
    }
  }

  async create(
    jobPostingId: number,
    dto: CreateApplicationDto,
  ): Promise<Application> {
    await this.ensureConnected();
    await this.ensureJobPostingExists(jobPostingId);
    await this.ensureUserExists(dto.userId);

    try {
      const result = await this.client.query(
        `
          INSERT INTO applications (user_id, job_posting_id)
          VALUES ($1, $2)
          RETURNING
            id,
            user_id AS "userId",
            job_posting_id AS "jobPostingId",
            status,
            created_at AS "createdAt"
        `,
        [dto.userId, jobPostingId],
      );
      return result.rows[0];
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === '23505'
      ) {
        throw new ConflictException(
          'This user has already applied to this job posting',
        );
      }
      throw error;
    }
  }

  async findByJobPosting(jobPostingId: number): Promise<Application[]> {
    await this.ensureConnected();
    await this.ensureJobPostingExists(jobPostingId);

    const result = await this.client.query(
      `
        SELECT
          a.id,
          a.user_id AS "userId",
          u.name AS "userName",
          a.job_posting_id AS "jobPostingId",
          a.status,
          a.created_at AS "createdAt"
        FROM applications a
        JOIN users u ON u.id = a.user_id
        WHERE a.job_posting_id = $1
        ORDER BY a.id ASC
      `,
      [jobPostingId],
    );
    return result.rows;
  }

  async findByUser(userId: number): Promise<Application[]> {
    await this.ensureConnected();
    await this.ensureUserExists(userId);

    const result = await this.client.query(
      `
        SELECT
          a.id,
          a.user_id AS "userId",
          a.job_posting_id AS "jobPostingId",
          j.title,
          j.company,
          a.status,
          a.created_at AS "createdAt"
        FROM applications a
        JOIN job_postings j ON j.id = a.job_posting_id
        WHERE a.user_id = $1
        ORDER BY a.id ASC
      `,
      [userId],
    );
    return result.rows;
  }

  async createDirect(dto: CreateDirectApplicationDto): Promise<Application> {
    return this.create(dto.jobPostingId, dto);
  }

  async findAll(): Promise<Application[]> {
    await this.ensureConnected();
    const result = await this.client.query(
      `
        SELECT
          id,
          user_id AS "userId",
          job_posting_id AS "jobPostingId",
          status,
          created_at AS "createdAt"
        FROM applications
        ORDER BY id ASC
      `,
    );
    return result.rows;
  }

  async findOne(id: number): Promise<Application> {
    await this.ensureConnected();
    const result = await this.client.query(
      `
        SELECT
          id,
          user_id AS "userId",
          job_posting_id AS "jobPostingId",
          status,
          created_at AS "createdAt"
        FROM applications
        WHERE id = $1
      `,
      [id],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }
    return result.rows[0];
  }

  async replace(
    id: number,
    dto: ReplaceApplicationDto,
  ): Promise<Application> {
    await this.ensureConnected();
    await this.ensureJobPostingExists(dto.jobPostingId);
    await this.ensureUserExists(dto.userId);

    try {
      const result = await this.client.query(
        `
          UPDATE applications
          SET user_id = $1, job_posting_id = $2, status = $3
          WHERE id = $4
          RETURNING
            id,
            user_id AS "userId",
            job_posting_id AS "jobPostingId",
            status,
            created_at AS "createdAt"
        `,
        [dto.userId, dto.jobPostingId, dto.status.trim(), id],
      );
      if (result.rowCount === 0) {
        throw new NotFoundException(`Application with id ${id} not found`);
      }
      return result.rows[0];
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === '23505'
      ) {
        throw new ConflictException(
          'This user has already applied to this job posting',
        );
      }
      throw error;
    }
  }

  async update(id: number, dto: UpdateApplicationDto): Promise<Application> {
    await this.ensureConnected();
    const current = await this.findOne(id);
    if (dto.status === undefined) {
      return current;
    }

    const result = await this.client.query(
      `
        UPDATE applications
        SET status = $1
        WHERE id = $2
        RETURNING
          id,
          user_id AS "userId",
          job_posting_id AS "jobPostingId",
          status,
          created_at AS "createdAt"
      `,
      [dto.status.trim(), id],
    );
    return result.rows[0];
  }

  async remove(id: number): Promise<void> {
    await this.ensureConnected();
    const result = await this.client.query(
      'DELETE FROM applications WHERE id = $1 RETURNING id',
      [id],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }
  }
}
