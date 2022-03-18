import * as Notifications from 'expo-notifications';
import moment from 'moment';

export async function schedulePushNotification(
    titlemsg: string,
    conteudomsg: string,
    day: number,
    month: number,
    year?: number,
    hour?: number,
    minutes?: number
  ) {

    const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: titlemsg,
          body: conteudomsg,          
        },
        trigger: {
          timezone: 'GMT -3',
          month: month,
          day: day,
          year: year == null ? parseInt(moment().format('YYYY')) : year,
          hour: hour == null ? 10 : hour,
          minute: minutes == null ? 0 : minutes,
          repeats: true,
        },
      });

      return id;
    
  }