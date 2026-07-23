import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import {
  CheckUsernameSchema,
  SearchUsersSchema,
  UpdateUserSchema,
} from '@atur-perjalanan/shared-validation';
import type { CheckUsernameInput, UpdateUserInput } from '@atur-perjalanan/shared-validation';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /v1/users/check-username?username=xxx  — Public
  @Get('check-username')
  checkUsername(@Query(new ZodValidationPipe(CheckUsernameSchema)) query: CheckUsernameInput) {
    return this.usersService.checkUsername(query.username);
  }

  // GET /v1/users/search?q=xxx  — JWT required
  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  searchUsers(@Query(new ZodValidationPipe(SearchUsersSchema)) query: any) {
    return this.usersService.searchUsers(query.q, query.cursor, query.limit);
  }

  // GET /v1/users/me
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getMe(@CurrentUser() user: CurrentUserPayload) {
    return this.usersService.getMe(user.userId);
  }

  // PUT /v1/users/me
  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateMe(
    @CurrentUser() user: CurrentUserPayload,
    @Body(new ZodValidationPipe(UpdateUserSchema)) dto: UpdateUserInput,
  ) {
    return this.usersService.updateMe(user.userId, dto);
  }

  // DELETE /v1/users/me
  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteMe(@CurrentUser() user: CurrentUserPayload) {
    return this.usersService.deleteMe(user.userId);
  }

  // GET /v1/users/:username  — optional auth
  @Get(':username')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getProfile(@Param('username') username: string, @CurrentUser() user: CurrentUserPayload) {
    return this.usersService.getPublicProfile(username, user?.userId);
  }

  // GET /v1/users/:username/trips  — optional auth
  @Get(':username/trips')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getUserTrips(
    @Param('username') username: string,
    @CurrentUser() user: CurrentUserPayload,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
  ) {
    return this.usersService.getUserTrips(username, user?.userId, cursor, limit);
  }
}
