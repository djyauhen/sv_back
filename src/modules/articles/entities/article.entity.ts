import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('articles')
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    preface: string;

    @Column('text')
    text: string;

    @Column({ nullable: true })
    image: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @Column()
    duration: number;
}
