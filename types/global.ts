export {}

declare global {
  type stringOrNull = string | null;

  export type ThreadPreviewProps = {
  }

  export type ErrorJson = {
    reason: string,
    error: number,
    message: string
  }

  /* JSON data structure common to most response types from the API */
  type BaseDataStructure = {
    after: stringOrNull,
    before: stringOrNull,
    dist: number | null,
    geo_filter: string,
    modhash: string
  }

  /* JSON response returnd by initial fetch in fetchPopularThreads */
  export type PopularThreadsJson = { 
    data: BaseDataStructure & {
      children: ThreadJson[],
    }, 
    kind: string 
  }

  export type ThreadJson = {
    kind: string,
    data: {
      id: string,
      subreddit: string,
      permalink: string,
      selftext_html: stringOrNull,
      title: string,
      author: string,
      ups: number,
      downs: number,
      thumbnail: string,
      url: string,
      secure_media: VideoMedia | EmbedMedia | null
    }
  }

  export type EmbedMedia = {
    oembed: {
      description: string,
      html: string,
      provider_url: string,
      title: string,
      [key: string] : any
    },
    type: string
  }

  export type VideoMedia = {
    reddit_video: {
      fallback_url: string,
      [key: string]: any
    }
  }

  /* An array of formatted Thread objects is provided to the view */
  export type Thread = {
    id: string,
    subreddit: string,
    url: string,
    selftext: stringOrNull,
    title: string,
    author: string,
    ups: number,
    downs: number,
    thumbnail: string,
    src: string,
    media: stringOrNull
  };
  
  export type PopularThreadsArgs = [stringOrNull, stringOrNull, number, stringOrNull, stringOrNull];
  
  export type PopularThreadsResponse = {
    popularThreads: Thread[],
    pagination : Pagination
  }

  export type Pagination = {
    afterQuery: stringOrNull,
    beforeQuery: stringOrNull,
    countOffset: number
  }

  ////////////////////////////////////////////////////////////////////////
  /* Single thread JSON response */
  type ThreadBodyJson = {
    kind: string,
    data: BaseDataStructure & {
      children: [
        {
          kind: string,
          data: {
            author: string,
            title: string,
            ups: number,
            downs: number,
            selftext_html: stringOrNull,
            subreddit_name_prefixed: string,
            url: string,
            secure_media: {
              reddit_video: {
                fallback_url: string,
                [key: string]: any
              }
            } | null,
            secure_media_embed: {
              content: string,
              [key: string]: any
            } | {},
            media_metadata?: {
              [key: string]: {
                status: string,
                e: string,
                id: string,
                m: string,
                p: {
                  u: string,
                  x: number,
                  y: number
                }[],
                s: {
                  u: string,
                  x: number,
                  y: number
                }
              }
            },
            preview: {
              enabled: boolean,
              images: [{
                source: {
                  url: string,
                  height: number,
                  width: number
                },
                [key: string]: any
              }];
            }
          }
        }
      ]
    }
  }

  export type CommentData = {
    kind: string,
    data: {
      id: string,
      author: string,
      body: stringOrNull,
      ups: number,
      downs: number,
      body_html: string,
      replies: NestedReplies | "",
      [key: string]: any
    }
  }

  export type NestedReplies = {
    kind: string,
    data: BaseDataStructure & {
      children: CommentData[]
    }
  }

  /* This array is what we receive in the API JSON response */
  export type SingleThreadJson = [
    ThreadBodyJson,
    {
      kind: string,
      data: BaseDataStructure & {
        children: CommentData[]
      }
    }
  ]

  /* We format (map) the JSON comments array before we return it to the view */
  export type FormattedComment = {
    id: number,
    author: string,
    body: string,
    votes: number,
    numberOfReplies: number,
    replies: NestedReplies | []
  }

  /* This is the formatted data we send to the view */ 
  export type SingleThreadResponse = {
    author: string,
    title: string,
    votes: number,
    comments: FormattedComment[],
    selftext: stringOrNull,
    sub: string,
    url: string,
    media: {
      reddit_video: {
        fallback_url: string,
        [key: string]: any
      }
    } | null,
    images: string[],
    preview: string,
    embed: string
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /* These 2 types are used for checking the number of replies within the NestedReplies component */

  //WE MIGHT CAN DELET THESE TWO

  export type JsonComment = {
    author: string,
    body: string,
    id: string,
    numberOfReplies: number,
    replies: {
      kind: string,
      data: {
        [key: string]: any,
        children: { 
          kind: string,
          data: { [key: string]: any }
        }[]
      }
    },
    title: string | undefined,
    votes: number
  }

  export type SingleComment = { 
    kind: string,
    data: { 
      [key: string]: any }
    };

  ///////////////////////////////////////////////////////////////////////////
  /* Search subreddits */
  export type SubredditJson = {
    kind: string,
    data: {
      display_name_prefixed: string,
      [Key: string]: any
    }
  }

  export type SearchSubredditsJson = {
    kind: string,
    data: BaseDataStructure & {
      children: SubredditJson[]
    }
  } | Record<string, never>;

  export type PopularSubredditsJson = SearchSubredditsJson;

  ////////////////////////////////////////////////////////////////////////////
  /* Search threads */
  export type SearchThreadsJson = { 
    data: BaseDataStructure & {
      children: ThreadJson[] | [],
      facets: Record<string, never>
    }, 
    kind: string 
  }

  /* This is the data being sent to the view */
  export type SearchThreadsResponse = {
    id: string,
    title: string,
    link: string
  }[];

   ////////////////////////////////////////////////////////////////////////////
  /* Subreddit body */
  export type SubredditBodyJson = {
    kind: string,
    data: {
      active_user_count: number,
      description_html: stringOrNull,
      public_description_html: string,
      advertiser_category: string,
      banner_img: stringOrNull,
      header_img: stringOrNull,
      icon_img: stringOrNull
    }
  }

   /* This is the data being sent to the view */
   export type SubredditBodyResponse = {
     subscribers: number,
     description: stringOrNull,
     publicDescription: string,
     category: string,
     banner: stringOrNull,
     header: stringOrNull,
     icon: stringOrNull
   }
  

  ///////////////////////////////////////////////////////////////////////////
  /* Search user */
  export type SearchUserJson = [
    PostsJson,
    {
      kind: string,
      data: {
        total_karma: number,
        subscribers?: number,
        name: string,
        is_gold: boolean,
        verified: boolean,
        icon_img: stringOrNull,
        subreddit?: {
          icon_img: stringOrNull,
          display_name_prefixed: string,
          user_is_banned: boolean | string | null
        }
      }
    }
  ]

  export type PostsJson = {
    kind: string,
    data: BaseDataStructure & {
      children: PostJson[]
    }
  }

  export type PostJson = {
    kind: string,
    data: {
      id: string,
      title: string,
      link_title: string,
      author: string,
      body_html: stringOrNull,
      ups: number,
      downs: number,
      permalink: string,
      subreddit_name_prefixed: string
    }
  }

  export type Post = {
    id: string,
    newThread: stringOrNull,
    originalPost: stringOrNull,
    author: string,
    body: stringOrNull,
    votes: number,
    link: string,
    subreddit: string
  }

  export type ProfileData = {
    icon: string,
    name: string,
    karma: number,
    subscribers: number | null,
    banned: null | string | boolean,
    isPremium: boolean,
    isVerified: boolean
  }

  export type SearchUserPosts = [stringOrNull, stringOrNull, number, string];

  export type SearchUserResponse = {
    posts: Post[] | [],
    profileData: ProfileData,
    pagination: Pagination
  }

  export type PaginateUserPosts = { 
    posts: Post[], 
    pagination: Pagination 
  }

  export type PaginateUserSeach = {
    posts: Post[],
    pagination: Pagination
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /* Subreddit view */
  export type SubredditBody = {
    banner: string,
    category: string,
    description: stringOrNull,
    header: string,
    headerImg: string,
    icon: string,
    publicDescription: stringOrNull,
    subscribers: number
  };
}