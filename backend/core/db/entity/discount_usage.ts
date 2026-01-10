import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Users } from "./user";
import { ProductDiscount } from "./product_discount";

@Entity()
@Unique(["user", "discount"])
export class DiscountUsage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, { nullable: false })
  user: Users;

  @ManyToOne(() => ProductDiscount, { nullable: false })
  discount: ProductDiscount;

  @Column({ nullable: false, default: 0 })
  times_used: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
