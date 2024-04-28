import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OrderDetails } from "./orderDetails";
import { User } from "./user";
import { OrderStatus } from "../../../enums/OrderStatus";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column()
  orderDate: Date;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ nullable: false })
  shippingAddress: string;

  @Column({ nullable: false, default: OrderStatus.Pending })
  status: OrderStatus;

  @OneToMany(() => OrderDetails, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetails[];
}
