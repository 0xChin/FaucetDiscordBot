import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class RequestCooldown extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('timestamp')
    lastRequest: Date

    @Column('text')
    token: string

    @Column('text')
    network: string

    @Column('text')
    userId: string
}