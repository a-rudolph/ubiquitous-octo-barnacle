import { PipeTransform, BadRequestException } from '@nestjs/common';
import { CreateRecipeDto } from '../dto/create-recipe.dto';

export class CreateRecipeValidationPipe implements PipeTransform {
  transform(value: any): CreateRecipeDto {
    const { ingredients } = value;

    if (!this.isIngredientsValid(ingredients)) {
      throw new BadRequestException(
        `Ingredients is in bad format: ${JSON.stringify(ingredients)}`,
      );
    }

    return value;
  }

  isIngredientsValid(ingredients: any): boolean {
    let isValid = true;
    if (ingredients instanceof Array) {
      ingredients.map(ingredient => {
        isValid = isValid && ingredient.quantity && ingredient.name;
      });
    } else {
      return false;
    }
    return isValid;
  }
}
