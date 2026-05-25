const crypto = require('crypto');
const User = require('../models/user');
const { normalizeMembershipPlan } = require('../utils/membershipDefaults');

/** POST /users/login/guest — browse and book without full registration */
module.exports = async function guestLoginHandler(req, res) {
  try {
    const { sessionId, name } = req.body || {};
    let user;

    if (sessionId) {
      user = await User.findOne({
        isSessionGuest: true,
        guestSessionId: String(sessionId),
      });
    }

    if (!user) {
      const guestSessionId =
        sessionId && String(sessionId).length >= 8
          ? String(sessionId)
          : crypto.randomBytes(16).toString('hex');
      const suffix = guestSessionId.slice(0, 10);
      const stamp = Date.now();

      user = new User({
        name: (name && String(name).trim()) || 'Guest',
        username: `guest_${suffix}_${stamp}`,
        email: `guest.${suffix}.${stamp}@session.m2k.local`,
        password: crypto.randomBytes(32).toString('hex'),
        role: 'guest',
        isSessionGuest: true,
        guestSessionId,
      });
      await user.save();
    } else if (name && String(name).trim()) {
      user.name = String(name).trim();
      await user.save();
    }

    const token = await user.generateAuthToken();
    const populated = await User.findById(user._id).populate('membership');
    if (populated.membership) {
      populated.membership = normalizeMembershipPlan(populated.membership);
    }

    res.status(201).send({
      user: populated,
      token,
      guestSessionId: populated.guestSessionId,
    });
  } catch (e) {
    console.error('Guest login error:', e);
    res.status(400).send({
      error: { message: e.message || 'Could not start guest session' },
    });
  }
};
