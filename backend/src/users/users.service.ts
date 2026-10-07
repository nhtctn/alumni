import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUserDto,
  ReplaceUserDto,
  UpdateUserDto,
} from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];
  private nextId = 1;

  findAll(): User[] {
    return [...this.users].sort((a, b) => a.id - b.id);
  }

  findOne(id: number): User {
    const user = this.users.find((candidate) => candidate.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  create(dto: CreateUserDto): User {
    const email = this.normalizeEmail(dto.email);
    this.ensureEmailAvailable(email);
    const user = { id: this.nextId++, name: dto.name.trim(), email };
    this.users.push(user);
    return user;
  }

  replace(id: number, dto: ReplaceUserDto): User {
    const user = this.findOne(id);
    const email = this.normalizeEmail(dto.email);
    this.ensureEmailAvailable(email, id);
    user.name = dto.name.trim();
    user.email = email;
    return user;
  }

  update(id: number, dto: UpdateUserDto): User {
    const user = this.findOne(id);
    const email = dto.email ? this.normalizeEmail(dto.email) : user.email;
    this.ensureEmailAvailable(email, id);
    if (dto.name !== undefined) {
      user.name = dto.name.trim();
    }
    user.email = email;
    return user;
  }

  remove(id: number): void {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.users.splice(index, 1);
  }

  private ensureEmailAvailable(email: string, currentId?: number): void {
    if (
      this.users.some(
        (user) => user.email === email && user.id !== currentId,
      )
    ) {
      throw new ConflictException('A user with this e-mail already exists');
    }
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
