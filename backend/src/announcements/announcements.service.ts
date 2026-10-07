import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateAnnouncementDto,
  ReplaceAnnouncementDto,
  UpdateAnnouncementDto,
} from './announcement.dto';
import { Announcement } from './announcement.entity';

@Injectable()
export class AnnouncementsService {
  private readonly announcements: Announcement[] = [];
  private nextId = 1;

  findAll(): Announcement[] {
    return [...this.announcements].sort((a, b) => a.id - b.id);
  }

  findOne(id: number): Announcement {
    const announcement = this.announcements.find(
      (candidate) => candidate.id === id,
    );
    if (!announcement) {
      throw new NotFoundException(`Announcement with id ${id} not found`);
    }
    return announcement;
  }

  create(dto: CreateAnnouncementDto): Announcement {
    const announcement: Announcement = {
      id: this.nextId++,
      title: dto.title.trim(),
      content: dto.content.trim(),
      publishedAt: new Date().toISOString(),
    };
    this.announcements.push(announcement);
    return announcement;
  }

  replace(id: number, dto: ReplaceAnnouncementDto): Announcement {
    const announcement = this.findOne(id);
    announcement.title = dto.title.trim();
    announcement.content = dto.content.trim();
    announcement.publishedAt = new Date().toISOString();
    return announcement;
  }

  update(id: number, dto: UpdateAnnouncementDto): Announcement {
    const announcement = this.findOne(id);
    if (dto.title !== undefined) {
      announcement.title = dto.title.trim();
    }
    if (dto.content !== undefined) {
      announcement.content = dto.content.trim();
    }
    return announcement;
  }

  remove(id: number): void {
    const index = this.announcements.findIndex(
      (announcement) => announcement.id === id,
    );
    if (index === -1) {
      throw new NotFoundException(`Announcement with id ${id} not found`);
    }
    this.announcements.splice(index, 1);
  }
}
