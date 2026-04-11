import API from "./axios";

export const getBlogs= (params) => API.get("/blogs", { params });

export const createBlog= (data) => API.post("blogs",data,{
    headers: {
        "Content-Type": "multipart/form-data",
    }
})
 
export const getBlogById = (id) => API.get(`/blogs/${id}`);
export const toggleLike = (id) => API.post(`/blogs/${id}/like`);