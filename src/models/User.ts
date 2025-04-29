import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// EXTEND DOCUMENT FOR MONGOOSE METHODS
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  favoriteBottles?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password: { 
      type: String, 
      required: true,
      minlength: 8,
      select: false 
    },
    favoriteBottles: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Bottle' 
    }]
  },
  { 
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// PRE-SAVE HOOK (NOW TYPE-SAFE)
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// PASSWORD COMPARISON METHOD
UserSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = model<IUser>('User', UserSchema);
export default User;