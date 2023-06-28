export {}

declare global {
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
    afterQuery: string | null,
    beforeQuery: string | null,
    countOffset: number
  }

  export type PopularThreadsArgs = [string | null, string | null, number];

  export type PopularThreadsResponse = {
    popularThreads: Subreddit[],
    pagination : Pagination
  }
}