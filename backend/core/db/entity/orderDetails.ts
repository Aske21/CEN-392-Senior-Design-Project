// OrderDetail entity
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./order";
import { Product } from "./product";

@Entity()
export class OrderDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderDetails)
  product: Product;

  @Column()
  quantity: number;
}
