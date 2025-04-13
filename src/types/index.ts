export type ContentType =
  | 'PRACTITIONERS'
  | 'BLOG_POST'
  | 'REVIEW'
  | 'FORUM_THREAD'
  | 'PROTOCOL';

export type Content = {
  id: string;
  title: string;
  referenceId?: string;
  type: ContentType;
  visibility: boolean;
  startPublishDate?: string;
  endPublishDate?: string;
  tags?: string[];
  priority?: number;
  isNew: boolean;
};
