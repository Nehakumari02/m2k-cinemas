const MEMBERSHIP_TIER_DEFAULTS = {
  Silver: { ticketDiscount: 10, foodDiscount: 5, shopDiscount: 5, ticketGstPercent: 18, firstBookingGstBenefitPercent: 5 },
  Gold: { ticketDiscount: 20, foodDiscount: 15, shopDiscount: 10, ticketGstPercent: 18, firstBookingGstBenefitPercent: 5 },
  Platinum: { ticketDiscount: 35, foodDiscount: 25, shopDiscount: 15, ticketGstPercent: 18, firstBookingGstBenefitPercent: 5 },
};

function normalizeMembershipPlan(plan) {
  if (!plan) return null;
  const doc = plan.toObject ? plan.toObject() : { ...plan };
  const defaults = MEMBERSHIP_TIER_DEFAULTS[doc.name] || {};
  return {
    ...doc,
    ticketDiscount: doc.ticketDiscount ?? defaults.ticketDiscount ?? 0,
    foodDiscount: doc.foodDiscount ?? defaults.foodDiscount ?? 0,
    shopDiscount: doc.shopDiscount ?? defaults.shopDiscount ?? defaults.foodDiscount ?? 0,
    ticketGstPercent: doc.ticketGstPercent ?? defaults.ticketGstPercent ?? 18,
    firstBookingGstBenefitPercent:
      doc.firstBookingGstBenefitPercent ?? defaults.firstBookingGstBenefitPercent ?? 5,
  };
}

module.exports = { normalizeMembershipPlan, MEMBERSHIP_TIER_DEFAULTS };
