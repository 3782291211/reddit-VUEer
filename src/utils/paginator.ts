import { fetchPopularThreads, searchUserWithPagination } from "./apiRequests";

export const paginate = async (
  prevPagination: Pagination, 
  e: MouseEvent, 
  sortBy: string | null, 
  subreddit: string | null,
  username: string | null
  ): Promise<PopularThreadsResponse | PaginateUserPosts | null> => {

    const action: string = (e.target as HTMLButtonElement).name;
    if (action === 'previous') {
      if (!prevPagination.beforeQuery || prevPagination.countOffset <= 25) return null;
    }
    if (action === 'next' && !prevPagination.afterQuery) return null;
    
    const args: PopularThreadsArgs = [
      action === 'previous' ? null : prevPagination.afterQuery,
      action === 'previous' ? prevPagination.beforeQuery : null,
      prevPagination.countOffset,
      null,
      null
    ];

    let newCountOffset: number = 0;
    if (action === 'next') {
      newCountOffset = 25;
    } else if (action === 'previous') {
      newCountOffset = -25;
    }

    let response: PopularThreadsResponse | PaginateUserPosts;
    if (sortBy && !subreddit) {
      args[3] = sortBy;
      args[4] = null;
      response = await fetchPopularThreads(args);
    } else if (subreddit) {
      args[3] = null;
      args[4] = subreddit;
      response = await(fetchPopularThreads(args));
    } else {
      response = await searchUserWithPagination([args[0], args[1], args[2], username as string]);
      response.pagination.countOffset = prevPagination.countOffset + newCountOffset;
      return response;
    }
    response.pagination.countOffset = prevPagination.countOffset + newCountOffset;
    return response;
}