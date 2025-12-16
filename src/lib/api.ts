export interface TokenData {
    priceUsd: string;
    marketCap: number;
    fdv: number;
    pairAddress: string;
}

const DEXSCREENER_API_BASE = "https://api.dexscreener.com/latest/dex/tokens";

export async function fetchTokenData(tokenAddress: string): Promise<TokenData | null> {
    try {
        const response = await fetch(`${DEXSCREENER_API_BASE}/${tokenAddress}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data for ${tokenAddress}`);
        }
        const data = await response.json();

        // "The API returns an array of pairs. You must select the first pair in the array (index 0)"
        if (data.pairs && data.pairs.length > 0) {
            const pair = data.pairs[0];
            return {
                priceUsd: pair.priceUsd,
                marketCap: pair.marketCap || pair.fdv || 0, // Fallback to FDV if MC is null
                fdv: pair.fdv,
                pairAddress: pair.pairAddress,
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching token data:", error);
        return null;
    }
}
