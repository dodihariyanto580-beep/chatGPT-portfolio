export const isBefore = (date: string, compareTo: string) => new Date(date).getTime() < new Date(compareTo).getTime();

export const isAfter = (date: string, compareTo: string) => new Date(date).getTime() > new Date(compareTo).getTime();

export const isPastDue = (date: string) => new Date(date).getTime() < Date.now();

export const formatIsoDate = (date: Date | number | string) => new Date(date).toISOString();
