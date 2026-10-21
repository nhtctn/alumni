import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Application } from '../applications/application.entity'
import { JobPosting } from '../job-postings/job-posting.entity'

export class User {
  @ApiProperty({ example: 1 })
  id!: number

  @ApiProperty({ example: 'Ada Lovelace' })
  name!: string

  @ApiProperty({ example: 'ada@example.com' })
  email!: string

  @ApiPropertyOptional({ type: () => [JobPosting] })
  jobPostings?: JobPosting[]

  @ApiPropertyOptional({ type: () => [Application] })
  applications?: Application[]
}
