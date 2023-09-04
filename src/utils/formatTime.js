import { format, formatDistanceToNow } from 'date-fns';
import arSA from 'date-fns/locale/ar-SA';
import enUS from 'date-fns/locale/en-US';

export function fDate(date) {
  return format(new Date(date), 'dd MMMM yyyy');
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date, locale) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: locale === 'English' ? enUS : arSA,
  });
}
