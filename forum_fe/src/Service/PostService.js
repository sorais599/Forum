import axios from "axios";
class PostService{
    createPost(topicid,newPost){
        return axios(
            {
                url:`/post/createPost/${topicid}/${localStorage.getItem("accid")}`,
                method:"post",
                baseURL:"http://localhost:8080",
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                data: newPost
            }
        );
    }
    getPost(id,ourRequest){
        return axios(
            {
                url:`post/${id}`,
                method:"get",
                baseURL:"http://localhost:8080",
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                cancelToken:ourRequest.token
            }
        ); 
    }
    getComments(id,page){
        return axios(
            {
                url:`post/${id}/comments/page=${page}`,
                method:"get",
                baseURL:"http://localhost:8080",
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }
        ); 
    }
    addComment(postid,replyid,comment){
        return axios(
            {
                url:`post/${postid}/${localStorage.getItem("accid")}/${replyid}/addComment`,
                method:"post",
                baseURL:"http://localhost:8080",
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                data:comment
            }
        );
    }
    getPostsPage(page,ourRequest){
        return axios(
            {
                url:`post/page=${page}`,
                method:"get",
                baseURL:"http://localhost:8080",
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                cancelToken:ourRequest.token
            }
        );
    }
    getApprovePost(page,ourRequest){
        return axios(
            {
                url:`post/approvePost/page=${page}`,
                method:"get",
                baseURL:"http://localhost:8080",
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                cancelToken:ourRequest.token
            }
        );
    }
    rejectPost(id){
        return axios(
            {
                url:`/post/deletePost/${id}/${localStorage.getItem("accid")}`,
                method:"delete",
                baseURL:"http://localhost:8080",
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            }
        );
    }
    approvePost(id){
        return axios(
            {
                url:`/post/approve/${localStorage.getItem("accid")}/${id}`,
                method:"put",
                baseURL:"http://localhost:8080",
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            }
        );
    }
    editPost(topicid,updatedPost){
        return axios(
            {
                url:`/post/editPost/${topicid}/${localStorage.getItem("accid")}`,
                method:"put",
                baseURL:"http://localhost:8080",
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                data: updatedPost
            }
        );
    }
    deletePost(id){
        return axios(
            {
                url:`/post/deletePost/${id}/${localStorage.getItem("accid")}`,
                method:"delete",
                baseURL:"http://localhost:8080",
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            }
        );
    }
}
export default new PostService();