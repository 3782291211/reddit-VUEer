export const formatSubscriberCount = (subsCount: number): string => {
  switch (true) {
    case subsCount < 1e4:
      return subsCount.toString();
    case subsCount < 1e5:
      return `${Number(subsCount.toPrecision(2))/1e3}k`;
    case subsCount < 9.995e5:
      return `${Number(subsCount.toPrecision(3))/1e3}k`;
    case subsCount < 9.95e8:
      return `${Number(subsCount.toPrecision(3))/1e6}M`;
    default:
      return subsCount.toString();
  }
}