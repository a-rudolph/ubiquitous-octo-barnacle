import { IsNotEmpty } from 'class-validator';
import { CreateIngredientDto } from './create-ingredient.dto';

export class CreateRecipeDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  ingredients: CreateIngredientDto[];
}
