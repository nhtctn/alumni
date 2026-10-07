import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('api')
@ApiTags('Health')
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Check API health' })
  @ApiResponse({ status: 200, description: 'The API is healthy.' })
  getHealth(): { status: string } {
    return { status: 'ok' };
  }
}
