import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({collection: 'users', timestamps: true, versionKey: false})
export class UserPersistence extends Document{

    @Prop({ required: true })
    nome!: string;

    @Prop({ required: true })
    cognome!: string;

    @Prop({ required: true, unique: true })
    email!: string;

    @Prop({ required: true, select: false })
    passwordHash!: string;
}

export type UserDocument = UserPersistence & Document;
export const UserSchema = SchemaFactory.createForClass(UserPersistence);