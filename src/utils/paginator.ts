import { fetchPopularThreads, searchUser } from "./apiRequests";

export const paginate = async (
  pagination: Pagination, 
  e: MouseEvent, 
  sortBy: string | null, 
  subreddit: string | null,
  username: string | null
  ): Promise<PopularThreadsResponse | SearchUserResponse | null> => {

    const action: string = (e.target as HTMLButtonElement).name;
    if (action === 'previous' && pagination.countOffset <= 25) return null;
    
    const args: PopularThreadsArgs = [
      action === 'previous' ? null : pagination.afterQuery,
      action === 'previous' ? pagination.beforeQuery : null,
      pagination.countOffset,
      null,
      null
    ];

    let newCountOffset: number = 0;
    if (action === 'next') {
      newCountOffset = 25;
    } else if (action === 'previous') {
      newCountOffset = -25;
    }

    let response;
    if (sortBy && !subreddit) {
      args[3] = sortBy;
      args[4] = null;
      response = await fetchPopularThreads(args);
    } else if (subreddit) {
      args[3] = null;
      args[4] = subreddit;
      response = await(fetchPopularThreads(args));
    } else {
      response = await searchUser([args[0], args[1], args[2], username as string]);
      return { 
        posts: response.posts,
        profileData: response.profileData,
        pagination : {
            countOffset: pagination.countOffset + newCountOffset,
            afterQuery: response.pagination.afterQuery, 
            beforeQuery: response.pagination.beforeQuery 
        }
      };
    }
  
   

    return { 
      popularThreads: response.popularThreads,
      pagination : {
          countOffset: pagination.countOffset + newCountOffset,
          afterQuery: response.pagination.afterQuery, 
          beforeQuery: response.pagination.beforeQuery 
      }
    };
}

/*
Intact version

export const paginate = async (
  pagination: Pagination, 
  e: MouseEvent, 
  sortBy: string | null, 
  subreddit: string | null
  ): Promise<PopularThreadsResponse | null> => {

    const action: string = (e.target as HTMLButtonElement).name;
    if (action === 'previous' && pagination.countOffset <= 25) return null;
 
    const args: PopularThreadsArgs = [
      action === 'previous' ? null : pagination.afterQuery,
      action === 'previous' ? pagination.beforeQuery : null,
      pagination.countOffset,
      null,
      null
    ];

    let response;
    if (sortBy && !subreddit) {
      args[3] = sortBy;
      args[4] = null;
      response = await fetchPopularThreads(args);
    } else { // subreddit param cannot be null here, so no need for an else if statement
      args[3] = null;
      args[4] = subreddit;
      response = await(fetchPopularThreads(args));
    }
  
    let newCountOffset: number = 0;
    if (action === 'next') {
      newCountOffset = 25;
    } else if (action === 'previous') {
      newCountOffset = -25;
    }

    return { 
      popularThreads: response.popularThreads,
      pagination : {
          countOffset: pagination.countOffset + newCountOffset,
          afterQuery: response.pagination.afterQuery, 
          beforeQuery: response.pagination.beforeQuery 
      }
    };
}

*/