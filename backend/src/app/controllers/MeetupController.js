/* eslint-disable prefer-destructuring */
/* eslint-disable no-empty */
import {
  parseISO, isBefore,
  startOfDay, endOfDay,
} from 'date-fns';
import * as Yup from 'yup';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import File from '../models/File';
import User from '../models/User';


class MeetupController {
  async index(req, res) {
    const date = parseISO(req.query.date);
    const { page = 1 } = req.query;

    // const resultado = endOfDay(date);
    const meetup = await Meetup.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
      order: ['date'],
      limit: 10,
      attributes: ['id', 'title', 'description', 'location', 'date'],
      offset: (page - 1) * 10,
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['name', 'url', 'path'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
      ],
    });

    res.json(meetup);
  }

  async store(req, res) {
    /**
     * // Validando os dados de entrada
     */
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      date: Yup.string().required(),
      location: Yup.string().required(),
      file_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation failed' });
    }

    const {
      title, description, date, location, file_id,
    } = req.body;

    const hourStart = parseISO(date);

    if (isBefore(hourStart, new Date())) {
      return res.status(401).json({ error: 'Past date are not permited' });
    }

    const meetup = await Meetup.create({
      title,
      description,
      date: hourStart,
      file_id,
      user_id: req.userId,
      location,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    /**
     * Validando os dados de entrada
     */
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      file_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation failed' });
    }
    const checkMeetup = await Meetup.findByPk(req.params.id);

    if (!checkMeetup) {
      return res.status(401).json({ error: 'Meetup does not exist' });
    }

    if (!checkMeetup.user_id === req.userId) {
      return res.status(401).json({ error: 'You have not permission to change this meetup' });
    }

    if (isBefore(checkMeetup.date, new Date())) {
      return res.status(401).json({ error: 'You can not change past meetup ' });
    }

    const meetup = await checkMeetup.update(req.body);

    return res.json(meetup);
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    if (!meetup) {
      res.status(401).json({ error: 'Meetup does not exist' });
    }

    if (!meetup.user_id === req.userId) {
      res.status(401).json({ error: 'You have not permission to cancel this meetup.' });
    }

    if (isBefore(meetup.date, new Date())) {
      res.status(401).json({ error: 'you can not cancel pasts meetups' });
    }
    await meetup.destroy();

    return res.status(200).json({ Message: 'Meetup canceled' });
  }
}

export default new MeetupController();
