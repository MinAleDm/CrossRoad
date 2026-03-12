import { seedPosts } from '../data/seed';
import type { PostItem } from '../types';

const STORAGE_KEY = 'crossroad.posts.v2';

export function loadPosts(): PostItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return seedPosts;
    }

    const parsed = JSON.parse(raw) as PostItem[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seedPosts;
  } catch {
    return seedPosts;
  }
}

export function savePosts(posts: PostItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}
