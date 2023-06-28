import { fetchPopularThreads } from "./apiRequests";

export const paginate = async (pagination: Pagination, e: MouseEvent): Promise<PopularThreadsResponse | null> => {
  const action: string = (e.target as HTMLButtonElement).name;
  if (action === 'previous' && pagination.countOffset <= 25) return null;
  const args: PopularThreadsArgs = action === 'previous' ? 
  [null, pagination.beforeQuery, pagination.countOffset] : [pagination.afterQuery, null, pagination.countOffset];
  const response = await fetchPopularThreads(args);
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