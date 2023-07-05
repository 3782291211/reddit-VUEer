export const transformSubredditThreads = (json: any) => {
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
  
  export const transformSearchResult = (posts: Post[]) => {
    return posts.map(({ data }: any) => {
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
    });
  }
  
  export const transformSubredditBody = ({ data }: any) => {
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