import { getActiveMembership } from './bookingPricing';

export const MEMBERSHIP_TIERS = ['Silver', 'Gold', 'Platinum'];

export function isMembershipOffer(offer) {
  return offer?.category === 'membership';
}

export function formatMembershipTiersLabel(tiers = []) {
  const list = (tiers || []).filter(Boolean);
  if (!list.length) return 'M2K members';
  if (list.length === MEMBERSHIP_TIERS.length) return 'All members';
  if (list.length === 1) return `${list[0]} members`;
  return `${list.join(', ')} members`;
}

export function canUseOffer(offer, user, membershipPlans = []) {
  if (!offer || offer.inquiryOnly) return false;
  if (!isMembershipOffer(offer)) return true;

  const membership = getActiveMembership(user, membershipPlans);
  if (!membership) return false;

  const tiers = offer.membershipTiers || [];
  if (!tiers.length) return true;

  return tiers.includes(membership.name);
}

export function getCheckoutOffers(offers = [], user, membershipPlans = []) {
  const now = new Date();
  return offers.filter(
    offer =>
      offer.isActive &&
      new Date(offer.validTill) > now &&
      !offer.inquiryOnly &&
      canUseOffer(offer, user, membershipPlans)
  );
}

export function partitionOffers(offers = []) {
  const membership = [];
  const school = [];
  const standard = [];

  offers.forEach(offer => {
    if (offer.category === 'membership') membership.push(offer);
    else if (offer.category === 'school_group') school.push(offer);
    else standard.push(offer);
  });

  return { membershipOffers: membership, schoolOffers: school, standardOffers: standard };
}
