export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  image?: string;
  author: string;
}
