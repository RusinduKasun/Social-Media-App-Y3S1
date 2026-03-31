import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPostsByUser, updateProfile } from '../api/api';
import PostCard from '../components/PostCard';
import EditPostModal from '../components/EditPostModal';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user?.id) {
      fetchUserPosts();
    }
  }, [user?.id]);

  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      const res = await getPostsByUser(user.id);
      setPosts(res.data.posts);
    } catch (err) {
      console.error('Failed to fetch user posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await updateProfile(profileForm);
      updateUser(res.data.user);
      setEditMode(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((p) => p.id !== postId));
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  return (
    <div className="page">
      <div className="container">
        {/* Profile Card */}
        <div className="profile-card glass animate-slide-up">
          <div className="profile-cover">
            <div className="profile-cover-gradient"></div>
          </div>
          <div className="profile-body">
            <div className="avatar avatar-xl profile-avatar">
              {user?.username?.charAt(0)}
            </div>

            {editMode ? (
              <form onSubmit={handleProfileUpdate} className="profile-edit-form">
                <div className="input-group">
                  <label>Username</label>
                  <input
                    className="input"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label>Bio</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="profile-edit-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <h1 className="profile-name">{user?.username}</h1>
                <p className="profile-email">{user?.email}</p>
                {user?.bio && <p className="profile-bio">{user.bio}</p>}
                <div className="profile-stats">
                  <div className="stat">
                    <span className="stat-value">{posts.length}</span>
                    <span className="stat-label">Posts</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">
                      {posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0)}
                    </span>
                    <span className="stat-label">Likes</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">
                      {posts.reduce((sum, p) => sum + (p.comments?.length || 0), 0)}
                    </span>
                    <span className="stat-label">Comments</span>
                  </div>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setProfileForm({ username: user.username, bio: user.bio || '' });
                    setEditMode(true);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {message.text && (
            <div className={`alert alert-${message.type}`} style={{ margin: '0 24px 24px' }}>
              {message.text}
            </div>
          )}
        </div>

        {/* User Posts */}
        <div className="profile-posts-header animate-fade-in">
          <h2>Your Posts</h2>
        </div>

        {loading ? (
          <div className="feed-loading">
            <div className="spinner spinner-lg"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="feed-empty glass animate-fade-in">
            <div className="empty-icon">✍️</div>
            <h3>No posts yet</h3>
            <p>Share your first thought with the community!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handlePostDeleted}
              onUpdate={setEditingPost}
              onPostUpdated={handlePostUpdated}
            />
          ))
        )}
      </div>

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

export default ProfilePage;
