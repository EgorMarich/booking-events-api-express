import { Router } from 'express';
import { EventsController as EventControllerClass } from '../controllers/events-controller';

const router = Router();
const eventsController = new EventControllerClass();

router.get('/', eventsController.getAll);
router.get('/:id', eventsController.getById);

export { router as eventsRoutes };
