import { useState } from 'react';
import { Link } from 'react-router-dom';
import './PostCard.css';

const PostCard = ({ post, currentUserId, onLike, onComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);

  const isLiked = post.likes && post.likes.includes(currentUserId);
  const likeCount = post.likeCount || post.likes?.length || 0;
  const commentCount = post.commentCount || post.comments?.length || 0;
  const comments = post.comments || [];

  const handleLike = () => {
    onLike(post.id);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommenting(true);
    await onComment(post.id, commentText);
    setCommentText('');
    setCommenting(false);
    setShowComments(true);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${post.authorId}`} className="post-author">
          <div className="author-avatar">{post.authorName?.[0]?.toUpperCase() || 'U'}</div>
          <div>
            <div className="author-name">{post.authorName || 'Anonymous'}</div>
            <div className="post-time">{formatDate(post.createdAt)}</div>
          </div>
        </Link>
      </div>

      <div className="post-content">{post.content}</div>

      {post.tags && post.tags.length > 0 && (
        <div className="post-tags">
          {post.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="post-actions">
        <button
          className={`action-button ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <span className="action-icon">👍</span>
          <span>{likeCount}</span>
        </button>
        <button
          className="action-button"
          onClick={() => setShowComments(!showComments)}
        >
          <span className="action-icon">💬</span>
          <span>{commentCount}</span>
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first!</p>
            ) : (
              comments.map((comment, idx) => (
                <div key={idx} className="comment">
                  <div className="comment-author">{comment.userName}</div>
                  <div className="comment-text">{comment.text}</div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleComment} className="comment-form">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="comment-input"
            />
            <button type="submit" className="comment-button" disabled={commenting || !commentText.trim()}>
              {commenting ? 'Posting...' : 'Post'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;

