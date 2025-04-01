import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface PriceRecommendation {
  productId: string;
  currentPrice: number;
  recommendedPrice: number;
  confidence: number;
  factors: {
    demand: number;
    competition: number;
    inventory: number;
  };
}

interface TrendReport {
  productId: string;
  historicalPrices: {
    date: string;
    price: number;
    sales: number;
  }[];
  priceElasticity: number;
  seasonalityFactor: number;
  recommendedPriceRange: {
    min: number;
    max: number;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );

    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    if (req.method === "POST" && path === "predict") {
      const { productId } = await req.json();

      // Fetch product data
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (productError) throw productError;

      // Simple dynamic pricing algorithm
      // In a real implementation, this would use more sophisticated ML models
      const recommendation: PriceRecommendation = {
        productId,
        currentPrice: product.price,
        recommendedPrice: calculateRecommendedPrice(product),
        confidence: 0.85,
        factors: {
          demand: calculateDemandScore(product),
          competition: 0.75, // Placeholder for competitive analysis
          inventory: calculateInventoryScore(product),
        },
      };

      return new Response(JSON.stringify(recommendation), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "GET" && path === "trend-report") {
      const productId = url.searchParams.get("productId");
      if (!productId) {
        throw new Error("Product ID is required");
      }

      // Generate trend report
      const report: TrendReport = await generateTrendReport(supabase, productId);

      return new Response(JSON.stringify(report), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

// Helper functions for price calculations
function calculateRecommendedPrice(product: any): number {
  const basePrice = product.price;
  const stockLevel = product.stock;
  
  // Basic price adjustment based on stock levels
  let adjustment = 1.0;
  
  if (stockLevel <= 5) {
    // Low stock - increase price
    adjustment = 1.1;
  } else if (stockLevel >= 50) {
    // High stock - decrease price
    adjustment = 0.9;
  }
  
  return Number((basePrice * adjustment).toFixed(2));
}

function calculateDemandScore(product: any): number {
  // Simplified demand scoring
  // In a real implementation, this would analyze historical sales data
  const stockLevel = product.stock;
  const maxStock = 100; // Example maximum stock level
  
  // Higher demand score when stock is low
  return Number((1 - (stockLevel / maxStock)).toFixed(2));
}

function calculateInventoryScore(product: any): number {
  // Simplified inventory health score
  const stockLevel = product.stock;
  const optimalStock = 25; // Example optimal stock level
  
  // Score based on distance from optimal stock level
  const distance = Math.abs(stockLevel - optimalStock);
  const maxDistance = 50;
  
  return Number((1 - (distance / maxDistance)).toFixed(2));
}

async function generateTrendReport(supabase: any, productId: string): Promise<TrendReport> {
  // In a real implementation, this would analyze historical data
  // For now, we'll generate sample data
  const historicalPrices = generateSampleHistoricalData();
  
  return {
    productId,
    historicalPrices,
    priceElasticity: calculatePriceElasticity(historicalPrices),
    seasonalityFactor: 1.2,
    recommendedPriceRange: {
      min: Math.min(...historicalPrices.map(h => h.price)) * 0.9,
      max: Math.max(...historicalPrices.map(h => h.price)) * 1.1,
    },
  };
}

function generateSampleHistoricalData() {
  const data = [];
  const basePrice = 100;
  const baseSales = 50;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some random variation
    const variation = (Math.random() - 0.5) * 20;
    const salesVariation = (Math.random() - 0.5) * 20;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Number((basePrice + variation).toFixed(2)),
      sales: Math.max(0, Math.round(baseSales + salesVariation)),
    });
  }
  
  return data;
}

function calculatePriceElasticity(historicalData: any[]): number {
  // Simple price elasticity calculation
  // In a real implementation, this would use more sophisticated statistical methods
  const firstPrice = historicalData[0].price;
  const lastPrice = historicalData[historicalData.length - 1].price;
  const firstSales = historicalData[0].sales;
  const lastSales = historicalData[historicalData.length - 1].sales;
  
  const priceChange = (lastPrice - firstPrice) / firstPrice;
  const salesChange = (lastSales - firstSales) / firstSales;
  
  // Avoid division by zero
  if (priceChange === 0) return 0;
  
  return Number((salesChange / priceChange).toFixed(2));
}