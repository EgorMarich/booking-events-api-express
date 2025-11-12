import { Request, Response } from 'express';
import { sequelize } from '../models/db';
import { Booking, Event } from '../models';
import { logger } from '../utils/logger';

export class bookingController {
  constructor() {}

  reserve = async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
      const { event_id, user_id } = req.body;

      logger.info('Попытка создания брони', { event_id, user_id });

      if (!event_id || !user_id) {
        await transaction.rollback();
        logger.warn('Пропущены поля', { event_id, user_id });
        return res.status(400).json({
          message: 'Не удалось найти событие и пользователя',
        });
      }

      const event = await Event.findByPk(event_id, {
        transaction,
        lock: true,
      });

      if (!event) {
        await transaction.rollback();
        logger.warn('Событие не найдено', { event_id });
        return res.status(404).json({
          message: 'Событие не найдено',
        });
      }

      const existingBooking = await Booking.findOne({
        where: {
          event_id: event_id,
          user_id: user_id,
        },
        transaction,
      });

      if (existingBooking) {
        await transaction.rollback();
        logger.warn('Попытка повторного бронирования', { event_id, user_id });
        return res.status(409).json({
          message: 'Вы уже бронировали данное мероприятие',
        });
      }

      const bookedSeatsCount = await Booking.count({
        where: { event_id: event_id },
        transaction,
      });

      if (bookedSeatsCount >= event.total_seats) {
        await transaction.rollback();
        return res.status(409).json({
          message: 'На событие нет свободных мест',
        });
      }

      const booking = await Booking.create(
        {
          event_id: event_id,
          user_id: user_id,
        },
        { transaction },
      );

      await transaction.commit();
      
      logger.info('Бронь успешно создана', { 
        booking_id: booking.id, 
      });

      return res.status(201).json({
        message: 'Место на событие успешно забронировано',
        data: {
          id: booking.id,
          event_id: booking.event_id,
          user_id: booking.user_id
        }
      })
    } catch (err: unknown) {
      await transaction.rollback();

      return res.status(500).json({
        message: 'Ошибка сервера'
      })
    }
  };


  getBooking = async (req: Request, res: Response) => {
    try {
      const bookingId = parseInt(req.params.id);

      if ( !bookingId || bookingId <= 0 ) {
        return res.status(400).json({
          message: 'Данное бронирование не найдено'
        })
      }

      const booking = await Booking.findByPk(bookingId, {
        include: [{
          model: Event,
          as: 'event',
          attributes: ['id', 'name', 'total_seats']
        }]
      })

      if(!booking){
        return res.status(404).json({
          message: 'Бронирование не найдено'
        })
      }

      return res.status(200).json({
        data: booking
      })
    } catch( err: unknown) {
        return res.status(500).json({
          message: 'Ошибка сервера'
        })
    }
  }


  getUserBookings = async ( req: Request, res: Response) => {
    try {
      const { userId } = req.params
      if (!userId ) {
        return res.status(400).json({
          message: 'Пользователь не найден'
        })
      }

      const bookings = await Booking.findAll({
        where: {
          user_id: userId
        },
        include: [{
          model: Event,
          as: 'event',
          attributes: ['id', 'name', 'total_seats']
        }],
        order: [['created_at', 'DESC']]
      })

      return res.status(200).json({
        data: {user_id: userId, booking: bookings, total: bookings.length}
      })
    }catch( err: unknown){
      
      return res.status(500).json({
        message: 'Ошибка сервера'
      })
    }
  }
}
