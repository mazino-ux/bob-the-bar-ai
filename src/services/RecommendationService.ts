import Bottle from '../models/Bottle';
import { AnalysisInputDTO, RecommendationDTO, SpiritType } from '../types/bottle.types';
import { AnalysisService } from './AnalysisService';
import { logger } from '../utils/logger';
import { config } from '../config/env';

export class RecommendationService {
    // GET RECOMMENDATIONS BASED ON USER'S COLLECTION
    static async getRecommendations(input: AnalysisInputDTO): Promise<RecommendationDTO[]> {
        const { bottles } = input;
        
        // GET COLLECTION ANALYSIS
        const analysis = await AnalysisService.analyzeCollection(input);
        
        // GET ALL BOTTLES FROM DB
        const allBottles = await Bottle.find({});
        
        // GENERATE RECOMMENDATIONS
        const recommendations: RecommendationDTO[] = [];
        
        // 1. SIMILAR FLAVOR PROFILE RECOMMENDATIONS
        const similarFlavorRecs = await this.getSimilarFlavorRecommendations(
            analysis.flavorProfile, 
            allBottles,
            bottles.map(b => b.flavors).flat()
        );
        recommendations.push(...similarFlavorRecs);
        
        // 2. PRICE RANGE RECOMMENDATIONS
        const priceRangeRecs = await this.getPriceRangeRecommendations(
            analysis.priceRange,
            allBottles
        );
        recommendations.push(...priceRangeRecs);
        
        // 3. DIVERSIFYING RECOMMENDATIONS
        const diversifyingRecs = await this.getDiversifyingRecommendations(
            analysis,
            allBottles
        );
        recommendations.push(...diversifyingRecs);
        
        // DEDUPLICATE AND SORT BY SCORE
        return this.deduplicateAndSort(recommendations);
    }

    // PRIVATE HELPER METHODS
    private static async getSimilarFlavorRecommendations(
        flavorProfile: Record<string, number>,
        allBottles: any[],
        existingFlavors: string[]
    ): Promise<RecommendationDTO[]> {
        const topFlavors = Object.entries(flavorProfile)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([flavor]) => flavor);
            
        return allBottles
            .filter(bottle => {
                const hasTopFlavor = bottle.flavors.some((f: string) => topFlavors.includes(f));
                const similarityScore = this.calculateFlavorSimilarity(bottle.flavors, existingFlavors);
                return hasTopFlavor && similarityScore < Number(config.SIMILARITY_THRESHOLD);
            })
            .map(bottle => ({
                bottleId: bottle._id.toString(),
                name: bottle.name,
                spiritType: bottle.spiritType,
                region: bottle.region,
                price: bottle.price,
                score: 0.7 + Math.random() * 0.2, // SIMULATED SCORE
                matchType: 'SIMILAR',
                matchDetails: [`MATCHES YOUR TOP FLAVORS: ${topFlavors.join(', ')}`]
            }));
    }

    private static async getPriceRangeRecommendations(
        priceRange: { avg: number; min: number; max: number },
        allBottles: any[]
    ): Promise<RecommendationDTO[]> {
        const lowerBound = priceRange.min * 0.9;
        const upperBound = priceRange.max * 1.1;
        
        return allBottles
            .filter(bottle => bottle.price >= lowerBound && bottle.price <= upperBound)
            .map(bottle => ({
                bottleId: bottle._id.toString(),
                name: bottle.name,
                spiritType: bottle.spiritType,
                region: bottle.region,
                price: bottle.price,
                score: 0.6 + Math.random() * 0.2,
                matchType: 'PRICE_RANGE',
                matchDetails: [`FITS YOUR PREFERRED PRICE RANGE ($${lowerBound.toFixed(2)}-$${upperBound.toFixed(2)})`]
            }));
    }

    private static async getDiversifyingRecommendations(
        analysis: any,
        allBottles: any[]
    ): Promise<RecommendationDTO[]> {
        const allSpiritTypes = Object.keys(analysis.preferredSpiritTypes || {});
        const otherSpiritTypes = Object.values(SpiritType).filter(
            (st) => !allSpiritTypes.includes(st)
        ) as SpiritType[];
        
        if (otherSpiritTypes.length === 0) return [];
        
        return allBottles
            .filter(bottle => otherSpiritTypes.includes(bottle.spiritType))
            .map(bottle => ({
                bottleId: bottle._id.toString(),
                name: bottle.name,
                spiritType: bottle.spiritType,
                region: bottle.region,
                price: bottle.price,
                score: 0.5 + Math.random() * 0.2,
                matchType: 'COMPLEMENTARY',
                matchDetails: [`DIVERSIFIES YOUR COLLECTION WITH ${bottle.spiritType}`]
            }));
    }

    private static calculateFlavorSimilarity(flavors1: string[], flavors2: string[]): number {
        const set1 = new Set(flavors1);
        const set2 = new Set(flavors2);
        const intersection = new Set([...set1].filter(f => set2.has(f)));
        return intersection.size / Math.max(set1.size, set2.size);
    }

    private static deduplicateAndSort(recommendations: RecommendationDTO[]): RecommendationDTO[] {
        const unique = new Map<string, RecommendationDTO>();
        
        recommendations.forEach(rec => {
            if (!unique.has(rec.bottleId) || (unique.get(rec.bottleId)!.score < rec.score)) {
                unique.set(rec.bottleId, rec);
            }
        });
        
        return Array.from(unique.values()).sort((a, b) => b.score - a.score);
    }
}