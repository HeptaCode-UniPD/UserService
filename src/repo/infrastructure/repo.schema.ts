import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RepoDocument = RepoPersistence & Document;

@Schema({collection: 'users', timestamps: true, versionKey: false})
export class RepoPersistence {
    @Prop({required: true, unique:true})
    _id!: string;

    @Prop({required: true})
    idUtente!: string[];

    @Prop({required: true, unique: true})
    url!: string;

    @Prop({required: false, unique: true})
    pathStorage!: string;
}

export const RepoSchema = SchemaFactory.createForClass(RepoPersistence);