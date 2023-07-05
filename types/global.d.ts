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
}