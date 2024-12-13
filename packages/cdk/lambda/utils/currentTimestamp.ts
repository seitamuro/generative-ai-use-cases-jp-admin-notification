export const currentTimestamp = (): string => {
  const timestamp = new Date(Date.now()).toLocaleDateString('ja-JP', {
    timeZone: 'Asia/Tokyo',
  });
  console.log('currentTimestamp: ', timestamp);

  return timestamp;
};
