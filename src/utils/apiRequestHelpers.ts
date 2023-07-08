import { computeElapsedTime } from "./computeElapsedTime";
import { formatSubscriberCount } from "./formatSubscriberCount";

export const transformSubredditThreads = (json: PopularThreadsJson): Thread[] => {
    return json.data.children.map((thread: ThreadJson) => {
      return {
        id: thread.data.id,
        createdAt: computeElapsedTime(thread.data.created_utc),
        subreddit: 'r/' + thread.data.subreddit,
        url: thread.data.permalink.slice(0, -1),
        selftext: thread.data.selftext_html,
        title: thread.data.title,
        author: thread.data.author,
        ups: thread.data.ups,
        downs: thread.data.downs,
        thumbnail: thread.data.thumbnail,
        src: thread.data.url,
        media: (thread.data.secure_media as VideoMedia)?.reddit_video?.dash_url || null
      };
    });
  }
  
  export const transformSearchResult = (posts: PostJson[]): Post[] => {
    return posts.map(({ data }: PostJson) => {
      return {
          id: data.id,
          createdAt: computeElapsedTime(data.created_utc),
          newThread: data.title,
          originalPost: data.link_title,
          author: data.author,
          body: data.body_html,
          votes: data.ups - data.downs,
          link: data.permalink,
          subreddit: data.subreddit_name_prefixed
      }
    });
  }
  
  export const transformSubredditBody = ({ data }: SubredditBodyJson): SubredditBodyResponse => {
    return {
      online: formatSubscriberCount(data.active_user_count),
      members: formatSubscriberCount(data.subscribers),
      createdAt: new Date(data.created_utc * 1000).getFullYear(),
      description: data.description_html,
      publicDescription: data.public_description_html,
      category: data.advertiser_category,
      banner: data.banner_img,
      header: data.header_img,
      icon: data.icon_img
    }
  }

  export const throwFetchError = (json: ErrorJson, subreddit: string) => {
    if (json?.message?.toLowerCase() === 'forbidden' || json?.error === 403) {
      throw new Error(`r/${subreddit} is a private community. Only approved members can view and take part in its discussions.`);
    }
    throw new Error('Unable to fetch subreddit description.');
  }

  export const throwSearchError = (response: Response) => {
    let msg;
    switch (response.status) {
      case 403:
        msg = 'This account has been suspended';
        break;
      case 404:
        msg = 'I cannot find an account that matches that username';
        break;
      default:
        msg = 'Unable to retrieve data'
    }
    throw new Error(`${msg}. Status code: ${response.status}.`);
  }