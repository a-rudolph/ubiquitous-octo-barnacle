import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity()
export class Ingredient extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  quantity: string;

  @ManyToOne(
    type => Recipe,
    (recipe: Recipe) => recipe.ingredients,
  )
  recipe: Recipe;

  @Column()
  recipeId: number;
}
