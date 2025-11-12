import { Request, Response } from 'express';
import { Event } from '../models';
import { logger } from '../utils/logger';

export class EventsController {
  constructor() {}

  getAll = async (res: Response): Promise<Response> => {
    try {
      const allEvents = await Event.findAll();
      return res.status(200).json(allEvents);
    } catch (err: unknown) {
      logger.warn('Ошбика получения списка событий');
      return res.status(500).json({
        message: 'Ошибка в получении событий',
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const event = await Event.findByPk(id);
      return res.status(200).json(event);
    } catch (err: unknown) {
      logger.warn('Ошбика получения события', {event_id: req.params.id});
      return res.status(500).json({
        message: 'Ошибка получения события',
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };
}
