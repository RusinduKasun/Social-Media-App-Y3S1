import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toggleLike, addComment, deletePost } from '../api/api';
import './PostCard.css';

const PostCard = ({ post, onDelete, onUpdate, onPostUpdated }) => {
  const { user, isAuthenticated } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);

  const isOwner = user?.id === currentPost.userId;
  const isLiked = currentPost.likes?.includes(user?.id);

  const handleLike = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await toggleLike(currentPost.id);
      setCurrentPost(res.data.post);
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await addComment(currentPost.id, commentText.trim());
      setCurrentPost(res.data.post);
      setCommentText('');
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(currentPost.id);
      if (onDelete) onDelete(currentPost.id);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const timeAgo = (dateStr) => {
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="post-card glass glass-hover animate-fade-in">
      {/* Header */}
      <div className="post-header">
        <div className="post-author">
          <div className="avatar">
            {currentPost.username?.charAt(0)}
          </div>
          <div>
            <div className="post-username">{currentPost.username}</div>
            <div className="post-time">{timeAgo(currentPost.createdAt)}</div>
          </div>
        </div>
        {isOwner && (
          <div className="post-actions-menu">
            <button className="btn-icon" onClick={() => onUpdate && onUpdate(currentPost)} title="Edit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button className="btn-icon btn-icon-danger" onClick={handleDelete} title="Delete">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="post-content">
        <p>{currentPost.content}</p>
      </div>

      {/* Image */}
      {currentPost.image && (
        <div className="post-image">
          <img src={currentPost.image} alt="Post" loading="lazy" />
        </div>
      )}

      {/* Stats */}
      <div className="post-stats">
        <span>{currentPost.likes?.length || 0} likes</span>
        <span onClick={() => setShowComments(!showComments)} style={{ cursor: 'pointer' }}>
          {currentPost.comments?.length || 0} comments
        </span>
      </div>

      {/* Action Buttons */}
      <div className="post-action-bar">
        <button
          className={`post-action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={!isAuthenticated}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          Like
        </button>
        <button
          className="post-action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Comment
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="post-comments animate-slide-up">
          {currentPost.comments?.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="avatar avatar-sm">{comment.username?.charAt(0)}</div>
              <div className="comment-body">
                <span className="comment-author">{comment.username}</span>
                <span className="comment-text">{comment.text}</span>
              </div>
            </div>
          ))}
          {isAuthenticated && (
            <form className="comment-form" onSubmit={handleComment}>
              <div className="avatar avatar-sm">{user?.username?.charAt(0)}</div>
              <input
                className="input comment-input"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={!commentText.trim() || submitting}
              >
                {submitting ? '...' : 'Post'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
