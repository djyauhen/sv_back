import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsNotEmpty, Min} from "class-validator";

@Entity('articles')
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text',{nullable: false})
    @IsNotEmpty()
    title: string;

    @Column('text', {nullable: false})
    @IsNotEmpty()
    preface: string;

    @Column('text', {nullable: false})
    @IsNotEmpty()
    text: string;

    @Column({nullable: true})
    image: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    date: Date;

    @Column({nullable: false})
    @IsNotEmpty()
    @Min(1)
    duration: number;
}
