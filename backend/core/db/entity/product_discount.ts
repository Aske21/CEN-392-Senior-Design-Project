import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product";

@Entity()
export class ProductDiscount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  code: string;

  @Column({ nullable: false, default: true })
  active: boolean;

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: false })
  discount_percentage: number;

  @Column({ type: "timestamp", nullable: true })
  start_date: Date;

  @Column({ type: "timestamp", nullable: true })
  end_date: Date;

  @Column({ nullable: false, default: false })
  for_new_users_only: boolean;

  @Column({ nullable: false, default: 1 })
  max_uses_per_user: number;

  @Column({ nullable: true })
  max_total_uses: number;

  @Column({ nullable: false, default: 0 })
  current_total_uses: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;

  @ManyToOne(() => Product, (product) => product.discounts, { nullable: true })
  product: Product;
}
