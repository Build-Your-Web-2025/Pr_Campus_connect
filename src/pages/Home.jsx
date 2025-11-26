import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, createPost, likePost, addComment } from '../firebase/posts';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import SearchBar from '../components/SearchBar';
import './Home.css';

const navLinks = [
  { label: 'Feed', path: '/', icon: '📡' },
  { label: 'Groups', path: '/groups', icon: '👥', disabled: true },
  { label: 'Events', path: '/events', icon: '📅' },
  { label: 'Marketplace', path: '/marketplace', icon: '🛒', disabled: true }
];

const Home = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, selectedTag]);

  const loadPosts = async () => {
    setLoading(true);
    const result = await getPosts();
    if (result.success) {
      setPosts(result.posts);
    }
    setLoading(false);
  };

  const filterPosts = () => {
    let filtered = [...posts];

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTag) {
      filtered = filtered.filter(post =>
        post.tags && post.tags.includes(selectedTag)
      );
    }

    setFilteredPosts(filtered);
  };

  const handleCreatePost = async (content, tags) => {
    const result = await createPost(content, user.uid, user.displayName, tags);
    if (result.success) {
      loadPosts();
    }
    return result;
  };

  const handleLike = async (postId) => {
    await likePost(postId, user.uid);
    loadPosts();
  };

  const handleComment = async (postId, commentText) => {
    await addComment(postId, user.uid, user.displayName, commentText);
    loadPosts();
  };

  const allTags = [...new Set(posts.flatMap(post => post.tags || []))];

  const trendingTopics = (() => {
    const counts = posts.reduce((acc, post) => {
      (post.tags || []).forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {});

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([tag]) => `#${tag}`);
  })();

  return (
    <div className="home-container">
      <div className="home-grid">
        <aside className="home-rail rail-left">
          <div className="menu-card">
            <p className="rail-label">Navigation</p>
            <div className="rail-links">
              {navLinks.map((item) => (
                <button
                  key={item.label}
                  className={`rail-link ${item.path === '/' ? 'active' : ''}`}
                  onClick={() => item.path !== '/' && alert('Coming soon')}
                  disabled={item.disabled}
                >
                  <span className="rail-icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {trendingTopics.length > 0 && (
            <div className="menu-card">
              <div className="rail-header">
                <p className="rail-label">Trending Topics</p>
                <span className="rail-meta">Live</span>
              </div>
              <div className="topic-badges">
                {trendingTopics.map((topic) => (
                  <span key={topic} className="topic-badge">{topic}</span>
                ))}
              </div>
            </div>
          )}

          {allTags.length > 0 && (
            <div className="menu-card">
              <p className="rail-label">Filter by Tag</p>
              <div className="tag-filters">
                <button
                  className={`tag-filter ${selectedTag === '' ? 'active' : ''}`}
                  onClick={() => setSelectedTag('')}
                >
                  All Posts
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    className={`tag-filter ${selectedTag === tag ? 'active' : ''}`}
                    onClick={() => setSelectedTag(tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className="home-feed">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search posts..."
          />

          <CreatePost onCreatePost={handleCreatePost} />

          {loading ? (
            <div className="loading-posts">Loading posts...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="empty-state">
              <p>No posts found. Be the first to share something!</p>
            </div>
          ) : (
            <div className="posts-list">
              {filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={user.uid}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              ))}
            </div>
          )}
        </main>

        <aside className="home-rail rail-right">
          <div className="menu-card">
            <div className="rail-header">
              <p className="rail-label">Friends</p>
              <span className="rail-meta">Build your circle</span>
            </div>
            <div className="empty-state rail-empty">
              <p>Connections will appear here once you start following classmates.</p>
            </div>
          </div>

          <div className="menu-card">
            <div className="rail-header">
              <p className="rail-label">Upcoming Events</p>
              <Link to="/events" className="rail-meta link">View all</Link>
            </div>
            <div className="empty-state rail-empty">
              <p>Pin events you care about to keep them handy.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;

