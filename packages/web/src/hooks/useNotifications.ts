import useHttp from './useHttp';

type Notification = {
  category: string;
  created_at: string;
  content: string;
};

type NotificationResponse = {
  data: Notification[] | null;
};

export const useNotifications = (): NotificationResponse => {
  const { get } = useHttp();

  const { data: _data } = get('notification', {
    refreshInterval: 5000,
  });

  return {
    data: _data?.message?.Items ?? null,
  };
};
