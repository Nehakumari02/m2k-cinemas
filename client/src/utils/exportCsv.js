import moment from 'moment';

export function escapeCsvCell(value) {
  const str = String(value ?? '').replace(/"/g, '""');
  return /[",\n\r]/.test(str) ? `"${str}"` : str;
}

export function downloadCsv(filenamePrefix, headers, rows) {
  const csv = [headers, ...rows]
    .map(row => row.map(escapeCsvCell).join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filenamePrefix}-${moment().format('YYYY-MM-DD')}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatSeats(seats) {
  if (!Array.isArray(seats)) return '';
  return seats
    .map(s => {
      if (s == null) return '';
      if (typeof s === 'string' || typeof s === 'number') return String(s);
      if (s.label) return s.label;
      if (s.row != null && s.col != null) return `${s.row}-${s.col}`;
      return JSON.stringify(s);
    })
    .filter(Boolean)
    .join('; ');
}

function findLabel(id, list, attr) {
  const item = (list || []).find(entry => entry._id === id);
  return item ? item[attr] : '';
}

export function downloadUsersCsv(users = []) {
  downloadCsv(
    'm2k-users',
    [
      'Name',
      'Username',
      'Email',
      'Phone',
      'Role',
      'Wallet Balance',
      'Loyalty Points',
      'Session Guest',
      'Registered',
    ],
    users.map(user => [
      user.name,
      user.username,
      user.email,
      user.phone || '',
      user.role || 'guest',
      user.walletBalance != null ? user.walletBalance : 0,
      user.loyaltyPoints != null ? user.loyaltyPoints : 0,
      user.isSessionGuest ? 'Yes' : 'No',
      user.createdAt ? moment(user.createdAt).format('YYYY-MM-DD HH:mm') : '',
    ])
  );
}

export function downloadOrdersCsv(orders = []) {
  downloadCsv(
    'm2k-orders',
    [
      'Order ID',
      'Customer',
      'Email',
      'Order Date',
      'Total (INR)',
      'Status',
      'Payment Method',
      'Tracking ID',
      'Shipping Name',
      'Shipping Phone',
      'City',
      'Postal Code',
      'Items',
    ],
    orders.map(order => {
      const addr = order.shippingAddress || {};
      const itemsSummary = (order.items || [])
        .map(item => `${item.name || 'Item'} x${item.quantity} @ ${item.price}`)
        .join(' | ');
      return [
        order._id,
        order.user?.name || addr.fullName || '',
        order.user?.email || addr.email || '',
        order.createdAt ? moment(order.createdAt).format('YYYY-MM-DD HH:mm') : '',
        order.totalAmount,
        order.status,
        order.paymentMethod,
        order.trackingId || '',
        addr.fullName || '',
        addr.phone || '',
        addr.city || '',
        addr.postalCode || '',
        itemsSummary,
      ];
    })
  );
}

export function downloadReservationsCsv(reservations = [], movies = [], cinemas = []) {
  downloadCsv(
    'm2k-reservations',
    [
      'Reservation ID',
      'Username',
      'Phone',
      'Show Date',
      'Start At',
      'Movie',
      'Cinema',
      'Seats',
      'Ticket Price',
      'Total (INR)',
      'Status',
      'Check-in',
      'Food Items',
      'Booked At',
    ],
    reservations.map(r => {
      const foodSummary = (r.foodItems || [])
        .map(f => `${f.name || 'Food'} x${f.quantity || 1}`)
        .join(' | ');
      return [
        r._id,
        r.username,
        r.phone,
        r.date ? moment(r.date).format('YYYY-MM-DD') : '',
        r.startAt,
        findLabel(r.movieId, movies, 'title') || r.movieId,
        findLabel(r.cinemaId, cinemas, 'name') || r.cinemaId,
        formatSeats(r.seats),
        r.ticketPrice,
        r.total,
        r.status || 'Paid',
        r.checkin ? 'Yes' : 'No',
        foodSummary,
        r.createdAt ? moment(r.createdAt).format('YYYY-MM-DD HH:mm') : '',
      ];
    })
  );
}

export function downloadRefundsCsv(refunds = []) {
  downloadCsv(
    'm2k-refund-requests',
    [
      'Refund ID',
      'Type',
      'Original ID',
      'User Name',
      'User Email',
      'Reason',
      'Amount (INR)',
      'Status',
      'Admin Note',
      'Requested At',
    ],
    refunds.map(refund => [
      refund._id,
      refund.type,
      refund.originalId,
      refund.user?.name || '',
      refund.user?.email || '',
      refund.reason,
      refund.amount,
      refund.status,
      refund.adminNote || '',
      refund.createdAt ? moment(refund.createdAt).format('YYYY-MM-DD HH:mm') : '',
    ])
  );
}

export function downloadSchoolInquiriesCsv(inquiries = []) {
  downloadCsv(
    'm2k-school-bookings',
    [
      'Inquiry ID',
      'School Name',
      'Contact Name',
      'Email',
      'Phone',
      'Student Count',
      'Grade / Class',
      'Preferred Date',
      'Preferred Movie',
      'Preferred Cinema',
      'Offer Code',
      'Status',
      'Notes',
      'Submitted At',
    ],
    inquiries.map(row => [
      row._id,
      row.schoolName,
      row.contactName,
      row.email,
      row.phone,
      row.studentCount,
      row.gradeOrClass || '',
      row.preferredDate ? moment(row.preferredDate).format('YYYY-MM-DD') : '',
      row.preferredMovie || '',
      row.preferredCinema || '',
      row.offerCode || '',
      row.status || 'new',
      row.message || '',
      row.createdAt ? moment(row.createdAt).format('YYYY-MM-DD HH:mm') : '',
    ])
  );
}
