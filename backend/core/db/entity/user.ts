import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Order } from "./order";
import { UserType } from "../../../enums/UserType";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  google_id: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({ type: "enum", enum: UserType, default: UserType.CUSTOMER })
  user_type: UserType;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
