import { ApiProperty } from '@nestjs/swagger';

export class Announcement {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Alumni networking evening' })
  title!: string;

  @ApiProperty({ example: 'Join us for an evening of alumni networking.' })
  content!: string;

  @ApiProperty({ example: '2026-10-07T12:00:00.000Z', format: 'date-time' })
  publishedAt!: string;
}
