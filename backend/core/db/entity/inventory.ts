import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Product } from "./product";

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  location: string;

  @OneToMany(() => Product, (product) => product.inventory)
  products: Product[];

  @Column({ nullable: false, default: 0 })
  totalStockQuantity: number;
}
