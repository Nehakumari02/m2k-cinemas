/** Standard GST rate on movie tickets (India) */
export const TICKET_GST_RATE = 18;

/** Fallback tier benefits when DB plan fields are missing (old seeds) */
export const MEMBERSHIP_TIER_DEFAULTS = {
  Silver: { ticketDiscount: 10, foodDiscount: 5, shopDiscount: 5, ticketGstPercent: 18, firstBookingGstBenefitPercent: 5 },
  Gold: { ticketDiscount: 20, foodDiscount: 15, shopDiscount: 10, ticketGstPercent: 18, firstBookingGstBenefitPercent: 5 },
  Platinum: { ticketDiscount: 35, foodDiscount: 25, shopDiscount: 15, ticketGstPercent: 18, firstBookingGstBenefitPercent: 5 },
};

export function normalizeMembershipPlan(plan) {
  if (!plan) return null;
  const doc = typeof plan === 'object' ? { ...plan } : null;
  if (!doc) return null;
  const defaults = MEMBERSHIP_TIER_DEFAULTS[doc.name] || {};
  return {
    ...doc,
    ticketDiscount: doc.ticketDiscount ?? defaults.ticketDiscount ?? 0,
    foodDiscount: doc.foodDiscount ?? defaults.foodDiscount ?? 0,
    shopDiscount: doc.shopDiscount ?? defaults.shopDiscount ?? defaults.foodDiscount ?? 0,
    ticketGstPercent: doc.ticketGstPercent ?? defaults.ticketGstPercent ?? TICKET_GST_RATE,
    firstBookingGstBenefitPercent:
      doc.firstBookingGstBenefitPercent ?? defaults.firstBookingGstBenefitPercent ?? 5,
  };
}

function getMembershipId(membership) {
  if (!membership) return null;
  if (typeof membership === 'string') return membership;
  return membership._id?.toString?.() || membership._id || null;
}

/**
 * Resolve the user's active plan (populated object, catalog lookup, or tier defaults).
 */
export function resolveMembershipPlan(user, membershipPlans = []) {
  if (!user?.membership) return null;

  const membershipId = getMembershipId(user.membership);
  const fromCatalog = membershipPlans.find(
    p => String(p._id) === String(membershipId)
  );
  if (fromCatalog) {
    return normalizeMembershipPlan(fromCatalog);
  }

  if (typeof user.membership === 'object' && user.membership !== null) {
    return normalizeMembershipPlan(user.membership);
  }

  return null;
}

export function getActiveMembership(user, membershipPlans = []) {
  if (!user) return null;
  if (user.membershipExpiresAt && new Date(user.membershipExpiresAt) < new Date()) {
    return null;
  }
  return resolveMembershipPlan(user, membershipPlans);
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
  membershipPlans = [],
}) {
  const membership = getActiveMembership(user, membershipPlans);
  const ticketGstRate = membership?.ticketGstPercent ?? TICKET_GST_RATE;
  const ticketGst = Math.round((ticketsTotal * ticketGstRate) / 100);

  let membershipTicketDiscount = 0;
  let membershipFoodDiscount = 0;
  let firstBookingBenefit = 0;
  const firstBookingBenefitEligible =
    Boolean(membership) && !user?.membershipGstBenefitUsed;

  if (membership) {
    membershipTicketDiscount = Math.floor(
      (ticketsTotal * (membership.ticketDiscount || 0)) / 100
    );
    if (foodTotal > 0) {
      membershipFoodDiscount = Math.floor(
        (foodTotal * (membership.foodDiscount || 0)) / 100
      );
    }
    if (firstBookingBenefitEligible) {
      const pct = membership.firstBookingGstBenefitPercent ?? 5;
      firstBookingBenefit = Math.floor((ticketsTotal * pct) / 100);
    }
  }

  const ticketsWithGst = ticketsTotal + ticketGst;
  const membershipSavings =
    membershipTicketDiscount + membershipFoodDiscount + firstBookingBenefit;
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
    membershipFoodDiscount,
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
