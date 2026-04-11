import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBlog } from "../features/blog/blogSlice";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.blog);

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("category", form.category);
    formData.append("tags", form.tags);
    if (image) {
      formData.append("image", image);
    }

    const resultAction = await dispatch(addBlog(formData));

    if (addBlog.fulfilled.match(resultAction)) {
      navigate("/");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "20px" }}>
      <h2>Create Blog</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Blog title"
          value={form.title}
          onChange={handleChange}
          style={{ width: "100%", padding: "12px", marginBottom: "12px" }}
        />

        <textarea
          name="content"
          placeholder="Write your blog content"
          value={form.content}
          onChange={handleChange}
          rows="8"
          style={{ width: "100%", padding: "12px", marginBottom: "12px" }}
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          style={{ width: "100%", padding: "12px", marginBottom: "12px" }}
        />

        <input
          type="text"
          name="tags"
          placeholder="mern,react,node"
          value={form.tags}
          onChange={handleChange}
          style={{ width: "100%", padding: "12px", marginBottom: "12px" }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ marginBottom: "16px" }}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;