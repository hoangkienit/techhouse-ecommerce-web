import { LoyaltyRank, LoyaltyRankLabel } from "../enums/loyalties/loyalties.enum";

export function getRankColor(rank: LoyaltyRank): string {
    switch (rank) {
        case LoyaltyRank.DIAMOND: return '#4cd1ff';
        case LoyaltyRank.GOLD: return '#f5c400';
        case LoyaltyRank.SILVER: return '#bfc6d1';
        default: return '#cd7f32'; // Bronze
    }
}

export function getLoyaltyRankLabel(rank: LoyaltyRank): LoyaltyRankLabel {
    switch (rank) {
        case LoyaltyRank.DIAMOND:
            return LoyaltyRankLabel.DIAMOND;
        case LoyaltyRank.GOLD:
            return LoyaltyRankLabel.GOLD;
        case LoyaltyRank.SILVER:
            return LoyaltyRankLabel.SILVER;
        default:
            return LoyaltyRankLabel.BRONZE;
    }
}

export function getLoyaltyRank(points: number): LoyaltyRank {
    if (points >= LoyaltyRank.DIAMOND) {
        return LoyaltyRank.DIAMOND;
    }
    if (points >= LoyaltyRank.GOLD) {
        return LoyaltyRank.GOLD;
    }
    if (points >= LoyaltyRank.SILVER) {
        return LoyaltyRank.SILVER;
    }
    return LoyaltyRank.BRONZE;
}

export function getRankIcon(rank: LoyaltyRank) {
    switch (rank) {
        case LoyaltyRank.BRONZE:
            return 'award-outline';
        case LoyaltyRank.SILVER:
            return 'shield-outline';
        case LoyaltyRank.GOLD:
            return 'star-outline';
        case LoyaltyRank.DIAMOND:
            return 'flash-outline';
        default:
            return 'award-outline';
    }
}
