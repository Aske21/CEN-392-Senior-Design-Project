import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Inventory } from "./inventory";
import { Category } from "./category";
import { OrderDetails } from "./orderDetails";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  price: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @Column({ type: "simple-array", nullable: false })
  images: string[];

  @Column({ type: "jsonb", nullable: true })
  attributes: { [key: string]: string };

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @OneToMany(() => OrderDetails, (orderDetail) => orderDetail.product)
  orderDetails: OrderDetails[];

  @ManyToOne(() => Inventory, (inventory) => inventory.products)
  @JoinColumn({ name: "inventoryId" })
  inventory: Inventory;
}
