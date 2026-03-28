import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = UserPersistence & Document;

@Schema({collection: 'users', timestamps: true, versionKey: false})
export class UserPersistence extends Document{
    // @Prop({required: true, unique:true})
    // _id!: string;

    @Prop({required: true, unique: true})
    nome!: string;

    @Prop({required: true, unique: true})
    cognome!: string;

    @Prop({required: true, unique: true})
    email!: string;

    @Prop({required: true, select: false})
    passwordHash!: string;
}

export const UserSchema = SchemaFactory.createForClass(UserPersistence);