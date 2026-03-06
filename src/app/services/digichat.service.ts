import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

// interface defs
export interface Post {
  id: number;
  username: string;
  email: string;
  message: string;
  timestamp: Date;
  likes: number;
  replies: Reply[];
  tags?: string[];

  isLiked?: boolean;
}

export interface Reply {
  id: number;
  username: string;
  email: string;
  message: string;
  timestamp: Date;
  likes: number;
  isLiked?: boolean;
}

export interface CreatePostRequest {
  message: string;
  tags?: string[];
}

export interface CreateReplyRequest {
  message: string;
}

export interface LikeResponse {
  likes: number;
  isLiked: boolean;
}

export interface PostsResponse {
  posts: Post[];
  totalCount: number;
  currentPage: number;

  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class DigichatService {
  private readonly API_BASE_URL = '/api/digichat'; //backend base api url

  constructor(private http: HttpClient) {}

  /**
   * get all posts
   * backend endpoint: GET /api/digichat/posts
   * @param page - page number (default: 1)
   * @param limit - posts per page (default: 20)
   * @param sort - sort order: 'newest', 'oldest', 'popular' (default: 'newest')
   */
  getPosts(page: number = 1, limit: number = 20, sort: string = 'newest'): Observable<PostsResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort);

    return this.http.get<PostsResponse>(`${this.API_BASE_URL}/posts`, { params });
  }

  /**
   * search posts
   * backend endpoint: GET /api/digichat/posts/search
   * @param query - search query
   * @param page - page number (default: 1)
   * @param limit - posts per page (default: 20)
   * @param sort - sort ordr (default: 'newest')
   */
  searchPosts(query: string, page: number = 1, limit: number = 20, sort: string = 'newest'): Observable<PostsResponse> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort);

    return this.http.get<PostsResponse>(`${this.API_BASE_URL}/posts/search`, { params });
  }

  /**
   * create post
   * backend endpoint: POST /api/digichat/posts
   * @param postData - data of post
   */
  createPost(postData: CreatePostRequest): Observable<Post> {
    return this.http.post<Post>(`${this.API_BASE_URL}/posts`, postData);
  }

  /**
   * get post by id
   * backend endpoint: GET /api/digichat/posts/{postId}
   * @param postId - id of post
   */
  getPost(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.API_BASE_URL}/posts/${postId}`);
  }

  /**
   * update a post (as owner of post)
   * backend endpoint: PUT /api/digichat/posts/{postId}
   * @param postId - id of post
   * @param postData - data of update
   */
  updatePost(postId: number, postData: CreatePostRequest): Observable<Post> {
    return this.http.put<Post>(`${this.API_BASE_URL}/posts/${postId}`, postData);
  }

  /**
   * delete a post (for owner of post OR admin)
   * backend endpoint: DELETE /api/digichat/posts/{postId}
   * @param postId - id of post
   */
  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/posts/${postId}`);
  }
  /**
   * like/unlike post
   * backend endpoint: POST /api/digichat/posts/{postId}/like
   * @param postId - Post ID
   */
  toggleLikePost(postId: number): Observable<LikeResponse> {
    return this.http.post<LikeResponse>(`${this.API_BASE_URL}/posts/${postId}/like`, {});
  }

  /**
   * get a post's replies
   * backend endpoint: GET /api/digichat/posts/{postId}/replies
   * @param postId - id of post
   * @param page - page number (default: 1)
   * @param limit - replies per page (default: 50)
   */
  getReplies(postId: number, page: number = 1, limit: number = 50): Observable<Reply[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<Reply[]>(`${this.API_BASE_URL}/posts/${postId}/replies`, { params });
  }

  /**
   * reply to post
   * backend endpoint: POST /api/digichat/posts/{postId}/replies
   * @param postId - id of post
   * @param replyData - data of reply
   */
  createReply(postId: number, replyData: CreateReplyRequest): Observable<Reply> {
    return this.http.post<Reply>(`${this.API_BASE_URL}/posts/${postId}/replies`, replyData);
  }

  /**
   * update a reply (reply owner only)
   * backend endpoint: PUT /api/digichat/replies/{replyId}
   * @param replyId - id of reply
   * @param replyData - new reply
   */
  updateReply(replyId: number, replyData: CreateReplyRequest): Observable<Reply> {
    return this.http.put<Reply>(`${this.API_BASE_URL}/replies/${replyId}`, replyData);
  }

  /**
   * delete a reply (for reply owner OR admin)
   * backend endpoint: DELETE /api/digichat/replies/{replyId}
   * @param replyId - id of reply
   */
  deleteReply(replyId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/replies/${replyId}`);
  }

  /**
   * Like or unlike a reply
   * Backend endpoint: POST /api/digichat/replies/{replyId}/like
   * @param replyId - Reply ID
   */
  toggleLikeReply(replyId: number): Observable<LikeResponse> {
    return this.http.post<LikeResponse>(`${this.API_BASE_URL}/replies/${replyId}/like`, {});
  }

  /**
   * Get trending hashtags
   * Backend endpoint: GET /api/digichat/hashtags/trending
   * @param limit - Number of hashtags to return (default: 10)
   */
  getTrendingHashtags(limit: number = 10): Observable<string[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<string[]>(`${this.API_BASE_URL}/hashtags/trending`, { params });
  }


  /**
   * get posts by tag
   * backend endpoint: GEt /api/digichat/hashtags/{hashtag}/posts
   * @param hashtag - hashtag name (without #)
   * @param page - page number (default: 1)
   * @param limit - posts per page (default: 20)
   */
  getPostsByHashtag(hashtag: string, page: number = 1, limit: number = 20): Observable<PostsResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PostsResponse>(`${this.API_BASE_URL}/hashtags/${hashtag}/posts`, { params });
  }

  /**
   * report pot
   * backend endpoint: POST /api/digichat/posts/{postId}/report
   * @param postId - id of post
   * @param reason - reason of report
   */
  reportPost(postId: number, reason: string): Observable<void> {
    return this.http.post<void>(`${this.API_BASE_URL}/posts/${postId}/report`, { reason });
  }

  /**
   * report a reply
   * backend endpoint: POST /api/digichat/replies/{replyId}/report
   * @param replyId - id of reply
   * @param reason - reason of report
   */
  reportReply(replyId: number, reason: string): Observable<void> {
    return this.http.post<void>(`${this.API_BASE_URL}/replies/${replyId}/report`, { reason });
  }
}