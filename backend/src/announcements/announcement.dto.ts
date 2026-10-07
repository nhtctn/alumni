import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'Alumni networking evening' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Join us for an evening of alumni networking.' })
  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class ReplaceAnnouncementDto {
  @ApiProperty({ example: 'Alumni networking evening' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Join us for an evening of alumni networking.' })
  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class UpdateAnnouncementDto {
  @ApiPropertyOptional({ example: 'Alumni networking evening' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({ example: 'Join us for an evening of alumni networking.' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;
}
