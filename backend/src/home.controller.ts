import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Response } from 'express';

@Controller()
@ApiExcludeController()
export class HomeController {
  @Get()
  renderHome(@Res() response: Response): void {
    response.render('home/index');
  }

  @Get('dashboard')
  renderDashboard(@Res() response: Response): void {
    response.render('home/index');
  }
}
