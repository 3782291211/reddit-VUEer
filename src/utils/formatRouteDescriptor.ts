import { formatPermalink } from "./formatURL";

export const formatRouteDescriptor = (routeName: string, link: string) => {
  switch (routeName) {
    case 'thread':
      return {name: 'thread', params: { subreddit: formatPermalink(link)[1], threadId: formatPermalink(link)[2], threadTitle: formatPermalink(link)[3] }};
    case 'subreddit':
      return {name: 'subreddit', params: { subreddit: formatPermalink(link)[1] }};
    default:
      return {name: 'popular'};
  }
}