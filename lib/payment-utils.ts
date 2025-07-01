/**
 * Utility functions for payment processing
 */
import crypto from 'crypto';

/**
 * Interface for payment provider and status
 */
export interface PaymentStatusMapping {
  paymentStatus: string;
  provider: string;
}

/**
 * Interface for payment object
 */
export interface Payment {
  id: string;
  status: string;
  amount: number;
  currency: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
  orderId: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
  [key: string]: unknown; // For any additional properties
}

/**
 * Interface for Razorpay verification parameters
 */
export interface RazorpayVerificationParams {
  orderId: string;
  paymentId: string;
  signature: string;
  secret: string;
}

/**
 * Maps a payment provider's status to an internal order status.
 * 
 * @param paymentStatus - Status received from payment gateway
 * @param provider - Payment provider name (e.g., 'razorpay', 'stripe')
 * @returns Internal order status ('PENDING', 'CONFIRMED', 'PAYMENT_FAILED', etc.)
 */
export function mapPaymentStatusToOrderStatus(
  paymentStatus: string,
  provider: string
): string {
  const successStatuses = ['COMPLETED', 'SUCCESS', 'PAID', 'CAPTURED'];
  const failedStatuses = ['FAILED', 'FAILURE', 'DECLINED', 'CANCELLED'];

  // Razorpay-specific handling
  if (provider.toLowerCase() === 'razorpay' && paymentStatus.toUpperCase() === 'AUTHORIZED') {
    return 'PENDING';
  }

  if (successStatuses.includes(paymentStatus.toUpperCase())) {
    return 'CONFIRMED'; // Payment successful, order confirmed
  } else if (failedStatuses.includes(paymentStatus.toUpperCase())) {
    return 'PAYMENT_FAILED'; // Payment failed
  }

  // Fallback to pending if unrecognized
  return 'PENDING';
}

/**
 * Verifies the Razorpay signature to ensure the request is genuine.
 * 
 * @param params - The verification parameters
 * @returns True if signature is valid, else false
 */
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
  secret
}: RazorpayVerificationParams): boolean {
  if (!secret || !signature) return false;

  const payload = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return expectedSignature === signature;
}

/**
 * Formats raw payment object for client/frontend use.
 * Removes sensitive fields.
 * 
 * @param payment - Raw payment object
 * @returns Formatted payment object or null
 */
export function formatPaymentForClient(payment: Payment) {
  if (!payment) return null;

  return {
    id: payment.id,
    status: payment.status,
    amount: payment.amount,
    currency: payment.currency,
    provider: payment.provider,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
    orderId: payment.orderId,
    // Optional client-safe metadata
    paymentMethod: payment.metadata?.paymentMethod,
    // Add or remove fields as needed
  };
}

/**
 * Validates payment amount against order amount to prevent tampering
 * 
 * @param paymentAmount - Amount from the payment provider
 * @param orderAmount - Expected amount from the order
 * @param tolerance - Acceptable difference (default: 0)
 * @returns Boolean indicating if the amounts match within tolerance
 */
export function validatePaymentAmount(
  paymentAmount: number,
  orderAmount: number,
  tolerance: number = 0
): boolean {
  const diff = Math.abs(paymentAmount - orderAmount);
  return diff <= tolerance;
}

/**
 * Checks if Razorpay configuration is valid
 * 
 * @returns Boolean indicating if the configuration is valid
 */
export function isRazorpayConfigValid(): boolean {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  
  return Boolean(keyId && keySecret && keyId.length > 0 && keySecret.length > 0);
}

/**
 * Creates Razorpay compatible amount (converts to paise)
 * 
 * @param amount - Amount in rupees
 * @returns Amount in paise as an integer
 */
export function createRazorpayAmount(amount: number | string): number {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return Math.round(numericAmount * 100); // Convert to paise and ensure it's an integer
}
