import { Router } from 'express';
import { bookingRoutes } from './booking-route';
import { eventsRoutes } from './event-route';

const router = Router();

router.use('/events', eventsRoutes);
router.use('/bookings', bookingRoutes);

export { router };