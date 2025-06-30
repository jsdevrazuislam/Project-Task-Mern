import NodeCache from 'node-cache';
export const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

export const clearEventCache = () => {
  const keys = cache.keys().filter(k => k.startsWith('events_page_'));
  keys.forEach(k => cache.del(k));
};
export const clearMyEventsCache = (userId: string) => {
  const keys = cache.keys().filter((key) => key.startsWith(`my_events_${userId}_`));
  keys.forEach((key) => cache.del(key));
};