import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Order } from "./order";
import { Product } from "./product";

@Entity({ name: "order_details" })
export class OrderDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  order: Order;

  @OneToMany(() => Product, (product) => product.order_details)
  products: Product[];

  @Column()
  quantity: number;
}
