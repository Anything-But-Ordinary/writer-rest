import { ModelOptions, prop, getModelForClass } from '@typegoose/typegoose';

@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class User {
  @prop()
  username: string;

  @prop({ unique: true })
  email: string;

  @prop({
    select: false,
    required: true,
  })
  password!: string;
}
