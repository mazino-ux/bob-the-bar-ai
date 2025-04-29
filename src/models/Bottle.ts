import mongoose, { Schema, model } from 'mongoose';
import { IBottle, SpiritType, FlavorProfile, Region } from '../types/bottle.types';

// MONGOOSE SCHEMA DEFINITION WITH STRICT TYPING
const BottleSchema = new Schema<IBottle>(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true,
      index: true 
    },
    spiritType: { 
      type: String, 
      required: true, 
      enum: Object.values(SpiritType) 
    },
    region: { 
      type: String, 
      enum: Object.values(Region) 
    },
    price: { 
      type: Number, 
      required: true,
      min: 0 
    },
    flavors: { 
      type: [String], 
      required: true,
      enum: Object.values(FlavorProfile) 
    },
    ageStatement: { 
      type: Number, 
      min: 0 
    },
    abv: { 
      type: Number, 
      min: 0, 
      max: 100 
    },
    description: { 
      type: String, 
      maxlength: 1000 
    },
    imageUrl: { 
      type: String, 
      validate: {
        validator: (v: string) => {
          return /https?:\/\/.+\.(jpg|jpeg|png|webp)/.test(v);
        },
        message: 'Invalid image URL format'
      }
    },
    embedding: { 
      type: [Number], 
      select: false // HIDE IN DEFAULT QUERIES
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v; // REMOVE MONGOOSE VERSION KEY
        return ret;
      }
    }
  }
);

// INDEXES FOR PERFORMANT QUERIES
BottleSchema.index({ flavors: 1 });
BottleSchema.index({ spiritType: 1, region: 1 });
BottleSchema.index({ price: 1 });
BottleSchema.index({ name: 'text', description: 'text' });

// COMPOUND INDEX FOR COMMON QUERY PATTERNS
BottleSchema.index({ 
  spiritType: 1, 
  region: 1, 
  price: 1 
});

// MODEL STATICS FOR TYPE-SAFE QUERIES
interface BottleModel extends mongoose.Model<IBottle> {
  findByFlavorProfile(flavors: FlavorProfile[]): Promise<IBottle[]>;
  findBySpiritType(type: SpiritType): Promise<IBottle[]>;
}

// IMPLEMENT STATIC METHODS
BottleSchema.statics.findByFlavorProfile = function(flavors: FlavorProfile[]) {
  return this.find({ flavors: { $in: flavors } });
};

BottleSchema.statics.findBySpiritType = function(type: SpiritType) {
  return this.find({ spiritType: type });
};

// CREATE AND EXPORT MODEL
const Bottle = model<IBottle, BottleModel>('Bottle', BottleSchema);
export default Bottle;