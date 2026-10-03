export function entreesDeLaSemaine(dates: string[], maintenant: number) {
  const depuis = maintenant - 7 * 24 * 3600 * 1000;
  return dates.filter((d) => Date.parse(d) >= depuis).length;
}
