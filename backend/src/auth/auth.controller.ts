import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { CompleteRegistrationDto } from './dto/complete-registration.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  googleLogin(@Body() dto: GoogleAuthDto) {
    return this.authService.googleLogin(dto);
  }

  @Post('complete-registration')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  completeRegistration(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CompleteRegistrationDto,
  ) {
    return this.authService.completeRegistration(user.userId, dto);
  }
}
