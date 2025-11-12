import { Router } from 'express';
import { bookingController as BookingControllerClass } from '../controllers/booking-controller';

const router = Router();
const bookingController = new BookingControllerClass();

router.post('/reserve', bookingController.reserve);
router.get('/:id', bookingController.getBooking);
router.get('/user/:userId', bookingController.getUserBookings);

export { router as bookingRoutes };