import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { errorResponse } from '../utils/apiResponse';

/**
 * VALIDATE REQUEST MIDDLEWARE
 * Uses Zod schemas to validate request body
 */
export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      errorResponse(res, 'Validation failed', 400, error);
    }
  };
};

import { z } from 'zod';
import { SpiritType, FlavorProfile, Region } from '../types/bottle.types';

/**
 * BOTTLE VALIDATION SCHEMAS
 */
export const createBottleSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    spiritType: z.nativeEnum(SpiritType),
    region: z.nativeEnum(Region).optional(),
    price: z.number().min(0),
    flavors: z.array(z.nativeEnum(FlavorProfile)).min(1),
    ageStatement: z.number().min(0).optional(),
    abv: z.number().min(0).max(100).optional(),
    description: z.string().max(500).optional(),
    imageUrl: z.string().url().optional()
  })
});

export const analyzeCollectionSchema = z.object({
  body: z.object({
    bottles: z.array(
      z.object({
        spiritType: z.nativeEnum(SpiritType),
        region: z.nativeEnum(Region).optional(),
        price: z.number().min(0),
        flavors: z.array(z.nativeEnum(FlavorProfile)).min(1),
        ageStatement: z.number().min(0).optional()
      })
    ).min(1)
  })
});