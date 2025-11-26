import { useState } from 'react';
import './CreatePost.css';

const CreatePost = ({ onCreatePost }) => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    const tagArray = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const result = await onCreatePost(content, tagArray);
    
    if (result.success) {
      setContent('');
      setTags('');
    }
    
    setLoading(false);
  };

  return (
    <div className="create-post-card">
      <div className="create-post-header">
        <span className="create-post-icon">📝</span>
        <div>
          <p className="create-post-title">Share your thoughts...</p>
          <p className="create-post-subtitle">Let your campus know what’s happening</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="create-post-form">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something inspiring for your college community..."
          rows="4"
          className="post-input"
        />
        
        <div className="create-post-footer">
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Add tags e.g. Finals, Clubs, Events"
            className="tags-input"
          />
          <button type="submit" className="post-button" disabled={loading || !content.trim()}>
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;

