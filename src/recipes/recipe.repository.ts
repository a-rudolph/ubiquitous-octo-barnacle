import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { Recipe } from './recipe.entity';

@EntityRepository(Recipe)
export class RecipeRepository extends Repository<Recipe> {
  private logger = new Logger('RecipeRepository');

  async getRecipes(user: User): Promise<Recipe[]> {
    const query = this.createQueryBuilder('recipe');

    query.where('recipe.userId = :userId', { userId: user.id });

    try {
      const recipes = await query.getMany();
      return recipes;
    } catch (error) {
      this.logger.error(`Failed to get recipes for user "${user.username}"`);
      throw new InternalServerErrorException();
    }
  }

  async createRecipe(
    createRecipeDto: CreateRecipeDto,
    user: User,
  ): Promise<Recipe> {
    const { title } = createRecipeDto;

    const recipe = new Recipe();
    recipe.title = title;
    recipe.user = user;

    try {
      await recipe.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }

    delete recipe.user;

    return recipe;
  }
}
