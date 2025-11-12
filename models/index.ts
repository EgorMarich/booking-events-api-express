import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './db';

interface EventAttributes {
  id: number;
  name: string;
  total_seats: number;
}

interface EventCreationAttributes extends Optional<EventAttributes, 'id'> {}

export class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
  public id!: number;
  public name!: string;
  public total_seats!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Event.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  total_seats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  }
}, {
  sequelize,
  modelName: 'Event',
  tableName: 'events',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});


interface BookingAttributes {
  id: number;
  event_id: number;
  user_id: string;
}

interface BookingCreationAttributes extends Optional<BookingAttributes, 'id'> {}

export class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
  public id!: number;
  public event_id!: number;
  public user_id!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Booking.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'events',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Booking',
  tableName: 'bookings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['event_id', 'user_id']
    }
  ]
});

Event.hasMany(Booking, { foreignKey: 'event_id', as: 'bookings' });
Booking.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });
