const express = require('express');
const auth = require('../middlewares/auth');
const Reservation = require('../models/reservation');
const User = require('../models/user');
const userModeling = require('../utils/userModeling');
const generateQR = require('../utils/generateQRCode');
const Setting = require('../models/setting');

const router = new express.Router();

// Create a reservation
router.post('/reservations', auth.simple, async (req, res) => {
  const reservation = new Reservation(req.body);

  const QRCode = await generateQR(`https://elcinema.herokuapp.com/#/checkin/${reservation._id}`);

  try {
    const reservationDate = new Date(reservation.date);
    const startOfDay = new Date(reservationDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(reservationDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingReservations = await Reservation.find({
      cinemaId: reservation.cinemaId,
      startAt: reservation.startAt,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    const existingSeats = new Set(
      existingReservations
        .map((item) => item.seats || [])
        .reduce((acc, seats) => acc.concat(seats), [])
        .map(([row, seat]) => `${row}-${seat}`)
    );

    const requestedSeats = (reservation.seats || []).map(
      ([row, seat]) => `${row}-${seat}`
    );
    const conflictedSeats = requestedSeats.filter((seatKey) =>
      existingSeats.has(seatKey)
    );

    if (conflictedSeats.length) {
      return res.status(409).send({
        error: 'One or more selected seats are already booked. Please refresh and choose different seats.',
      });
    }

    const pointsUsed = req.body.pointsUsed || 0;
    const user = await User.findById(req.user._id);

    if (user.loyaltyPoints < pointsUsed) {
      return res.status(400).send({ error: 'Insufficient loyalty points' });
    }

    user.loyaltyPoints -= pointsUsed;
    const finalAmountPaid = Math.max(0, reservation.total - pointsUsed);
    
    // Calculate points earned from settings
    let pointsEarned = 0;
    try {
      const lpSetting = await Setting.findOne({ key: 'loyaltyPointsPer100' });
      const pointsPer100 = lpSetting ? Number(lpSetting.value) : 0;
      if (pointsPer100 > 0) {
        pointsEarned = Math.floor((finalAmountPaid / 100) * pointsPer100);
      }
    } catch (e) {
      console.error('Error calculating loyalty points:', e);
      // Fallback to 10% if setting lookup fails
      pointsEarned = Math.floor(finalAmountPaid * 0.1);
    }
    
    user.loyaltyPoints += pointsEarned;
    await user.save();
    
    reservation.QRCode = QRCode;
    await reservation.save();
    res.status(201).send({ status: 'success', data: reservation });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all reservations
router.get('/reservations', auth.simple, async (req, res) => {
  try {
    const reservations = await Reservation.find({});
    res.send(reservations);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get reservation by id
router.get('/reservations/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const reservation = await Reservation.findById(_id);
    return !reservation ? res.sendStatus(404) : res.send(reservation);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// Get reservation checkin by id
router.get('/reservations/checkin/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const reservation = await Reservation.findById(_id);
    reservation.checkin = true;
    await reservation.save();
    return !reservation ? res.sendStatus(404) : res.send(reservation);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Update reservation by id
router.patch('/reservations/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'date',
    'startAt',
    'seats',
    'ticketPrice',
    'total',
    'username',
    'phone',
    'checkin',
    'foodItems',
  ];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const reservation = await Reservation.findById(_id);
    updates.forEach((update) => (reservation[update] = req.body[update]));
    await reservation.save();
    return !reservation ? res.sendStatus(404) : res.send(reservation);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// Delete reservation by id
router.delete('/reservations/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  try {
    const reservation = await Reservation.findByIdAndDelete(_id);
    return !reservation ? res.sendStatus(404) : res.send(reservation);
  } catch (e) {
    return res.sendStatus(400);
  }
});

// User modeling get suggested seats
router.get('/reservations/usermodeling/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const suggestedSeats = await userModeling.reservationSeatsUserModeling(username);
    res.send(suggestedSeats);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
