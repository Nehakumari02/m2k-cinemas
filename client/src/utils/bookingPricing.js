/** Standard GST rate on movie tickets (India) */
export const TICKET_GST_RATE = 18;

export function getActiveMembership(user) {
  if (!user) return null;
  const membership = user.membership;
  if (!membership || typeof membership !== 'object' || !membership._id) {
    return null;
  }
  if (user.membershipExpiresAt && new Date(user.membershipExpiresAt) < new Date()) {
    return null;
  }
  return membership;
}

/**
 * Ticket + food pricing with 18% GST on tickets and membership savings.
 */
export function calculateBookingTotals({
  ticketsTotal = 0,
  foodTotal = 0,
  discountPercentage = 0,
  pointsUsed = 0,
  user = null,
}) {
  const membership = getActiveMembership(user);
  const ticketGstRate = membership?.ticketGstPercent ?? TICKET_GST_RATE;
  const ticketGst = Math.round((ticketsTotal * ticketGstRate) / 100);

  let membershipTicketDiscount = 0;
  let firstBookingBenefit = 0;
  const firstBookingBenefitEligible =
    Boolean(membership) && !user?.membershipGstBenefitUsed;

  if (membership) {
    membershipTicketDiscount = Math.floor(
      (ticketsTotal * (membership.ticketDiscount || 0)) / 100
    );
    if (firstBookingBenefitEligible) {
      const pct = membership.firstBookingGstBenefitPercent ?? 5;
      firstBookingBenefit = Math.floor((ticketsTotal * pct) / 100);
    }
  }

  const ticketsWithGst = ticketsTotal + ticketGst;
  const membershipSavings = membershipTicketDiscount + firstBookingBenefit;
  const preCouponTotal = Math.max(0, ticketsWithGst + foodTotal - membershipSavings);
  const discountValue = Math.floor((preCouponTotal * (discountPercentage || 0)) / 100);
  const afterDiscountTotal = Math.max(0, preCouponTotal - discountValue);
  const finalPrice = Math.max(0, afterDiscountTotal - (pointsUsed || 0));

  return {
    ticketsTotal,
    ticketGstRate,
    ticketGst,
    ticketsWithGst,
    membershipTicketDiscount,
    firstBookingBenefit,
    firstBookingBenefitEligible,
    membershipSavings,
    membershipName: membership?.name || null,
    foodTotal,
    subTotal: ticketsWithGst + foodTotal,
    preCouponTotal,
    discountValue,
    afterDiscountTotal,
    finalPrice,
    appliedFirstGstBenefit: firstBookingBenefit > 0,
  };
}
