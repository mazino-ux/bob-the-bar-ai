import { Request, Response } from 'express';
import Bottle from '../../../models/Bottle';
import { BottleInputDTO } from '../../../types/bottle.types';
import { successResponse, errorResponse } from '../../../utils/apiResponse';
import { logger } from '../../../utils/logger';
import { AnalysisService } from '../../../services/AnalysisService';

export class BottleController {
    // CREATE A NEW BOTTLE
    static async createBottle(req: Request, res: Response) {
        try {
            const input: BottleInputDTO = req.body;
            
            // VALIDATE INPUT
            if (!input.name || !input.spiritType || !input.price || !input.flavors) {
                return errorResponse(res, 'MISSING REQUIRED FIELDS', 400);
            }

            // GENERATE EMBEDDINGS FOR AI ANALYSIS
            const embedding = await AnalysisService.generateEmbeddings(input.flavors);
            const bottle = await Bottle.create({ ...input, embedding });

            successResponse(res, bottle, 'BOTTLE CREATED SUCCESSFULLY', 201);
        } catch (error) {
            logger.error('CREATE BOTTLE ERROR:', error);
            errorResponse(res, 'INTERNAL SERVER ERROR', 500, error);
        }
    }

    // GET ALL BOTTLES
    static async getAllBottles(req: Request, res: Response) {
        try {
            const bottles = await Bottle.find().select('-embedding');
            successResponse(res, bottles, 'BOTTLES FETCHED SUCCESSFULLY');
        } catch (error) {
            logger.error('GET BOTTLES ERROR:', error);
            errorResponse(res, 'INTERNAL SERVER ERROR', 500, error);
        }
    }

    // GET BOTTLE BY ID
    static async getBottleById(req: Request, res: Response) {
        try {
            const bottle = await Bottle.findById(req.params.id).select('-embedding');
            if (!bottle) return errorResponse(res, 'BOTTLE NOT FOUND', 404);
            
            successResponse(res, bottle, 'BOTTLE FETCHED SUCCESSFULLY');
        } catch (error) {
            logger.error('GET BOTTLE ERROR:', error);
            errorResponse(res, 'INTERNAL SERVER ERROR', 500, error);
        }
    }
}