export const computeElapsedTime = (seconds: number): string => {
  const elapsedSeconds = (Date.now() / 1000) - seconds;
  const secondsToTimeSpan = 
    (divisor: number) => Math.floor(elapsedSeconds / divisor);

  const elapsedTimeSpans: [string, number][] = [
    ['years', secondsToTimeSpan(3.1536e7)],
    ['months', secondsToTimeSpan(2.592e6)], 
    ['weeks', secondsToTimeSpan(6.048e5)], 
    ['days', secondsToTimeSpan(8.64e4)], 
    ['hours', secondsToTimeSpan(3.6e3)],
    ['minutes', secondsToTimeSpan(60)], 
    ['seconds', secondsToTimeSpan(1)]
  ]

  for (const timeSpan of elapsedTimeSpans) {
    if (timeSpan[1] === 0) continue;
    if (timeSpan[1] === 1) {
      return `${timeSpan[1]} ${timeSpan[0].slice(0, -1)}`;
    } else {
      return `${timeSpan[1]} ${timeSpan[0]}`;
    }
  }

  return '0 seconds';
}