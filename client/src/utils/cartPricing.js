import { getActiveMembership } from './bookingPricing';

/**
 * Cart totals with membership discount, optional coupon, and loyalty points.
 * @param {'food' | 'shop'} cartType — food cart uses foodDiscount; shop cart uses shopDiscount (falls back to foodDiscount).
 */
export function calculateCartTotals({
  subtotal = 0,
  discountPercentage = 0,
  pointsUsed = 0,
  user = null,
  membershipPlans = [],
  cartType = 'food',
}) {
  const membership = getActiveMembership(user, membershipPlans);
  const discountPercent =
    cartType === 'food'
      ? membership?.foodDiscount || 0
      : membership?.shopDiscount ?? membership?.foodDiscount ?? 0;

  const membershipDiscount =
    membership && discountPercent > 0
      ? Math.floor((subtotal * discountPercent) / 100)
      : 0;

  const afterMembership = Math.max(0, subtotal - membershipDiscount);
  const couponDiscount = Math.floor((afterMembership * (discountPercentage || 0)) / 100);
  const afterCoupon = Math.max(0, afterMembership - couponDiscount);
  const finalTotal = Math.max(0, afterCoupon - (pointsUsed || 0));

  return {
    subtotal,
    membershipDiscount,
    membershipDiscountPercent: discountPercent,
    membershipName: membership?.name || null,
    couponDiscount,
    afterMembership,
    afterCoupon,
    finalTotal,
    totalDiscount: membershipDiscount + couponDiscount,
  };
}
