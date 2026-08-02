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
import { IsIn, IsString } from 'class-validator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { PushTokensService } from './push-tokens.service';

class RegisterPushTokenDto {
  @IsString()
  token: string;

  @IsIn(['ios', 'android'])
  platform: 'ios' | 'android';
}

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
    @Body() dto: RegisterPushTokenDto,
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
