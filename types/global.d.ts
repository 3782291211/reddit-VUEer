export {}

declare global {
  type stringOrNull = string | null;

  export type ThreadPreviewProps = {
    item: Subreddit
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
      secure_media: {
      //   oembed: {
      //     description: string,
      //     html: string,
      //     provider_url: string,
      //     title: string,
      //     [key: string] : any
      //   },
      //   type: string
      // } | {
        reddit_video: {
          fallback_url: string,
          [key: string]: any
        }
      } | null
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

  export type Comment = {
    kind: string,
    data: {
      id: string,
      author: string,
      body: stringOrNull,
      ups: number,
      downs: number,
      replies: {
        kind: string,
        data: BaseDataStructure & {
          children: (Comment | unknown)[]
        }
      } | "",
    }
  }

  /* This array is what we receive in the API JSON response */
  export type SingleThreadJson = [
    ThreadBodyJson,
    {
      kind: string,
      data: BaseDataStructure & {
        children: Comment[]
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
    replies: {
      kind: string,
      data: BaseDataStructure & {
        children: (Comment | unknown)[]
      }
    } | []
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
    images: unknown,
    preview: string,
    embed: string
  }

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
    {
      kind: string,
      data: BaseDataStructure & {
        children: {
            kind: string,
            data: {
              icon_img: 
            }
          }[]
      }
    },
    {
      kind: string,
      data: {}
    }
  ]

  export type SearchUserPosts = [stringOrNull, stringOrNull, number, string];

  export type Post = {
    id: string,
    newThread: stringOrNull,
    originalPost: stringOrNull,
    author: string,
    body: string,
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
  }

  export type SearchUserResponse = {
    posts: Post[] | [],
    profileData: ProfileData,
    pagination: Pagination
  }

  export type PaginateUserSeach = {
    posts: Post[],
    pagination: Pagination
  }

  /////////////////////////////////////////////////////////////////////////////////////
  /* These 2 types are used for checking the number of replies within the NestedReplies component */

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