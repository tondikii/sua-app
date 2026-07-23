import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GoogleAuthSchema, CompleteRegistrationSchema } from '@atur-perjalanan/shared-validation';
import type {
  GoogleAuthInput,
  CompleteRegistrationInput,
} from '@atur-perjalanan/shared-validation';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  googleLogin(@Body(new ZodValidationPipe(GoogleAuthSchema)) dto: GoogleAuthInput) {
    return this.authService.googleLogin(dto);
  }

  @Post('complete-registration')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  completeRegistration(
    @CurrentUser() user: CurrentUserPayload,
    @Body(new ZodValidationPipe(CompleteRegistrationSchema)) dto: CompleteRegistrationInput,
  ) {
    return this.authService.completeRegistration(user.userId, dto);
  }
}
