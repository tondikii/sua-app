import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterPushTokenSchema } from '@atur-perjalanan/shared-validation';
import type { RegisterPushTokenInput } from '@atur-perjalanan/shared-validation';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { PushTokensService } from './push-tokens.service';

@ApiTags('push-tokens')
@ApiBearerAuth()
@Controller('push-tokens')
@UseGuards(JwtAuthGuard)
export class PushTokensController {
  constructor(private readonly pushTokensService: PushTokensService) {}

  // POST /v1/push-tokens
  @Post()
  register(
    @CurrentUser() user: CurrentUserPayload,
    @Body(new ZodValidationPipe(RegisterPushTokenSchema)) dto: RegisterPushTokenInput,
  ) {
    return this.pushTokensService.register(user.userId, dto);
  }

  // DELETE /v1/push-tokens/:token
  @Delete(':token')
  @HttpCode(HttpStatus.NO_CONTENT)
  unregister(@CurrentUser() user: CurrentUserPayload, @Param('token') token: string) {
    return this.pushTokensService.unregister(user.userId, token);
  }
}
