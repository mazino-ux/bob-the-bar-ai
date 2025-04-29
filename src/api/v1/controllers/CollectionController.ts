import { Request, Response } from 'express';
import { AnalysisInputDTO } from '../../../types/bottle.types';
import { AnalysisService } from '../../../services/AnalysisService';
import { RecommendationService } from '../../../services/RecommendationService';
import { successResponse, errorResponse } from '../../../utils/apiResponse';
import { logger } from '../../../utils/logger';

export class CollectionController {
    // ANALYZE USER'S COLLECTION
    static async analyzeCollection(req: Request, res: Response) {
        try {
            const input: AnalysisInputDTO = req.body;
            
            // VALIDATE INPUT
            if (!input.bottles || input.bottles.length === 0) {
                return errorResponse(res, 'NO BOTTLES PROVIDED FOR ANALYSIS', 400);
            }

            const analysis = await AnalysisService.analyzeCollection(input);
            successResponse(res, analysis, 'COLLECTION ANALYZED SUCCESSFULLY');
        } catch (error) {
            logger.error('ANALYZE COLLECTION ERROR:', error);
            errorResponse(res, 'INTERNAL SERVER ERROR', 500, error);
        }
    }

    // GET RECOMMENDATIONS
    static async getRecommendations(req: Request, res: Response) {
        try {
            const input: AnalysisInputDTO = req.body;
            
            // VALIDATE INPUT
            if (!input.bottles || input.bottles.length === 0) {
                return errorResponse(res, 'NO BOTTLES PROVIDED FOR RECOMMENDATIONS', 400);
            }

            const recommendations = await RecommendationService.getRecommendations(input);
            successResponse(res, { recommendations }, 'RECOMMENDATIONS GENERATED SUCCESSFULLY');
        } catch (error) {
            logger.error('GET RECOMMENDATIONS ERROR:', error);
            errorResponse(res, 'INTERNAL SERVER ERROR', 500, error);
        }
    }
}