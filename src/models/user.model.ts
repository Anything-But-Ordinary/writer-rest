import { ModelOptions, prop } from '@typegoose/typegoose';

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

  @prop()
  password: string;
}
