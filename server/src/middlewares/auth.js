const jwt = require('jsonwebtoken');
const User = require('../models/user');

const loadUserFromToken = async req => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const decoded = jwt.verify(token, 'mySecret');
  const user = await User.findOne({
    _id: decoded._id,
    'tokens.token': token,
  }).populate('membership');
  return { token, user };
};

const simple = async (req, res, next) => {
  try {
    const { token, user } = await loadUserFromToken(req);
    if (!user) throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const enhance = async (req, res, next) => {
  try {
    const { token, user } = await loadUserFromToken(req);
    if (!user || user.role !== 'superadmin') throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

/** Admin content editors (sidebar) — superadmin or admin */
const staff = async (req, res, next) => {
  try {
    const { token, user } = await loadUserFromToken(req);
    if (!user || !['superadmin', 'admin'].includes(user.role)) throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = { simple, enhance, staff };
