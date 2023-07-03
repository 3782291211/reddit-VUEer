const transformSubredditThreads = (json: any) => {
  return json.data.children.map((sub: Subreddit) => {
    return {
      id: sub.data.id,
      subreddit: 'r/' + sub.data.subreddit,
      url: sub.data.permalink.slice(0, -1),
      selftext: sub.data.selftext_html,
      title: sub.data.title,
      author: sub.data.author,
      ups: sub.data.ups,
      downs: sub.data.downs,
      thumbnail: sub.data.thumbnail,
      src: sub.data.url,
      media: sub.data.secure_media?.reddit_video?.fallback_url || null
    };
  });
}

const transformSubredditBody = ({ data }: any) => {
  return {
    subscribers: data.active_user_count,
    description: data.description_html,
    headerImg: data.header_img,
    publicDescription: data.public_description_html,
    category: data.advertiser_category,
    banner: data.banner_img,
    header: data.header_img,
    icon: data.icon_img
  }
}

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

/*

Intact function

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

*/

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

/* Intact function

export const searchUser = async (searchTerm: string) => {
  const response = await Promise.all([
    fetch(`https://www.reddit.com/user/${searchTerm}.json`),
    fetch(`https://www.reddit.com/user/${searchTerm}/about.json`)
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
  const posts = json[0].data.children.length ? json[0].data.children.map(({ data }: any) => {
    return {
        id: data.id,
        newThread: data.title,
        originalPost: data.link_title,
        author: data.author,
        body: data.body_html,
        votes: data.ups - data.downs,
        link: data.permalink,
        subreddit: data.subreddit_name_prefixed
    }
  }) : [];

  const profileData = {
    icon: json[1].data.icon_img || json[1].data.subreddit.icon_img,
    name: json[1].data.subreddit.display_name_prefixed || json[1].data.name,
    karma: json[1].data.link_karma,
    subscribers: json[1].data.subscribers,
    banned: json[1].data.user_is_banned
  };

  return { posts, profileData };
}*/

export const searchUser = async ([after, before, count, username]: SearchUserPosts): Promise<SearchUserResponse> => {
  const baseUrl = `https://www.reddit.com/user/${username}.json?limit=25`;

  const queryString = !after && !before ? ''
  : !after && before ? `&before=${before}&count=${count}`
  : after && !before ? `&after=${after}&count=${count}`
  : '';

  const response = await Promise.all([
    fetch(baseUrl + queryString),
    fetch(`https://www.reddit.com/user/${username}/about.json`)
  ]);
  
  const json = await Promise.all([response[0].json(), response[1].json()]);
  console.log(json)
  const posts: Post[] | [] = json[0].data.children.length ? json[0].data.children.map(({ data }: any) => {
    return {
        id: data.id,
        newThread: data.title,
        originalPost: data.link_title,
        author: data.author,
        body: data.body_html,
        votes: data.ups - data.downs,
        link: data.permalink,
        subreddit: data.subreddit_name_prefixed
    }
  }) : [];

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
        countOffset: count + 25,
        afterQuery: json[0].data.after, 
        beforeQuery: json[0].data.before
    }
  };
}

/* 
fetch top, best, new, hot:
`https://www.reddit.com/r/all/${filter}.json`

fetch by subreddit:
e.g. subreddit = r/food
`https://www.reddit.com/${subreddit}.json`

fetch subreddit icon image and description:
https://www.reddit.com/r/jokes/about.json

ttps://www.reddit.com/search.json?q=${term}&sort=top`

https://www.reddit.com/${selectedSubreddit.name}/search.json?q=${term}&restrict_sr=1`;

//const baseUrl = 'https://www.reddit.com/r/all/top.json';
*/