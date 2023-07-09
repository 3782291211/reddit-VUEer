import { 
  transformSearchResult, 
  transformSubredditBody, 
  transformSubredditThreads,
  throwFetchError,
  throwSearchError
} from "./apiRequestHelpers";

import { computeElapsedTime } from "./computeElapsedTime";

export const fetchPopularThreads = async ([after, before, count, sortBy, subreddit]: PopularThreadsArgs): Promise<PopularThreadsResponse> => {
  let baseUrl;
  if (subreddit) {
    baseUrl = `https://www.reddit.com/r/${subreddit}.json?limit=25`;
  } else if (sortBy === 'popular') {
    baseUrl = 'https://www.reddit.com/r/popular.json?limit=25';
  } else {
    baseUrl = `https://www.reddit.com/r/all/${sortBy}.json?limit=25`;
  }

  const queryString = !after && !before ? ''
  : !after && before ? `&before=${before}&count=${count}`
  : after && !before ? `&after=${after}&count=${count}`
  : '';

  const response = await fetch(baseUrl + queryString);
  const json: PopularThreadsJson | ErrorJson = await response.json();
 
  /* The json response might be an error response 
  (if the subreddit is private, for example). */
  if (!(json as PopularThreadsJson).data && subreddit) {
    throwFetchError(json as ErrorJson, subreddit);
  }

  const validResponse = json as PopularThreadsJson;
  const popularThreads: Thread[] = transformSubredditThreads(validResponse);

  return { 
    popularThreads,
    pagination : {
        countOffset: count + 25,
        afterQuery: validResponse.data.after, 
        beforeQuery: validResponse.data.before
    }
  };
}

export const fetchTrendingThreads = async(): Promise<Thread[]> => {
  const response = await fetch('https://www.reddit.com/r/all/.json?source=trending&sort=top&limit=100');
  if (!response.ok) throw new Error('Unable to fetch data.');
  const json: PopularThreadsJson = await response.json();
  return transformSubredditThreads(json).filter((thread: Thread) => {
    return /(.jpg|.png|.gif)$/.test(thread.src);
  });
}

export const fetchSingleThread = async (subreddit: string, id: string, threadTitle: string): Promise<SingleThreadResponse> => {
    const response = await fetch(`https://www.reddit.com/r/${subreddit}/comments/${id}/${threadTitle}.json`);
    if (!response.ok) throw new Error('Unable to fetch data.');
    
    const json: SingleThreadJson = await response.json();
    const data = json[0].data.children[0].data;
    
    const comments: FormattedComment[] = json[1].data.children.map(({ data }: CommentData) => {
      return {
        id: data.id,
        createdAt: computeElapsedTime(data.created_utc),
        author: data.author,
        body: data.body_html,
        votes: data.ups - data.downs,
        numberOfReplies: data.replies ? data.replies.data.children.length : 0,
        replies: data.replies || []
      }
    });

    return {
      createdAt: computeElapsedTime(data.created_utc),
      author: data.author, 
      title: data.title, 
      votes: Number(data.ups) + Number(data.downs),
      comments, 
      selftext: data.selftext_html, 
      sub: data.subreddit_name_prefixed, 
      url: data.url,
      media: data.secure_media,
      images: data.media_metadata ? Object.values(data.media_metadata).map((item: MediaData) => item.s.u) : [],
      preview: data.preview?.images?.[0].source?.url || '',
      embed: (data.secure_media_embed as { content: string, [key: string]: any})?.content || ''
    };
}

export const searchSubreddits = async (searchTerm: string): Promise<string[]> => {
  const url = `https://www.reddit.com/search.json?q=${searchTerm}&type=sr`;
  const data = await fetch(url);
  const json: SearchSubredditsJson = await data.json();
  if (!json.data) return [];

  const communities: string[] = json.data.children.map(({ data }: SubredditJson) => {
    return data.display_name_prefixed;
  })
  return communities;
}

export const searchThreads = async (searchTerm: string): Promise<SearchThreadsResponse | []> => {
  const url: string = `https://www.reddit.com/r/all/search.json?q=${searchTerm}`;
  const response = await fetch(url);
  const json: SearchThreadsJson = await response.json();
  if (!json.data) return [];
  return json.data.children.map(({ data }: ThreadJson) => {
    return {
      id: data.id,
      title: data.title,
      link: data.permalink
    }
  });
}

export const fetchSubredditBody = async (subreddit: string): Promise<SubredditBodyResponse> => {
  const aboutURL = `https://www.reddit.com/r/${subreddit}/about.json`;
  const response = await fetch(aboutURL);
  const json: SubredditBodyJson | ErrorJson = await response.json();
  if (!(json as SubredditBodyJson).data) throwFetchError(json as ErrorJson, subreddit);
  return transformSubredditBody(json as SubredditBodyJson);
}

export const fetchPopularSubreddits = async(): 
Promise<{ icon: string, subredditName: string }[]> => {
  const url = 'https://www.reddit.com/subreddits/popular.json';
  const response = await fetch(url);
  const json: PopularSubredditsJson = await response.json();
  return json.data.children.map(({ data } : SubredditJson) => ({
    icon: data.icon_img,
    subredditName: data.display_name_prefixed
  }));
}

export const searchUser = async (username: string): Promise<SearchUserResponse> => {
  const response = await Promise.all([
    fetch(`https://www.reddit.com/user/${username}.json?limit=25`),
    fetch(`https://www.reddit.com/user/${username}/about.json`)
  ]);

  if (!response[0].ok || !response[1].ok) throwSearchError(response[0]);
  const json: SearchUserJson = await Promise.all([response[0].json(), response[1].json()]);
  const posts: Post[] | [] = json[0].data?.children.length ? transformSearchResult(json[0].data.children) : [];

  if (!json[1].data.subreddit) throw new Error(`Unable to retreive data for user "${username}".`);
  
  const profileData: ProfileData = {
    icon: json[1].data.icon_img || json[1].data.subreddit.icon_img || '',
    name: json[1].data.subreddit.display_name_prefixed || json[1].data.name,
    createdAt: new Date(json[1].data.created_utc * 1000).toDateString().slice(4),
    karma: json[1].data.total_karma,
    subscribers: json[1].data.subscribers || 0,
    banned: json[1].data.subreddit.user_is_banned,
    isPremium: json[1].data.is_gold,
    isVerified: json[1].data.verified
  };

  return { 
    posts,
    profileData,
    pagination : {
        countOffset: json[0].data.dist as number,
        afterQuery: json[0].data.after, 
        beforeQuery: json[0].data.before
    }
  };
}

export const searchUserWithPagination = async ([after, before, count, username]: SearchUserPosts): Promise<PaginateUserPosts> => {
  const queryString = !after && !before ? ''
  : !after && before ? `&before=${before}&count=${count}`
  : after && !before ? `&after=${after}&count=${count}`
  : '';

  const baseUrl = `https://www.reddit.com/user/${username}.json?limit=25`;
  const response = await fetch(baseUrl + queryString);
  const json: PostsJson = await response.json();

  return {
    posts: transformSearchResult(json.data.children),
    pagination: {
      countOffset: (json.data.dist as number) + count,
      afterQuery: json.data.after, 
      beforeQuery: json.data.before
    }
  }
}