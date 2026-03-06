import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

// interface defs
interface Post {
  id: number;
  username: string;
  email: string;
  message: string;
  timestamp: Date;
  likes: number;
  replies: Reply[];
  tags?: string[];
  isLiked?: boolean; //if the current user liked the post
}

interface Reply {
  id: number;
  username: string;
  email: string;
  message: string;
  timestamp: Date;
  likes: number;
  isLiked?: boolean; //if the current user liked the reply
}

@Component({
  selector: 'app-digichat',
  templateUrl: './digichat.component.html',
  styleUrls: ['./digichat.component.scss'],
  standalone: false
})
export class DigichatComponent implements OnInit {
  //component state vars
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  newPostMessage: string = '';
  searchQuery: string = '';
  isLoading: boolean = false;
  currentUser: any;
  
  replyMessages: { [postId: number]: string } = {};
  showReplyBox: { [postId: number]: boolean } = {};
  
  //different sorting options
  sortBy: 'newest' | 'oldest' | 'popular' = 'newest';
  
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    //get the current user info
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    
    //initial post loading
    this.loadPosts();
  }

  /**
   * TODO: Replace with actual API call to backend service w/ endpoint GET /api/digichat/posts
   * expected response: Post[]
   */
  loadPosts(): void {
    this.isLoading = true;
    
    // mock data for now, need to replace with actual call
    
    setTimeout(() => {
      this.posts = [
        {
          id: 1,
          username: 'testing_user_1',
          email: 'testing1@example.com',
          message: 'example mock post',
          timestamp: new Date('2024-01-15T10:30:00'),
          likes: 0,
          replies: [
            {
              id: 101,
              username: 'testing_user_2',
              email: 'testing2@example.com',
              message: 'example mock reply',
              timestamp: new Date('2024-01-15T11:00:00'),
              likes: 0
            }
          ],
          tags: []
        }
      ];
      
      this.applyFiltersAndSort();
      this.isLoading = false;
    }, 1000);
  }

  /**
   * TODO: implement actual backend API call w/ endpoint POST /api/digichat/posts
   * request body: { message: string, tags?: string[] }
   * expected response: Post
   */
  createPost(): void {
    if (!this.newPostMessage.trim()) {
      return;
    }

    if (!this.currentUser) {
      alert('You must be logged in to create posts.');
      return;
    }

    //extract tags from message
    const tags = this.extractHashtags(this.newPostMessage);

    const newPost: Post = {
      id: Date.now(), //TODO: once implemented this needs to come from backend
      username: this.currentUser.firstName || this.currentUser.email.split('@')[0],
      email: this.currentUser.email,
      message: this.newPostMessage,
      timestamp: new Date(),
      likes: 0,
      replies: [],
      tags: tags
    };

    //TODO: add actual API call

    //mock implementation for now
    this.posts.unshift(newPost);
    this.applyFiltersAndSort();
    this.newPostMessage = '';
  }

  /**
   * TODO: Implement backend API call w/ endpoint POST /api/digichat/posts/{postId}/like
   * expected response: {likes: number, isLiked: boolean}
   */
  toggleLikePost(post: Post): void {
    if (!this.currentUser) {
      alert('You must be logged in to like posts.');
      return;
    }

    //TODO: add actual API call

    //mock implementation
    if (post.isLiked) {
      post.likes--;
      post.isLiked = false;
    } else {
      post.likes++;
      post.isLiked = true;
    }
  }

  /**
   * TODO: implement backend API call w/ endpoint: POST /api/digichat/replies/{replyId}/like
   */
  toggleLikeReply(reply: Reply): void {
    if (!this.currentUser) {
      alert('You must be logged in to like replies.');
      return;
    }

    //mock implementation
    if (reply.isLiked) {
      reply.likes--;
      reply.isLiked = false;
    } else {
      reply.likes++;
      reply.isLiked = true;
    }
  }

  /**
   * show and hide replies from post
   */
  toggleReplyBox(postId: number): void {
    if (!this.currentUser) {
      alert('You must be logged in to reply to posts.');
      return;
    }
    
    this.showReplyBox[postId] = !this.showReplyBox[postId];
    if (!this.showReplyBox[postId]) {
      this.replyMessages[postId] = '';
    }
  }

  /**
   * TODO: Implement backend API call w/ endpoint POST /api/digichat/posts/{postId}/replies
   * request body: { message: string }
   * expected response: Reply
   */
  submitReply(postId: number): void {
    const message = this.replyMessages[postId];
    if (!message || !message.trim()) {
      return;
    }

    const post = this.posts.find(p => p.id === postId);
    if (!post) {
      return;
    }

    const newReply: Reply = {
      id: Date.now(), // In real implementation, this would come from backend
      username: this.currentUser.firstName || this.currentUser.email.split('@')[0],
      email: this.currentUser.email,
      message: message,
      timestamp: new Date(),
      likes: 0
    };

    //TODO: add actual api call

    //mock implementation
    post.replies.push(newReply);
    this.replyMessages[postId] = '';
    this.showReplyBox[postId] = false;
  }

  /**
   * TODO: Implement backend search API call w/ endpoint: GET /api/digichat/posts/search?q={query}
   */
  searchPosts(): void {
    if (!this.searchQuery.trim()) {
      this.filteredPosts = [...this.posts];
      this.sortPosts();
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredPosts = this.posts.filter(post => 
      post.message.toLowerCase().includes(query) ||
      post.username.toLowerCase().includes(query) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
    );
    
    this.sortPosts();
  }

  /**
   * clear search -> show all posts
   */
  clearSearch(): void {
    this.searchQuery = '';
    this.searchPosts();
  }

  /**
   * change sorting -> resort
   */
  changeSortBy(sortBy: 'newest' | 'oldest' | 'popular'): void {
    this.sortBy = sortBy;
    this.sortPosts();
  }

  /**
   * apply whats currently selected
   */
  private applyFiltersAndSort(): void {
    this.searchPosts();
  }

  /**
   * sort posts from the method
   */
  private sortPosts(): void {
    switch (this.sortBy) {
      case 'newest':
        this.filteredPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case 'oldest':
        this.filteredPosts.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        break;
      case 'popular':
        this.filteredPosts.sort((a, b) => b.likes - a.likes);
        break;
    }
  }

  /**
   * get tags from message
   */
  private extractHashtags(message: string): string[] {
    const hashtagRegex = /#(\w+)/g;
    const hashtags: string[] = [];
    let match;
    
    while ((match = hashtagRegex.exec(message)) !== null) {
      hashtags.push(match[1].toLowerCase());
    }
    
    return hashtags;
  }

  /**
   * timestamp formatting
   */
  formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return new Date(timestamp).toLocaleDateString();
  }

  /**
   * check if user can interact w/ post
   */
  canInteract(): boolean {
    return !!this.currentUser && !this.authService.isGuestUser();
  }
}