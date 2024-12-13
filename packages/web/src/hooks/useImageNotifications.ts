import useHttp from './useHttp';

type ImageNotification = {
  category: string;
  created_at: string;
  image_url: string;
  url: string;
};

type NotificationReponse = {
  data: ImageNotification[] | null;
};

export const useImageNotifications = (): NotificationReponse => {
  const { get } = useHttp();

  const { data: _data } = get('image-notification', {
    refreshInterval: 5000,
  });

  return {
    data: _data?.message?.Items ?? null,
  };
};
