import { 
  transformSearchResult, 
  transformSubredditBody, 
  transformSubredditThreads,
} from "./apiRequestHelpers";

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

  const response: Response = await fetch(baseUrl + queryString);
  if (!response.ok) throw new Error(response.statusText || 'Unable to fetch data.');
  const json: PopularJsonResponse = await response.json();
  const popularThreads: Subreddit[] = transformSubredditThreads(json);

  return { 
    popularThreads,
    pagination : {
        countOffset: count + 25,
        afterQuery: json.data.after, 
        beforeQuery: json.data.before
    }
  };
}

export const fetchTrendingThreads = async() => {
  const response = await fetch('https://www.reddit.com/r/all/.json?source=trending&sort=top&limit=100');
  if (!response.ok) throw new Error(response.statusText || 'Unable to fetch data.');
  const json = await response.json();
  return transformSubredditThreads(json).filter((thread: any) => {
    return /(.jpg|.png|.gif)$/.test(thread.src);
  });
}

export const fetchSingleThread = async (subreddit: string, id: string, threadTitle: string) => {
    const response = await fetch(`https://www.reddit.com/r/${subreddit}/comments/${id}/${threadTitle}.json`);
    if (!response.ok) throw new Error(response.statusText || 'Unable to fetch data.');
    const json = await response.json();
    const data = json[0].data.children[0].data;

    const comments = json[1].data.children.map(({ data }: { data: any }) => {
      return {
        id: data.id,
        title: data.title,
        author: data.author,
        body: data.body_html,
        votes: data.ups - data.downs,
        numberOfReplies: data.replies ? data.replies.data.children.length : 0,
        replies: data.replies || []
      }
    });

    return { 
      author: data.author, 
      title: data.title, 
      votes: Number(data.ups) + Number(data.downs),
      comments, 
      selftext: data.selftext_html, 
      sub: data.subreddit_name_prefixed, 
      url: data.url,
      media: data.secure_media,
      images: data.media_metadata ? Object.values(data.media_metadata).map((item: any) => item.s.u) : [],
      preview: data.preview?.images?.[0].source?.url,
      embed: data.secure_media_embed?.content
    };
}

export const searchSubreddits = async (searchTerm: string) => {
  const url: string = `https://www.reddit.com/search.json?q=${searchTerm}&type=sr`;
  const data = await fetch(url);
  const json = await data.json();
  if (!json.data) return [];
  const communities = json.data.children.map(({data}: any) => {
    return data.display_name_prefixed;
  })
  
  return communities;
}

export const searchThreads = async (searchTerm: string) => {
  const url: string = `https://www.reddit.com/r/all/search.json?q=${searchTerm}`;
  const response = await fetch(url);
  const json = await response.json();
  if (!json.data) return [];
  return json.data.children.map((thread: any) => {
    return {
      id: thread.data.id,
      title: thread.data.title,
      link: thread.data.permalink
    }
  });
}

export const fetchSubredditBody = async (subreddit: string) => {
  const aboutURL = `https://www.reddit.com/r/${subreddit}/about.json`;
  const response = await fetch(aboutURL);
  if (!response.ok) throw new Error(response.statusText || 'Unable to fetch data.');
  const json = await response.json();
  return transformSubredditBody(json);
}

export const fetchPopularSubreddits = async() => {
  const url = 'https://www.reddit.com/subreddits/popular.json';
  const response = await fetch(url);
  const json = await response.json();
  return json.data.children.map(({ data } : any) => data.display_name_prefixed);
}

export const searchUser = async (username: string): Promise<SearchUserResponse> => {
  const response = await Promise.all([
    fetch(`https://www.reddit.com/user/${username}.json?limit=25`),
    fetch(`https://www.reddit.com/user/${username}/about.json`)
  ]);

  if (!response[0].ok || !response[1].ok) {
    let msg;
    switch (response[0].status) {
      case 403:
        msg = 'This account has been suspended';
        break;
      case 404:
        msg = 'I cannot find an account that matches that username';
        break;
      default:
        msg = 'Unable to retrieve data'
    }
    throw new Error(`${msg}. Status code: ${response[0].status}.`);
  }
  
  const json = await Promise.all([response[0].json(), response[1].json()]);
  
  const posts: Post[] | [] = json[0].data?.children.length ? transformSearchResult(json[0].data.children) : [];

  const profileData: ProfileData = {
    icon: json[1].data.icon_img || json[1].data.subreddit.icon_img,
    name: json[1].data.subreddit.display_name_prefixed || json[1].data.name,
    karma: json[1].data.total_karma,
    subscribers: json[1].data.subscribers,
    banned: json[1].data.user_is_banned
  };

  return { 
    posts,
    profileData,
    pagination : {
        countOffset: json[0].data.dist,
        afterQuery: json[0].data.after, 
        beforeQuery: json[0].data.before
    }
  };
}

export const searchUserWithPagination = async ([after, before, count, username]: SearchUserPosts) => {
  const queryString = !after && !before ? ''
  : !after && before ? `&before=${before}&count=${count}`
  : after && !before ? `&after=${after}&count=${count}`
  : '';

  const baseUrl = `https://www.reddit.com/user/${username}.json?limit=25`;
  const response = await fetch(baseUrl + queryString);
  const json = await response.json();

  return {
    posts: transformSearchResult(json.data.children),
    pagination: {
      countOffset: json.data.dist + count,
      afterQuery: json.data.after, 
      beforeQuery: json.data.before
    }
  }
}