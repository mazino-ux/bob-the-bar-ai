// ENUM FOR SPIRIT TYPES - COVERS ALL MAJOR CATEGORIES
export enum SpiritType {
    WHISKY = 'WHISKY',
    GIN = 'GIN',
    RUM = 'RUM',
    TEQUILA = 'TEQUILA',
    VODKA = 'VODKA',
    BRANDY = 'BRANDY',
    COGNAC = 'COGNAC',
    MEZCAL = 'MEZCAL',
    LIQUEUR = 'LIQUEUR',
    OTHER = 'OTHER'
  }
  
  // ENUM FOR COMMON FLAVOR PROFILES
  export enum FlavorProfile {
    PEATY = 'PEATY',
    SMOKY = 'SMOKY',
    FRUITY = 'FRUITY',
    SPICY = 'SPICY',
    HERBAL = 'HERBAL',
    FLORAL = 'FLORAL',
    CITRUS = 'CITRUS',
    SWEET = 'SWEET',
    DRY = 'DRY',
    OAKY = 'OAKY',
    VANILLA = 'VANILLA',
    CARAMEL = 'CARAMEL',
    NUTTY = 'NUTTY',
    CHOCOLATE = 'CHOCOLATE'
  }
  
  // ENUM FOR REGIONS (FOCUS ON WHISKY BUT EXTENDABLE)
  export enum Region {
    ISLAY = 'ISLAY',
    SPEYSIDE = 'SPEYSIDE',
    HIGHLAND = 'HIGHLAND',
    LOWLAND = 'LOWLAND',
    CAMPBELTOWN = 'CAMPBELTOWN',
    BOURBON = 'BOURBON',
    RYE = 'RYE',
    JAMAICA = 'JAMAICA',
    BARBADOS = 'BARBADOS',
    MEXICO = 'MEXICO',
    LONDON = 'LONDON',
    SCANDINAVIA = 'SCANDINAVIA',
    OTHER = 'OTHER'
  }
  
  // MAIN BOTTLE INTERFACE - CORE DATA STRUCTURE
  export interface IBottle {
    name: string;
    spiritType: SpiritType;
    region?: Region;
    price: number;
    flavors: FlavorProfile[];
    ageStatement?: number; // IN YEARS
    abv?: number; // ALCOHOL BY VOLUME
    description?: string;
    imageUrl?: string;
    embedding?: number[]; // FOR AI VECTOR SEARCH
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  // INPUT DTO FOR CREATING/UPDATING BOTTLES
  export interface BottleInputDTO {
    name: string;
    spiritType: SpiritType;
    region?: Region;
    price: number;
    flavors: FlavorProfile[];
    ageStatement?: number;
    abv?: number;
    description?: string;
    imageUrl?: string;
  }
  
  // ANALYSIS INPUT FOR COLLECTION ANALYSIS
  export interface AnalysisInputDTO {
    bottles: Array<{
      spiritType: SpiritType;
      region?: Region;
      price: number;
      flavors: FlavorProfile[];
      ageStatement?: number;
    }>;
  }
  
  // ANALYSIS RESULT WITH PATTERN IDENTIFICATION
  export interface AnalysisResultDTO {
    flavorProfile: Record<FlavorProfile, number>; // FREQUENCY COUNT
    priceRange: {
      min: number;
      max: number;
      average: number;
    };
    preferredRegions: Record<Region, number>;
    preferredSpiritTypes: Record<SpiritType, number>;
    averageAge?: number;
  }
  
  // RECOMMENDATION OUTPUT WITH SCORING
  export interface RecommendationDTO {
    bottleId: string;
    name: string;
    spiritType: SpiritType;
    region?: Region;
    price: number;
    score: number; // 0-1 CONFIDENCE SCORE
    matchType: 'SIMILAR' | 'COMPLEMENTARY' | 'PRICE_RANGE';
    matchDetails: string[];
  }
  
  // API RESPONSE STRUCTURES FOR CONSISTENCY
  export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
  }
  
  // ERROR RESPONSE STRUCTURE
  export interface ErrorResponse {
    statusCode: number;
    message: string;
    error?: string;
    timestamp: string;
    path?: string;
  }