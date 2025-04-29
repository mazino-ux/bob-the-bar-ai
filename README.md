# **Bob the Bar AI - Project Documentation**  
**Version 1.0**  
**Last Updated**: 29-04-2025  

---

## **Table of Contents**  
1. [Project Overview](#project-overview)  
2. [Key Features](#key-features)  
3. [Technical Architecture](#technical-architecture)  
4. [API Documentation](#api-documentation)  
5. [Database Schema](#database-schema)  
6. [AI Integration](#ai-integration)  
7. [Setup & Deployment](#setup--deployment)  
8. [Testing](#testing)  
9. [Future Roadmap](#future-roadmap)  
10. [Contributing](#contributing)  

---

## **1. Project Overview** 🥃  
**Bob the Bar AI** is an intelligent recommendation engine that helps users analyze their liquor collections and suggests new bottles based on their preferences.  

### **Goals**  
✅ **Analyze** existing bar collections (flavors, regions, price points).  
✅ **Recommend** new bottles matching user preferences.  
✅ **Diversify** selections with complementary options.  

### **Target Users**  
- Home bartenders  
- Whisky/wine collectors  
- Bar managers optimizing inventory  

---

## **2. Key Features** ✨  

### **A. Collection Analysis**  
- Parses user’s bar inventory.  
- Identifies patterns:  
  - Preferred regions (e.g., Islay, Speyside).  
  - Flavor profiles (e.g., peaty, fruity).  
  - Price range tendencies.  

### **B. Recommendation Engine**  
- **Similar Bottles**: Matches flavors/styles from existing collection.  
- **Budget-Friendly Picks**: Suggests options within preferred price ranges.  
- **Diversifiers**: Recommends unique bottles to expand taste horizons.  

### **C. AI-Powered Insights**  
- Uses **DeepSeek API** for flavor vector analysis.  
- Hybrid approach: Combines MongoDB queries + machine learning.  

---

## **3. Technical Architecture** 🛠️  

### **Backend Stack**  
- **Runtime**: Node.js (v18+)  
- **Framework**: Express.js + TypeScript  
- **Database**: MongoDB (Atlas or local)  
- **AI/ML**: DeepSeek API (flavor embeddings)  

### **Folder Structure**  
```bash
src/
├── config/          # DB/API configurations
├── controllers/     # Route handlers
├── models/          # MongoDB schemas
├── routes/          # Express routers
├── services/        # Business logic (AI, recommendations)
├── utils/           # Helpers (logging, validation)
├── app.ts           # Express setup
└── index.ts         # Entry point
```

### **Workflow**  
1. User submits collection → **MongoDB stores data**.  
2. **AI service** analyzes flavors → generates embeddings.  
3. **Recommendation engine** queries DB + applies scoring.  
4. API returns ranked suggestions.  

---

## **4. API Documentation** 📡  

### **Base URL**  
`http://localhost:5000/api`  

### **Endpoints**  

| Endpoint | Method | Description | Request Body |  
|----------|--------|-------------|--------------|  
| `/bottles` | `POST` | Add new bottle | `{ name, spiritType, flavors[], price }` |  
| `/bottles` | `GET` | List all bottles | - |  
| `/bottles/analyze` | `POST` | Get recommendations | `[ { flavors[] } ]` |  

#### **Example Request**  
```bash
curl -X POST http://localhost:5000/api/bottles/analyze \
-H "Content-Type: application/json" \
-d '[{ "flavors": ["peaty", "smoky"] }]'
```

#### **Response**  
```json
{
  "recommendations": [
    {
      "name": "Ardbeg Uigeadail",
      "region": "Islay",
      "score": 0.92,
      "price": 90
    }
  ]
}
```

---

## **5. Database Schema** 🗃️  

### **Bottle Model** (`Bottle.ts`)  
```typescript
interface IBottle {
  name: string;
  spiritType: "WHISKY" | "GIN" | "RUM" | "TEQUILA";
  region?: string;
  price: number;
  flavors: string[];
  embedding?: number[];  // For AI vector search
}
```

### **Indexes**  
- `flavors`: Array field for quick lookup.  
- `embedding`: Vector index (if using Atlas Vector Search).  

---

## **6. AI Integration** 🤖  

### **DeepSeek API Workflow**  
1. Convert user’s flavor list → **text embedding**.  
2. Store embeddings in MongoDB.  
3. Use **cosine similarity** to find closest matches.  

#### **Code Snippet**  
```typescript
// Generate embeddings
const embedding = await deepseek.getEmbedding("peaty, smoky");

// Store in DB
await Bottle.create({ name: "Lagavulin", embedding });
```

---

## **7. Setup & Deployment** 🚀  

### **Local Development**  
1. Clone repo:  
   ```bash
   git clone https://github.com/yourname/bob-the-bar-ai
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Start MongoDB:  
   ```bash
   mongod
   ```
4. Run server:  
   ```bash
   npm run dev
   ```

### **Production Deployment**  
- **Docker**:  
  ```dockerfile

FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN apk update && apk upgrade && npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN apk update && apk upgrade
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./

EXPOSE 5000
CMD ["nodemon", "dist/server.js"]
  ```
- **Environment Variables**:  
  ```env
  MONGO_URI=mongodb+srv://yours/bob-the-bar-ai
  PORT=5000
  ```

---

## **8. Testing** ✔️  

### **Test Cases**  
1. **Unit Tests**:  
   - Validate flavor scoring logic.  
   - Test DB connection.  
2. **Integration Tests**:  
   - API endpoints (Postman/Insomnia).  
   - AI recommendation accuracy.  

#### **Example Test**  
```typescript
describe("Recommendation Service", () => {
  it("should match peaty flavors", async () => {
    const recs = await recommendationService.analyze([{ flavors: ["peaty"] }]);
    expect(recs[0].name).toBe("Ardbeg 10");
  });
});
```

---

## **9. Future Roadmap** 🗺️  

- **Mobile App**: React Native interface.  
- **Social Features**: Share collections with friends.  
- **Advanced AI**: Personalized taste profiles.  

---

## **10. Contributing** 👥  

1. Fork the repository.  
2. Create a feature branch:  
   ```bash
   git checkout -b feature/new-algorithm
   ```
3. Submit a PR with tests.  

---

**License**: MIT  
**Contact**: [mazinoishioma@gmail.com]  

--- 

This documentation covers all aspects of **Bob the Bar AI**—from architecture to deployment. Let me know if you’d like to expand any section!
