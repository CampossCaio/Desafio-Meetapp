
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import Mail from '../../lib/Mail';
import User from '../models/User';


class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: { user_id: req.userId },
      attributes: [],
      include: [
        {
          model: Meetup,
          as: 'meetup',
          order: ['date', 'DESC'],
          attributes: ['past', 'id', 'title', 'description', 'location', 'date'],
        },
      ],
    });


    return res.json(subscriptions);
  }

  /**
    * create subscription
   */
  async store(req, res) {
    const user = await User.findByPk(req.userId);
    const { meetup_id } = req.body;

    const checkMeetup = await Meetup.findByPk(meetup_id, {
      include: { model: User, as: 'user' },
    });

    if (!checkMeetup) {
      return res.status(401).json({ error: 'Meetup does not exist' });
    }

    if (checkMeetup.past) {
      return res.status(401).json({ error: 'You can not subscribe to past meetups ' });
    }

    if (checkMeetup.user_id === req.userId) {
      return res.status(401).json({ error: 'You only can subscription on meetup of ouher user' });
    }

    // Verificar se subscription.meetup_id === checkMeetup.id -> Ja está inscrito
    // ou se meetup.date === checkMeetup.date

    const checkDate = await Subscription.findOne({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          where: {
            [Op.or]: [
              { date: checkMeetup.date },
              { id: checkMeetup.id },
            ],
          },
        },
      ],
    });


    if (checkDate) {
      return res.json({
        error: 'You can not subscrible to meetups that happen at the same time or are already subscribled ',
      });
    }

    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id,
    });

    await Mail.sendMail({
      to: 'bar@example.com, baz@example.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: `${user.name}`, // plain text body
      // html body
    });
    console.log('Email enviado!');

    return res.json(subscription);
  }
}

export default new SubscriptionController();
