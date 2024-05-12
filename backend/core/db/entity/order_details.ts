import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order";
import { Product } from "./product";

@Entity({ name: "order_details" })
export class OrderDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  order: Order;

  @ManyToOne(() => Product, (product) => product.order_details)
  product: Product;

  @Column()
  quantity: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}
