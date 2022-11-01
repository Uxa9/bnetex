import { format } from 'date-fns';

export const formatDate = (date: Date, showTime?: boolean) => 
    format(date, `yyyy/MM/dd${ showTime ? ' HH:mm': ''}`);

