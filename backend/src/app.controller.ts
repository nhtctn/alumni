import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot(): string {
    return 'Welcome to Alumni Istanbul API';
  }

  @Get('hello')
  getHello(): string {
    return 'Hello, World!';
  }

  @Get('hello/:name')
  getHelloByName(@Param('name') name: string): string {
    return `Hello, ${name}!`;
  }

  @Get('sum/:a/:b')
  getSum(
    @Param('a', ParseIntPipe) a: number,
    @Param('b', ParseIntPipe) b: number,
  ): number {
    return a + b;
  }

  @Get('about')
  getAbout(): { name: string; description: string } {
    return {
      name: 'Alumni Istanbul',
      description:
        'A web platform that keeps Istanbul University and its graduates connected for life.',
    };
  }
}
