/** Pure helpers for task followers (Asana). Following is the same email-array
 * toggle as likes — a member's email is present or not — so these reuse the
 * generic list ops from taskLikes under follower-named aliases. */
import { hasLiked, likeCount, toggleLike } from './taskLikes';

/** True when `me` follows the task (case-insensitive, null-safe). */
export const isFollowing = hasLiked;

/** The number of followers (ignores null/blank entries). */
export const followerCount = likeCount;

/** The next `followers` list after `me` toggles follow (add if absent, else
 * remove), preserving other followers and dropping null/blank noise. */
export const toggleFollow = toggleLike;
