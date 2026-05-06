import * as Localization from 'expo-localization';

// Cache the primary locale to avoid repeated bridge calls
const primaryLocale = Localization.getLocales()[0];

export const getDeviceCurrency = (): string => {
    return primaryLocale?.currencyCode ?? 'PHP';
};

/**
 * Formats a number based on device locale.
 * Uses 'en-PH' / 'PHP' as the default fallback.
 */
export const formatCurrency = (amount: number): string => {
    const currencyCode = primaryLocale?.currencyCode ?? 'PHP';
    const languageTag = primaryLocale?.languageTag ?? 'en-PH';

    try {
        return new Intl.NumberFormat(languageTag, {
            style: 'currency',
            currency: currencyCode,
            // Optional: Standardizes decimals for financial apps
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch (e) {
        // Fallback formatting if Intl fails
        const symbol = currencyCode === 'PHP' ? '₱' : '$';
        return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    }
};