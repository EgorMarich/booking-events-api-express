import { Request, Response } from 'express';
import { Event } from '../models';
import { logger } from '../utils/logger';

export class EventsController {
  constructor() {}

  public getAll = async (req: Request, res: Response) => {
    try {
      logger.info('Получение списка событий');

      const events = await Event.findAll({
        order: [['dateTime', 'ASC']],
      });

      logger.info(`Найдено ${events.length} событий`);
      const plainEvents = events.map((event) => event.get({ plain: true }));

      res.status(200).json({
        success: true,
        data: plainEvents,
        count: plainEvents.length,
      });
    } catch (error) {
      logger.error('Ошибка получения списка событий:', error);
      res.status(500).json({
        success: false,
        error: 'Внутренняя ошибка сервера',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка',
      });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const event = await Event.findByPk(id);
      return res.status(200).json(event);
    } catch (err: unknown) {
      logger.warn('Ошбика получения события', { event_id: req.params.id });
      return res.status(500).json({
        message: 'Ошибка получения события',
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };
}
