import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { Ingredient } from './ingredient.entity';
import { Recipe } from './recipe.entity';

@EntityRepository(Ingredient)
export class IngredientRepository extends Repository<Ingredient> {
  private logger = new Logger('IngredientRepository');
  async createIngredients(
    ingredients: CreateIngredientDto[],
    recipe: Recipe,
  ): Promise<Ingredient[]> {
    return Promise.all(
      ingredients.map(createIngredientDto =>
        this.createIngredient(createIngredientDto, recipe),
      ),
    );
  }

  async createIngredient(
    createIngredientDto: CreateIngredientDto,
    recipe: Recipe,
  ): Promise<Ingredient> {
    const { name, quantity } = createIngredientDto;

    const ingredient = new Ingredient();
    ingredient.name = name;
    ingredient.quantity = quantity;
    ingredient.recipe = recipe;

    try {
      await ingredient.save();
    } catch (error) {
      this.logger.error(
        `Error adding ingredient, DTO: ${JSON.stringify(createIngredientDto)}`,
      );
      throw new InternalServerErrorException();
    }

    delete ingredient.recipe;

    return ingredient;
  }
}
