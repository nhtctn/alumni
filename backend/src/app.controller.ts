import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@Controller()
@ApiTags('General')
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Get the API welcome message' })
  @ApiResponse({ status: 200, description: 'API welcome message.' })
  getRoot(): string {
    return 'Welcome to Alumni Istanbul API'
  }

  @Get('hello')
  @ApiOperation({ summary: 'Get a generic greeting' })
  @ApiResponse({ status: 200, description: 'Generic greeting.' })
  getHello(): string {
    return 'Hello, World!'
  }

  @Get('hello/:name')
  @ApiOperation({ summary: 'Get a personalized greeting' })
  @ApiParam({ name: 'name', type: String, example: 'Ada' })
  @ApiResponse({ status: 200, description: 'Personalized greeting.' })
  getHelloByName(@Param('name') name: string): string {
    return `Hello, ${name}!`
  }

  @Get('sum/:a/:b')
  @ApiOperation({ summary: 'Add two integers' })
  @ApiParam({ name: 'a', type: Number, example: 2 })
  @ApiParam({ name: 'b', type: Number, example: 3 })
  @ApiResponse({
    status: 200,
    description: 'The sum of both route parameters.',
  })
  @ApiResponse({
    status: 400,
    description: 'Route parameters are not integers.',
  })
  getSum(
    @Param('a', ParseIntPipe) a: number,
    @Param('b', ParseIntPipe) b: number,
  ): number {
    return a + b
  }

  @Get('about')
  @ApiOperation({ summary: 'Get project information' })
  @ApiResponse({ status: 200, description: 'Project information.' })
  getAbout(): { name: string; description: string } {
    return {
      name: 'Alumni Istanbul',
      description:
        'A web platform that keeps Istanbul University and its graduates connected for life.',
    }
  }
}
