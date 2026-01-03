/**
 * Email Validation Utilities
 * 
 * Shared email validation functions for the email capture feature.
 * Uses a comprehensive regex pattern for client-side validation.
 */

/**
 * Validates an email address format
 * 
 * Uses RFC 5322 compliant regex pattern to validate most common email formats.
 * This is client-side validation only - server-side validation should also be performed.
 * 
 * @param email - The email address to validate
 * @returns true if email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // Trim and lowercase for consistency
  const trimmed = email.trim();
  
  // Basic length checks
  if (trimmed.length === 0 || trimmed.length > 254) {
    return false;
  }

  // RFC 5322 compliant email regex
  // This pattern validates most common email formats including:
  // - Basic emails: user@domain.com
  // - Subdomains: user@mail.domain.com
  // - Plus addressing: user+tag@domain.com
  // - Dots: user.name@domain.com
  // - Hyphens: user@my-domain.com
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  return emailRegex.test(trimmed);
}

/**
 * Normalizes an email address for storage/comparison
 * 
 * @param email - The email address to normalize
 * @returns Normalized email (lowercase, trimmed)
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}
