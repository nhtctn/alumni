import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Client } from 'pg';
import {
  CreateUserDto,
  ReplaceUserDto,
  UpdateUserDto,
} from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
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

  async findAll(): Promise<User[]> {
    await this.ensureConnected();
    const result = await this.client.query(
      'SELECT id, name, email FROM users ORDER BY id ASC',
    );
    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
    }));
  }

  async findOne(id: number): Promise<User> {
    await this.ensureConnected();
    const result = await this.client.query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [id],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return result.rows[0];
  }

  async create(dto: CreateUserDto): Promise<User> {
    await this.ensureConnected();
    const email = this.normalizeEmail(dto.email);
    await this.ensureEmailAvailable(email);

    const result = await this.client.query(
      `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email
      `,
      [dto.name.trim(), email, 'temporary-password'],
    );
    return result.rows[0];
  }

  async replace(id: number, dto: ReplaceUserDto): Promise<User> {
    await this.ensureConnected();
    const email = this.normalizeEmail(dto.email);
    await this.ensureEmailAvailable(email, id);

    const result = await this.client.query(
      `
        UPDATE users
        SET name = $1, email = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING id, name, email
      `,
      [dto.name.trim(), email, id],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return result.rows[0];
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    await this.ensureConnected();
    const current = await this.findOne(id);
    const email = dto.email ? this.normalizeEmail(dto.email) : current.email;
    await this.ensureEmailAvailable(email, id);

    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    if (dto.name !== undefined) {
      fields.push(`name = $${index}`);
      values.push(dto.name.trim());
      index += 1;
    }

    if (dto.email !== undefined) {
      fields.push(`email = $${index}`);
      values.push(email);
      index += 1;
    }

    if (fields.length === 0) {
      return current;
    }

    values.push(id);
    fields.push('updated_at = NOW()');

    const result = await this.client.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, name, email`,
      values,
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return result.rows[0];
  }

  async remove(id: number): Promise<void> {
    await this.ensureConnected();
    const result = await this.client.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  private async ensureEmailAvailable(
    email: string,
    currentId?: number,
  ): Promise<void> {
    await this.ensureConnected();
    const result = await this.client.query(
      'SELECT id FROM users WHERE email = $1 AND id <> $2 LIMIT 1',
      [email, currentId ?? -1],
    );
    if ((result.rowCount ?? 0) > 0) {
      throw new ConflictException('A user with this e-mail already exists');
    }
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
