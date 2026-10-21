import { Injectable, NotFoundException } from '@nestjs/common';
import { Client } from 'pg';
import {
  CreateDirectJobPostingDto,
  CreateJobPostingDto,
  ReplaceJobPostingDto,
  UpdateJobPostingDto,
} from './job-posting.dto';
import { JobPosting } from './job-posting.entity';

@Injectable()
export class JobPostingsService {
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

  async create(userId: number, dto: CreateJobPostingDto): Promise<JobPosting> {
    await this.ensureConnected();
    await this.ensureUserExists(userId);

    const result = await this.client.query(
      `
        INSERT INTO job_postings (user_id, title, company, city, description)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
          id,
          user_id AS "userId",
          title,
          company,
          city,
          description,
          created_at AS "createdAt"
      `,
      [
        userId,
        dto.title.trim(),
        dto.company.trim(),
        dto.city?.trim() ?? null,
        dto.description?.trim() ?? null,
      ],
    );
    return result.rows[0];
  }

  async findByUser(userId: number): Promise<JobPosting[]> {
    await this.ensureConnected();
    await this.ensureUserExists(userId);

    const result = await this.client.query(
      `
        SELECT
          id,
          user_id AS "userId",
          title,
          company,
          city,
          description,
          created_at AS "createdAt"
        FROM job_postings
        WHERE user_id = $1
        ORDER BY id ASC
      `,
      [userId],
    );
    return result.rows;
  }

  async findAll(): Promise<JobPosting[]> {
    await this.ensureConnected();
    const result = await this.client.query(
      `
        SELECT
          id,
          user_id AS "userId",
          title,
          company,
          city,
          description,
          created_at AS "createdAt"
        FROM job_postings
        ORDER BY id ASC
      `,
    );
    return result.rows;
  }

  async findOne(id: number): Promise<JobPosting> {
    await this.ensureConnected();
    const result = await this.client.query(
      `
        SELECT
          id,
          user_id AS "userId",
          title,
          company,
          city,
          description,
          created_at AS "createdAt"
        FROM job_postings
        WHERE id = $1
      `,
      [id],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException(`Job posting with id ${id} not found`);
    }
    return result.rows[0];
  }

  async createDirect(dto: CreateDirectJobPostingDto): Promise<JobPosting> {
    return this.create(dto.userId, dto);
  }

  async replace(id: number, dto: ReplaceJobPostingDto): Promise<JobPosting> {
    await this.ensureConnected();
    const result = await this.client.query(
      `
        UPDATE job_postings
        SET title = $1, company = $2, city = $3, description = $4
        WHERE id = $5
        RETURNING
          id,
          user_id AS "userId",
          title,
          company,
          city,
          description,
          created_at AS "createdAt"
      `,
      [
        dto.title.trim(),
        dto.company.trim(),
        dto.city?.trim() ?? null,
        dto.description?.trim() ?? null,
        id,
      ],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException(`Job posting with id ${id} not found`);
    }
    return result.rows[0];
  }

  async update(id: number, dto: UpdateJobPostingDto): Promise<JobPosting> {
    await this.ensureConnected();
    const current = await this.findOne(id);
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    if (dto.title !== undefined) {
      fields.push(`title = $${index}`);
      values.push(dto.title.trim());
      index += 1;
    }
    if (dto.company !== undefined) {
      fields.push(`company = $${index}`);
      values.push(dto.company.trim());
      index += 1;
    }
    if (dto.city !== undefined) {
      fields.push(`city = $${index}`);
      values.push(dto.city.trim());
      index += 1;
    }
    if (dto.description !== undefined) {
      fields.push(`description = $${index}`);
      values.push(dto.description.trim());
      index += 1;
    }
    if (fields.length === 0) {
      return current;
    }

    values.push(id);
    const result = await this.client.query(
      `
        UPDATE job_postings
        SET ${fields.join(', ')}
        WHERE id = $${index}
        RETURNING
          id,
          user_id AS "userId",
          title,
          company,
          city,
          description,
          created_at AS "createdAt"
      `,
      values,
    );
    if (result.rowCount === 0) {
      throw new NotFoundException(`Job posting with id ${id} not found`);
    }
    return result.rows[0];
  }

  async remove(id: number): Promise<void> {
    await this.ensureConnected();
    const result = await this.client.query(
      'DELETE FROM job_postings WHERE id = $1 RETURNING id',
      [id],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException(`Job posting with id ${id} not found`);
    }
  }
}
