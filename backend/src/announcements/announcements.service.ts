import { Injectable, NotFoundException } from '@nestjs/common';
import { Client } from 'pg';
import {
  CreateAnnouncementDto,
  ReplaceAnnouncementDto,
  UpdateAnnouncementDto,
} from './announcement.dto';
import { Announcement } from './announcement.entity';

@Injectable()
export class AnnouncementsService {
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

  private async resolveAuthorId(): Promise<number> {
    const result = await this.client.query(
      'SELECT id FROM users ORDER BY id ASC LIMIT 1',
    );
    if (result.rowCount === 0) {
      throw new NotFoundException('No user exists to assign the announcement author');
    }
    return Number(result.rows[0].id);
  }

  async findAll(): Promise<Announcement[]> {
    await this.ensureConnected();
    const result = await this.client.query(
      `SELECT id, title, content, published_at AS "publishedAt" FROM announcements ORDER BY id ASC`,
    );
    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      publishedAt: row.publishedAt,
    }));
  }

  async findOne(id: number): Promise<Announcement> {
    await this.ensureConnected();
    const result = await this.client.query(
      `SELECT id, title, content, published_at AS "publishedAt" FROM announcements WHERE id = $1`,
      [id],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException(`Announcement with id ${id} not found`);
    }
    return result.rows[0];
  }

  async create(dto: CreateAnnouncementDto): Promise<Announcement> {
    await this.ensureConnected();
    const authorId = await this.resolveAuthorId();
    const result = await this.client.query(
      `
        INSERT INTO announcements (title, content, published_at, created_by)
        VALUES ($1, $2, NOW(), $3)
        RETURNING id, title, content, published_at AS "publishedAt"
      `,
      [dto.title.trim(), dto.content.trim(), authorId],
    );
    return result.rows[0];
  }

  async replace(id: number, dto: ReplaceAnnouncementDto): Promise<Announcement> {
    await this.ensureConnected();
    const result = await this.client.query(
      `
        UPDATE announcements
        SET title = $1, content = $2, published_at = NOW(), updated_at = NOW()
        WHERE id = $3
        RETURNING id, title, content, published_at AS "publishedAt"
      `,
      [dto.title.trim(), dto.content.trim(), id],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException(`Announcement with id ${id} not found`);
    }
    return result.rows[0];
  }

  async update(id: number, dto: UpdateAnnouncementDto): Promise<Announcement> {
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

    if (dto.content !== undefined) {
      fields.push(`content = $${index}`);
      values.push(dto.content.trim());
      index += 1;
    }

    if (fields.length === 0) {
      return current;
    }

    fields.push(`published_at = NOW()`);
    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await this.client.query(
      `UPDATE announcements SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, title, content, published_at AS "publishedAt"`,
      values,
    );
    if (result.rowCount === 0) {
      throw new NotFoundException(`Announcement with id ${id} not found`);
    }
    return result.rows[0];
  }

  async remove(id: number): Promise<void> {
    await this.ensureConnected();
    const result = await this.client.query(
      'DELETE FROM announcements WHERE id = $1 RETURNING id',
      [id],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException(`Announcement with id ${id} not found`);
    }
  }
}
