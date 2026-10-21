import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({ example: 2, description: 'ID of the applying user.' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId!: number;
}

export class CreateDirectApplicationDto extends CreateApplicationDto {
  @ApiProperty({ example: 1, description: 'ID of the job posting.' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  jobPostingId!: number;
}

export class ReplaceApplicationDto extends CreateDirectApplicationDto {
  @ApiProperty({ example: 'applied' })
  @IsString()
  @IsNotEmpty()
  status!: string;
}

export class UpdateApplicationDto {
  @ApiPropertyOptional({ example: 'reviewing' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  status?: string;
}
