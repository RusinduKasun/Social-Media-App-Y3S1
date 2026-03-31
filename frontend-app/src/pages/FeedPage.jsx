import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPosts } from '../api/api';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import EditPostModal from '../components/EditPostModal';
import Pagination from '../components/Pagination';
import './FeedPage.css';

const FeedPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getPosts(page, 10);
      setPosts(res.data.posts);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((p) => p.id !== postId));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page">
      <div className="container">
        {/* Feed Header */}
        <div className="feed-header animate-fade-in">
          <div>
            <h1 className="feed-title">
              {isAuthenticated ? `Hey, ${user?.username} 👋` : 'Explore Posts'}
            </h1>
            <p className="feed-subtitle">
              {isAuthenticated
                ? "See what's happening in your community"
                : 'Sign in to create posts and interact'}
            </p>
          </div>
          {isAuthenticated && (
            <button
              className="btn btn-primary"
              onClick={() => setShowCreate(true)}
              id="create-post-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Post
            </button>
          )}
        </div>

        {/* Create Post Prompt */}
        {isAuthenticated && (
          <div
            className="create-prompt glass glass-hover animate-fade-in"
            onClick={() => setShowCreate(true)}
          >
            <div className="avatar">{user?.username?.charAt(0)}</div>
            <span className="create-prompt-text">What's on your mind, {user?.username}?</span>
          </div>
        )}

        {/* Posts Feed */}
        {loading ? (
          <div className="feed-loading">
            <div className="spinner spinner-lg"></div>
            <p>Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="feed-empty glass animate-fade-in">
            <div className="empty-icon">📝</div>
            <h3>No posts yet</h3>
            <p>Be the first to share something!</p>
            {isAuthenticated && (
              <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                Create First Post
              </button>
            )}
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handlePostDeleted}
                onUpdate={setEditingPost}
                onPostUpdated={handlePostUpdated}
              />
            ))}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* Modals */}
      {showCreate && (
        <CreatePostModal
          onClose={() => setShowCreate(false)}
          onPostCreated={handlePostCreated}
        />
      )}
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onPostUpdated={handlePostUpdated}
        />
      )}
    </div>
  );
};

export default FeedPage;
