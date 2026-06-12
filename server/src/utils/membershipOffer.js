const VALID_MEMBERSHIP_TIERS = ['Silver', 'Gold', 'Platinum'];

function getUserActiveMembershipName(user) {
  if (!user?.membership) return null;
  if (user.membershipExpiresAt && new Date(user.membershipExpiresAt) < new Date()) {
    return null;
  }
  const plan = user.membership;
  if (typeof plan === 'object' && plan !== null && plan.name) {
    return plan.name;
  }
  return null;
}

function isEligibleForMembershipOffer(user, offer) {
  if (!offer || offer.category !== 'membership') return true;

  const tier = getUserActiveMembershipName(user);
  if (!tier) return false;

  const tiers = Array.isArray(offer.membershipTiers) ? offer.membershipTiers : [];
  if (!tiers.length) return true;

  return tiers.includes(tier);
}

function normalizeMembershipTiers(tiers) {
  if (!Array.isArray(tiers)) return [];
  return tiers
    .map(t => String(t || '').trim())
    .filter(t => VALID_MEMBERSHIP_TIERS.includes(t));
}

module.exports = {
  VALID_MEMBERSHIP_TIERS,
  getUserActiveMembershipName,
  isEligibleForMembershipOffer,
  normalizeMembershipTiers,
};
