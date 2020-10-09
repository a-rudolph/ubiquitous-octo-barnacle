import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { CreateRecipeValidationPipe } from './pipes/create-recipe-validation.pipe';
import { Recipe } from './recipe.entity';
import { RecipesService } from './recipes.service';

@Controller('recipes')
@UseGuards(AuthGuard())
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Get()
  getRecipes(@GetUser() user: User): Promise<Recipe[]> {
    return this.recipesService.getRecipes(user);
  }

  @Get('/:id')
  getRecipesById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Recipe> {
    return this.recipesService.getRecipeById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createRecipe(
    @Body(CreateRecipeValidationPipe) createRecipeDto: CreateRecipeDto,
    @GetUser() user: User,
  ): Promise<Recipe> {
    return this.recipesService.createRecipe(createRecipeDto, user);
  }

  @Delete('/:id')
  deleteRecipe(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.recipesService.deleteRecipe(id, user);
  }
}
