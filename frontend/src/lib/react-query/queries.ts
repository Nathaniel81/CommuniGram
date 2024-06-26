import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from "@tanstack/react-query";
import axios from 'axios';
import { 
  Post,
  ICommentPayload
} from "../../types";

import { QUERY_KEYS } from "./queryKeys";


// Users Queries
const getUsers = async (limit?: number) => {
  const response = await axios.get('/api/user', {
    params: {
      limit,
    },
  });
  return response.data;
};
export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),
  });
};

const getSearchedUsers = async (searchTerm: string) => {
  const response = await axios.get(`/api/user/search?query=${searchTerm}`);
  return response.data;
};
export const useGetSearchedUsers = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SEARCHED_USERS, searchTerm],
    queryFn: () => getSearchedUsers(searchTerm),
  });
};

const getUser = async (id: string | undefined) => {
  const response = await axios.get(`/api/user/${id}/`);
  return response.data;
};
export const useGetUser = (id: string | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, id],
    queryFn: () => getUser(id),
  });
};


export const followUserToggle = async (id: string) => {
  const response = await axios.patch(`/api/user/follow/${id}/`);
  return response.data;
}
export const useFollowUserToggle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
    }: {
      id?: string;
    }) => followUserToggle(id ?? ''),
    onSuccess: (data) => {
      console.log(data)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID],
      });
    },
  });
};

const signOutAccount = async () => {
  const response = await axios.post('/api/user/logout/');
  localStorage.removeItem('userInfo');
  return response.data;
};
export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};


//Comment Queries
export const createComment = async (data: ICommentPayload) => {
  const response = await axios.post('/api/post/comment/', data);
  return response.data;
};

export const useCreateComment = () => {
  return useMutation({
    mutationFn: (data: ICommentPayload) => createComment(data),
    onSuccess: (data) => {
    return data;
    },
  });
};


export const likeComment = async (comment_id: number) => {
  const response = await axios.post(`/api/post/comments/${comment_id}/like/`);
  return response.data;
}
export const useLikeComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      comment_id,
    }: {
      comment_id: number;
    }) => likeComment(comment_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID],
      });
    },
  });
};

//Post Queries
export const likePost = async (postId: number) => {
  const response = await axios.post(`/api/post/${postId}/like/`);
  return response.data;
}
export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
    }: {
      postId: number;
    }) => likePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const getRecentPosts = async (): Promise<Post[]> => {
  const config = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  }
  const response = await axios.get<Post[]>('/api/post/recent', config);
  return response.data;
};
export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};

export const unlikePost = async (postId: number) => {
    const response = await axios.post(`/api/post/${postId}/unlike/`);
    return response.data;
};
export const useUnlikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
    }: {
      postId: number;
    }) => unlikePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const savePost = async (postId: number) => {
  const response = await axios.post(`/api/post/${postId}/save/`);
  return response.data;
};
export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId }: { postId: number }) =>
      savePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const deleteSavedPost = async (postId: number) => {
  const response = await axios.post(`/api/post/${postId}/unsave/`);
  return response.data;
};
export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId }: { postId: number }) =>
      deleteSavedPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};


export const getPostById = async (postId: string) => {
  const response = await axios.get(`/api/post/${postId}/`);
  return response.data;
};
export const useGetPostById = (postId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId!),
    enabled: !!postId,
  });
};

export const deletePost = async (postId?: string) => {
  const response = await axios.delete(`/api/post/${postId}/`);
  return response.data;
};
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId }: { postId?: string; }) =>
      deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};


export const getUserPosts = async (userId: string) => {
  const response = await axios.get(`/api/post/user/${userId}/`);
  return response.data;
};
export const useGetUserPosts = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId ?? ''),
    enabled: !!userId,
  });
};


const INFINITE_SCROLL_PAGINATION_RESULTS = 6;
export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: async ({ pageParam = 1 }) => {
      const query =
          `/api/post?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}`
      const { data } = await axios.get(query);
      return data;
  },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.next) {
        return pages.length + 1;
      }
  },
  });
};

export const searchPosts = async (searchTerm: string) => {
  const response = await axios.get(`/api/post/search?query=${searchTerm}`);
  return response.data;
};
export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
}


export const savedPosts = async () => {
  const response = await axios.get(`/api/post/saved`);
  return response.data;
};
export const useSavedPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SAVED_POSTS],
    queryFn: () => savedPosts(),
  });
}

export const likedPosts = async () => {
  const response = await axios.get(`/api/post/liked`);
  return response.data;
};
export const useLikedPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_LIKED_POSTS],
    queryFn: () => likedPosts(),
  });
}

export const roomMessages = async (roomName: string) => {
  const response = await axios.get(`/api/chat/${roomName}/messages`);
  return response.data;
};
export const useGetRoomMessages = (roomName: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ROOM_MESSAGES],
    queryFn: () => roomMessages(roomName),
  });
}
