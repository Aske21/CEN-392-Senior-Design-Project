import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ nullable: false })
  category: string;

  @Column({ nullable: false })
  brand: string;

  @Column({ type: "int", nullable: false })
  stockQuantity: number;

  @Column({ type: "simple-array", nullable: false })
  images: string[];

  @Column({ type: "jsonb", nullable: true })
  attributes: { [key: string]: string };

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
