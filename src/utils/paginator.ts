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
    
    const args: [ stringOrNull, stringOrNull, number ] = [
      action === 'previous' ? null : prevPagination.afterQuery,
      action === 'previous' ? prevPagination.beforeQuery : null,
      prevPagination.countOffset
    ];

    const newCountOffset: number = action === 'next' ? 25 : -25;

    let response: PopularThreadsResponse | PaginateUserPosts;
    if (sortBy && !subreddit) {
      response = await fetchPopularThreads([...args, sortBy, null]);
    } else if (subreddit) {
      response = await(fetchPopularThreads([...args, null, subreddit]));
    } else {
      response = await searchUserWithPagination([...args, username as string]);
    }
    response.pagination.countOffset = prevPagination.countOffset + newCountOffset;
    return response;
}