import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { JobPosting } from '../job-postings/job-posting.entity'
import { User } from '../users/user.entity'

export class Application {
  @ApiProperty({ example: 1 })
  id!: number

  @ApiProperty({ example: 1 })
  userId!: number

  @ApiPropertyOptional({ type: () => User })
  user?: User

  @ApiPropertyOptional({ example: 'Ada Lovelace' })
  userName?: string

  @ApiProperty({ example: 1 })
  jobPostingId!: number

  @ApiPropertyOptional({ type: () => JobPosting })
  jobPosting?: JobPosting

  @ApiPropertyOptional({ example: 'Backend Developer' })
  title?: string

  @ApiPropertyOptional({ example: 'Istanbul University' })
  company?: string

  @ApiProperty({ example: 'applied' })
  status!: string

  @ApiProperty({
    example: '2026-10-21T07:00:00.000Z',
    format: 'date-time',
  })
  createdAt!: string
}
