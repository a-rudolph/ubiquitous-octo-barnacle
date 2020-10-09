import { Injectable, NotFoundException } from '@nestjs/common';
import { Recipe } from './recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeRepository } from './recipe.repository';
import { User } from 'src/auth/user.entity';
import { IngredientRepository } from './ingredient.repository';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(RecipeRepository)
    private recipeRepository: RecipeRepository,
    @InjectRepository(IngredientRepository)
    private ingredientRepository: IngredientRepository,
  ) {}

  async getRecipes(user: User): Promise<Recipe[]> {
    return this.recipeRepository.getRecipes(user);
  }

  async getRecipeById(id: number, user: User) {
    const found = await this.recipeRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!found) {
      throw new NotFoundException(`Recipe with ID: ${id} not found`);
    }

    return found;
  }

  async createRecipe(
    createRecipeDto: CreateRecipeDto,
    user: User,
  ): Promise<Recipe> {
    const { ingredients } = createRecipeDto;

    const recipe = await this.recipeRepository.createRecipe(
      createRecipeDto,
      user,
    );

    recipe.ingredients = await this.ingredientRepository.createIngredients(
      ingredients,
      recipe,
    );

    return recipe;
  }

  async deleteRecipe(id: number, user: User): Promise<void> {
    const found = await this.getRecipeById(id, user);
    try {
      await Promise.all(
        found.ingredients.map(ingredient => {
          const { id } = ingredient;
          this.ingredientRepository.delete({ id, recipeId: found.id });
        }),
      );

      await this.recipeRepository.delete({
        id,
        userId: user.id,
      });
    } catch (error) {
      throw error;
    }
  }
}
