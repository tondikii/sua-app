import {
  Controller,
  Get,
  Post,
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
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto, UpdateWishlistDto, ConvertToTripDto } from './dto';

@ApiTags('wishlists')
@ApiBearerAuth()
@Controller('wishlists')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  // POST /v1/wishlists
  @Post()
  createWishlist(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateWishlistDto) {
    return this.wishlistService.createWishlist(user.userId, dto);
  }

  // GET /v1/wishlists?priority=&tag=&cursor=&limit=
  @Get()
  listWishlists(
    @CurrentUser() user: CurrentUserPayload,
    @Query('priority') priority?: string,
    @Query('tag') tag?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.wishlistService.listWishlists(user.userId, {
      priority,
      tag,
      cursor,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  // GET /v1/wishlists/tags
  @Get('tags')
  getWishlistTags(@CurrentUser() user: CurrentUserPayload) {
    return this.wishlistService.getWishlistTags(user.userId);
  }

  // PUT /v1/wishlists/:id
  @Put(':id')
  updateWishlist(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateWishlistDto,
  ) {
    return this.wishlistService.updateWishlist(id, user.userId, dto);
  }

  // DELETE /v1/wishlists/:id  (soft delete, owner only)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteWishlist(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.wishlistService.deleteWishlist(id, user.userId);
  }

  // POST /v1/wishlists/:id/convert-to-trip
  @Post(':id/convert-to-trip')
  convertToTrip(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: ConvertToTripDto,
  ) {
    return this.wishlistService.convertToTrip(id, user.userId, dto);
  }
}