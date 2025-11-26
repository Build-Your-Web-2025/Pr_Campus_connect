import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserProfile } from '../firebase/auth';
import { getPosts } from '../firebase/posts';
import PostCard from '../components/PostCard';
import { likePost, addComment } from '../firebase/posts';
import './Profile.css';

const Profile = ({ user: currentUser }) => {
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isOwnProfile = userId === currentUser.uid;

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);
    
    // Load user profile
    const profileResult = await getUserProfile(userId);
    if (profileResult.success) {
      setProfileUser(profileResult.data);
    }
    
    // Load user's posts
    const postsResult = await getPosts(100);
    if (postsResult.success) {
      const filtered = postsResult.posts.filter(post => post.authorId === userId);
      setUserPosts(filtered);
    }
    
    setLoading(false);
  };

  const handleLike = async (postId) => {
    await likePost(postId, currentUser.uid);
    loadProfile();
  };

  const handleComment = async (postId, commentText) => {
    await addComment(postId, currentUser.uid, currentUser.displayName, commentText);
    loadProfile();
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (!profileUser) {
    return <div className="profile-error">User not found</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-large">
          {profileUser.displayName?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="profile-info">
          <h1>{profileUser.displayName || 'Anonymous'}</h1>
          <p className="profile-email">{profileUser.email}</p>
          {profileUser.bio && (
            <p className="profile-bio">{profileUser.bio}</p>
          )}
          {profileUser.interests && profileUser.interests.length > 0 && (
            <div className="profile-interests">
              {profileUser.interests.map((interest, idx) => (
                <span key={idx} className="interest-tag">{interest}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat">
          <div className="stat-value">{userPosts.length}</div>
          <div className="stat-label">Posts</div>
        </div>
        <div className="stat">
          <div className="stat-value">{profileUser.interests?.length || 0}</div>
          <div className="stat-label">Interests</div>
        </div>
      </div>

      <div className="profile-posts">
        <h2>{isOwnProfile ? 'My Posts' : 'Posts'}</h2>
        {userPosts.length === 0 ? (
          <div className="empty-posts">
            <p>No posts yet. {isOwnProfile && <Link to="/">Create your first post!</Link>}</p>
          </div>
        ) : (
          <div className="posts-list">
            {userPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUser.uid}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

