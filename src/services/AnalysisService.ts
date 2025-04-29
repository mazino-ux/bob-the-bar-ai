import Bottle from '../models/Bottle';
import { AnalysisInputDTO } from '../types/bottle.types';
import axios from 'axios';
import { config } from '../config/env';
import { logger } from '../utils/logger';

export class AnalysisService {
    // ANALYZE COLLECTION AND IDENTIFY PATTERNS
    static async analyzeCollection(input: AnalysisInputDTO) {
        const { bottles } = input;
        
        // AGGREGATE DATA FROM ALL BOTTLES
        const allFlavors = bottles.flatMap(b => b.flavors);
        const allPrices = bottles.map(b => b.price || 0);
        const allRegions = bottles.map(b => b.region).filter(Boolean);
        const allSpiritTypes = bottles.map(b => b.spiritType).filter(Boolean);

        // CALCULATE STATISTICS
        const flavorFrequency = this.calculateFrequency(allFlavors);
        const priceStats = this.calculatePriceStats(allPrices);
        const regionFrequency = this.calculateFrequency(allRegions as string[]);
        const spiritTypeFrequency = this.calculateFrequency(allSpiritTypes as string[]);

        return {
            flavorProfile: flavorFrequency,
            priceRange: priceStats,
            preferredRegions: regionFrequency,
            preferredSpiritTypes: spiritTypeFrequency
        };
    }

    // GENERATE EMBEDDINGS USING DEEPSEEK API
    static async generateEmbeddings(flavors: string[]): Promise<number[]> {
        try {
            const response = await axios.post(
                config.DEEPSEEK_API_URL ?? '',
                { input: flavors.join(', ') },
                { headers: { Authorization: `Bearer ${config.DEEPSEEK_API_KEY}` } }
            );
            
            return response.data.data[0].embedding;
        } catch (error) {
            logger.error('EMBEDDING GENERATION ERROR:', error);
            throw new Error('FAILED TO GENERATE FLAVOR EMBEDDINGS');
        }
    }

    // PRIVATE HELPER METHODS
    private static calculateFrequency(items: string[]): Record<string, number> {
        return items.reduce((acc, item) => {
            acc[item] = (acc[item] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }

    private static calculatePriceStats(prices: number[]) {
        if (prices.length === 0) return { avg: 0, min: 0, max: 0 };
        
        const sum = prices.reduce((a, b) => a + b, 0);
        const avg = sum / prices.length;
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        
        return { avg, min, max };
    }
}