import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
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
  user: Users;

  @Column()
  orderDate: Date;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ nullable: false })
  shippingAddress: string;

  @Column({ nullable: false, default: OrderStatus.Pending })
  status: OrderStatus;

  @OneToOne(() => OrderDetails, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetails[];
}
