export {}

declare global {
  type stringOrNull = string | null;

  export type Subreddit = {
    name: string,
    [key: string]: any
  };

  export type ThreadPreviewProps = {
    item: Subreddit
  }

  export type PopularJsonResponse = { 
    data: {
      [key: string]: any 
    }, 
    kind: string 
  }

  export type Pagination = {
    afterQuery: stringOrNull,
    beforeQuery: stringOrNull,
    countOffset: number
  }

  export type PopularThreadsArgs = [stringOrNull, stringOrNull, number, stringOrNull, stringOrNull];
  export type SearchUserPosts = [stringOrNull, stringOrNull, number, string];

  export type PopularThreadsResponse = {
    popularThreads: Subreddit[],
    pagination : Pagination
  }

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
}