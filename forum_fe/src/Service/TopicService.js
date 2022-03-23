import axios from "axios";
const token=localStorage.getItem("token");
class TopicService{
    getAllTopic(page){
        return axios(
            {
                url:`topic/page=${page}`,
                method:"get",
                baseURL:"http://localhost:8080",
                headers:{
                    "Authorization": `Bearer ${token}`,
                }
            }
        );
    }
    addTopic(newTopic){
        return axios(
            {
                url:`/topic/createTopic/${localStorage.getItem("accid")}`,
                method:"post",
                baseURL:"http://localhost:8080",
                headers:{
                    "Authorization": `Bearer ${token}`,
                },
                data: newTopic
            }
        );
    }
    // deleteTopic(id){
    //     return axios(
    //         {
    //             url:`topic/page=${page}`,
    //             method:"delete",
    //             baseURL:"http://localhost:8080",
    //             headers:{
    //                 "Authorization": `Bearer ${token}`,
    //             }
    //         }
    //     );
    // }
}
export default new TopicService(); 