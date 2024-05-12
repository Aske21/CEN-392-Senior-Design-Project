import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { ProductInventory } from "./product_inventory";
import { ProductCategory } from "./product_category";
import { OrderDetails } from "./order_details";
import { ProductDiscount } from "./product_discount";

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

  @ManyToOne(
    () => ProductCategory,
    (product_category) => product_category.products
  )
  @JoinColumn({ name: "categoryId" })
  category: ProductCategory;

  @Column({ type: "simple-array", nullable: false })
  images: string[];

  @Column({ type: "jsonb", nullable: true })
  attributes: { [key: string]: string };

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;

  @OneToMany(() => OrderDetails, (orderDetail) => orderDetail.product)
  order_details: OrderDetails[];

  @ManyToOne(
    () => ProductInventory,
    (product_inventory) => product_inventory.products
  )
  @JoinColumn({ name: "inventory_id" })
  inventory_id: ProductInventory;

  @OneToMany(() => ProductDiscount, (discount) => discount.product)
  discounts: ProductDiscount[];
}
