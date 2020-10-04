import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ingredient } from './ingredient.entity';
import { User } from 'src/auth/user.entity';

@Entity()
export class Recipe extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(
    type => Ingredient,
    (ingredient: Ingredient) => ingredient.recipe,
    { eager: true },
  )
  ingredients: Ingredient[];

  @ManyToOne(
    type => User,
    (user: User) => user.recipes,
  )
  user: User;

  @Column()
  userId: number;
}
