export const fetchPopularThreads = async ([after, before, count]: PopularThreadsArgs): Promise<PopularThreadsResponse> => {
  const baseUrl = 'https://www.reddit.com/r/popular.json';
  //const baseUrl = 'https://www.reddit.com/r/all/top.json';
  const queryString = !after && !before ? ''
  : !after && before ? `?before=${before}&count=${count}`
  : after && !before ? `?after=${after}&count=${count}`
  : '';
  const response: Response = await fetch(baseUrl + queryString);
  const json: PopularJsonResponse = await response.json();
  const popularThreads: Subreddit[] = json.data.children.map((sub: Subreddit) => {
    return {
      subreddit: 'r/' + sub.data.subreddit,
      created: new Date(sub.data.created).toDateString(),
      url: sub.data.permalink.slice(0, -1),
      body: sub.data.selftext,
      title: sub.data.title,
      author: sub.data.author,
      ups: sub.data.ups,
      downs: sub.data.downs,
      thumbnail: sub.data.thumbnail,
      src: sub.data.url,
      //src: sub.data.preview?.images[0].source.url,
      media: sub.data.secure_media?.reddit_video?.fallback_url || null
    };
  });

  return { 
    popularThreads,
    pagination : {
        countOffset: count + 25,
        afterQuery: json.data.after, 
        beforeQuery: json.data.before
    }
  };
}

export const fetchSingleThread = async (subreddit: string, id: string, threadTitle: string) => {
  const response = await fetch(`https://www.reddit.com/r/${subreddit}/comments/${id}/${threadTitle}.json`);
  const json = await response.json();
  const { author, title, ups, downs, selftext } = json[0].data.children[0].data;
  const comments = json[1].data.children.map(({ data }: { data: any }) => {
    return {
      id: data.id,
      title: data.title,
      author: data.author,
      body: data.body,
      votes: data.ups - data.downs,
      numberOfReplies: data.replies ? data.replies.data.children.length : 0,
      replies: data.replies || []
    }
  });

  return { author, title, ups, downs, comments, selftext };
}

export const searchSubreddits = async (searchTerm: string) => {
  const url: string = `https://www.reddit.com/search.json?q=${searchTerm}&type=sr`;
  //const url = `https://www.reddit.com/r/all/${searchTerm}.json`; // searches threads
  const data = await fetch(url);
  const json = await data.json();
  if (!json.data) return [];
  const communities = json.data.children.map(({data}: any) => {
    return data.display_name_prefixed;
  })
  
  return communities;
}

export const fetchSubredditData = async (subreddit: string) => {
  const url = `https://www.reddit.com/r/${subreddit}.json`;
  const response = await fetch(url);
  const json = await response.json();
  return json.data.children.map(({data}: any) => {
    return {
      selftext: data.selftext,
      title: data.title,
      author: data.author,
      votes: data.ups - data.downs,
      url: data.url
    }
  })
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
*/