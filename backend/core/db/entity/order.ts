import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm";
import { OrderStatus } from "../../../enums/OrderStatus";
import { OrderDetails } from "./order_details";
import { Users } from "./user";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  paymentId: string;

  @ManyToOne(() => Users, (user) => user.orders)
  @JoinColumn({ name: "userId" })
  user: Users;

  @Column()
  orderDate: Date;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  discountAmount: number;

  @Column({ nullable: true })
  discountCode: string;

  @Column({ nullable: false })
  shippingAddress: string;

  @Column({ nullable: false, default: OrderStatus.Paid })
  status: OrderStatus;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @OneToMany(() => OrderDetails, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetails[];
}
