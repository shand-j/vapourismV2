import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * UK VAT rate (20%)
 * Shopify is configured to calculate tax at checkout, so prices returned
 * from the Storefront API are pre-tax. We add VAT for display purposes.
 */
const UK_VAT_RATE = 0.2;

/**
 * Format money with VAT included.
 * Since Shopify prices are stored ex-VAT (tax calculated at checkout),
 * we add 20% VAT to all displayed prices for UK customers.
 * 
 * @param amount - The price object from Shopify (ex-VAT)
 * @param includeVat - Whether to add VAT (default: true for UK store)
 */
export function formatMoney(
  amount?: {amount: string; currencyCode: string} | null,
  includeVat: boolean = true
) {
  if (!amount?.amount) return null;
  
  let displayAmount = Number(amount.amount);
  
  // Add VAT for display (Shopify prices are ex-VAT)
  if (includeVat) {
    displayAmount = displayAmount * (1 + UK_VAT_RATE);
  }
  
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: amount.currencyCode || 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(displayAmount);
}

/**
 * Calculate the VAT-inclusive price from an ex-VAT amount
 */
export function addVat(exVatAmount: number): number {
  return exVatAmount * (1 + UK_VAT_RATE);
}

/**
 * Get just the VAT portion of a price
 */
export function getVatAmount(exVatAmount: number): number {
  return exVatAmount * UK_VAT_RATE;
}
