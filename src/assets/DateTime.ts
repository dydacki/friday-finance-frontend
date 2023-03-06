import  moment from 'moment';

export function dateTimeNow(format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  return moment().format(format);
}