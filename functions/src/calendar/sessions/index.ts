import {createMetricsRouter} from '../../lib/routers';
import * as sessionsController from '../../controllers/sessions';
import ical from 'ical-generator';
import dayjs from 'dayjs';
import {getExerciseById} from '../../lib/exercise';
import i18next from '../../lib/i18n';

const router = createMetricsRouter();

export const sessionsRouter = router.get('/', async ({res}) => {
  const sessions = await sessionsController.getUpcomingPublicSessions();
  const t = i18next.getFixedT(null, 'Component.AddToCalendar');

  const calendar = ical({
    name: 'Aware - Public Sessions',
    ttl: 60 * 60 * 6, // Every 6 hours
  });

  sessions.forEach(session => {
    const exercise = getExerciseById(session.exerciseId);
    const start = session.startTime.toDate();

    calendar.createEvent({
      start,
      end: dayjs(start)
        .add(exercise?.duration || 30, 'minutes')
        .toDate(),
      summary: t('title', {name: exercise?.name}),
      description: t('notes', {
        name: exercise?.name,
        host: session.hostProfile.displayName,
        url: session.link,
        interpolation: {escapeValue: false},
      }),
      location: t('location'),
      url: session.link,
    });
  });

  calendar.serve(res);
});
