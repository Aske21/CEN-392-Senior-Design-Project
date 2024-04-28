import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Order } from "./order";
import { UserType } from "../../../enums/UserType";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  googleId: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({ type: "enum", enum: UserType, default: UserType.CUSTOMER })
  userType: UserType;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
