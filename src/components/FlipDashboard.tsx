"use client";

import React, { useEffect, useState, useCallback } from "react";
import { fetchTokenData, TokenData } from "@/lib/api";
import ProgressBar from "./ProgressBar";

// Hardcoded Token Addresses
const COIN_A_ADDRESS = "FkCWCWtDaLVJNiUU8An4WexgWX2ckaYPdJLjqzCkpump"; // FKH Pump (Chaser)
const COIN_B_ADDRESS = "BCXpjsHYmgVpRKdv4EQv1RARhYagnnwPkJjYbvM6bonk"; // FKH Bonk (Target)

// Helper to format currency
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value);
};

export default function FlipDashboard() {
    const [coinA, setCoinA] = useState<TokenData | null>(null);
    const [coinB, setCoinB] = useState<TokenData | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        setLoading(true);
        const [dataA, dataB] = await Promise.all([
            fetchTokenData(COIN_A_ADDRESS),
            fetchTokenData(COIN_B_ADDRESS),
        ]);
        setCoinA(dataA);
        setCoinB(dataB);
        setLastUpdated(new Date());
        setLoading(false);
    }, []);

    useEffect(() => {
        loadData();
        const intervalId = setInterval(loadData, 30000); // 30 seconds
        return () => clearInterval(intervalId);
    }, [loadData]);

    if (loading && !coinA) {
        return <div className="text-black text-xl animate-pulse">Loading market data...</div>;
    }

    if (!coinA || !coinB) {
        return <div className="text-red-500">Error loading data. Retrying...</div>;
    }

    // Logic
    const mcA = coinA.marketCap;
    const mcB = coinB.marketCap;

    const isFlipped = mcA > mcB;
    const multiplier = isFlipped ? mcA / mcB : mcB / mcA;
    const progressPercent = isFlipped ? 100 : (mcA / mcB) * 100;

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-12">
            {/* Header / Hero Metric */}
            <div className="text-center space-y-4">
                {isFlipped ? (
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-green-600">
                        FLIPPED!
                    </h1>
                ) : (
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black">
                        {multiplier.toFixed(2)}x away
                    </h1>
                )}

                <p className="text-xl md:text-2xl font-light text-gray-600">
                    {isFlipped
                        ? `FKH (Pump) is winning by ${formatCurrency(mcA - mcB)}`
                        : `FKH (Pump) is from flipping FKH (Bonk)`
                    }
                </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full space-y-2">
                <div className="flex justify-between text-sm text-gray-500 uppercase tracking-widest font-semibold">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                </div>
                <ProgressBar progress={progressPercent} color={isFlipped ? 'bg-green-500' : 'bg-black'} />
                <div className="text-center text-sm font-medium pt-2 text-gray-800">
                    {progressPercent.toFixed(2)}% Completed
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {/* Coin A (Chaser) */}
                <div className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                    <span className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">The Chaser</span>
                    <h2 className="text-2xl font-bold text-black">FKH (Pump)</h2>
                    <div className="text-3xl font-mono mt-4 text-black">{formatCurrency(mcA)}</div>
                    <div className="text-sm text-gray-500 mt-1">MCap</div>
                </div>

                {/* Coin B (Target) */}
                <div className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                    <span className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">The Target</span>
                    <h2 className="text-2xl font-bold text-black">FKH (Bonk)</h2>
                    <div className="text-3xl font-mono mt-4 text-black">{formatCurrency(mcB)}</div>
                    <div className="text-sm text-gray-500 mt-1">MCap</div>
                </div>
            </div>

            {/* Footer / Refresh Info */}
            <div className="text-center text-xs text-gray-300">
                Data from DexScreener • Auto-refreshing usually every 30s <br />
                {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
            </div>
        </div>
    );
}
