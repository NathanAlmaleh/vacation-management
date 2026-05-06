import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class VacationRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeName: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  reason: string;

  @Column({ default: "pending" })
  status: string;
}