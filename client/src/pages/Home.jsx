import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs, likeBlog } from "../features/blog/blogSlice";
import "../styles/home.css";
const Home = () => {
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Latest Blogs</h1>
        <p>Read the latest articles from our MERN blog platform.</p>
      </div>

      {loading && <p className="status-text">Loading blogs...</p>}
      {error && <p className="status-text error-text">{error}</p>}

      <div className="blog-grid">
        {blogs?.map((blog) => (
          <div className="blog-card" key={blog._id}>
            {blog.image && (
              <img
                src={`http://localhost:5000${blog.image}`}
                alt={blog.title}
                className="blog-image"
              />
            )}

            <div className="blog-content">
              <span className="blog-category">
                {blog.category || "General"}
              </span>

              <h2 className="blog-title">{blog.title}</h2>

              <p className="blog-description">
                {blog.content?.length > 140
                  ? `${blog.content.substring(0, 140)}...`
                  : blog.content}
              </p>

              <div className="blog-footer">
                <button
                  className="like-button"
                  onClick={() => dispatch(likeBlog(blog._id))}
                >
                  ❤️ {blog.likes?.length || 0}
                </button>

                <span className="blog-author">
                  By {blog.user?.name || "Unknown"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;