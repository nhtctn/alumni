import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateJobPostingDto {
  @ApiProperty({ example: 'Backend Developer' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Istanbul University' })
  @IsString()
  @IsNotEmpty()
  company!: string;

  @ApiPropertyOptional({ example: 'Istanbul' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @ApiPropertyOptional({ example: 'Build and maintain web applications.' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}

export class CreateDirectJobPostingDto extends CreateJobPostingDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  userId!: number;
}

export class ReplaceJobPostingDto {
  @ApiProperty({ example: 'Backend Developer' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Istanbul University' })
  @IsString()
  @IsNotEmpty()
  company!: string;

  @ApiPropertyOptional({ example: 'Istanbul' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @ApiPropertyOptional({ example: 'Build and maintain web applications.' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}

export class UpdateJobPostingDto {
  @ApiPropertyOptional({ example: 'Backend Developer' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({ example: 'Istanbul University' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  company?: string;

  @ApiPropertyOptional({ example: 'Istanbul' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @ApiPropertyOptional({ example: 'Build and maintain web applications.' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}
