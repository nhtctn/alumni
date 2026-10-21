import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Application } from '../applications/application.entity'
import { User } from '../users/user.entity'

export class JobPosting {
  @ApiProperty({ example: 1 })
  id!: number

  @ApiProperty({ example: 1 })
  userId!: number

  @ApiPropertyOptional({ type: () => User })
  user?: User

  @ApiProperty({ example: 'Backend Developer' })
  title!: string

  @ApiProperty({ example: 'Istanbul University' })
  company!: string

  @ApiPropertyOptional({ example: 'Istanbul' })
  city?: string

  @ApiPropertyOptional({ example: 'Build and maintain web applications.' })
  description?: string

  @ApiProperty({
    example: '2026-10-21T07:00:00.000Z',
    format: 'date-time',
  })
  createdAt!: string

  @ApiPropertyOptional({ type: () => [Application] })
  applications?: Application[]
}
