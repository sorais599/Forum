import React,{useState,useEffect} from 'react';
import Card from 'react-bootstrap/Card';
import PostService from '../Service/PostService';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import {useNavigate, useParams } from 'react-router-dom';
import styles from '../CSS/style.css';
function PostDetail(){
    let {id}=useParams();
    const [update,setUpdate] = useState(false);
    const reload=()=>{setUpdate(!update);}
    const[post,setPost]=useState({
        created_acc:{
            username:"",
            role:{
                rolename:""
            }
        },
        topic:{
            topicname:""
        }
    });
    const[comment,setComment]=useState([]);
    const[page,setPage]=useState(1);
    const[pages,setPages]=useState(0);
    const nextPage=()=>{
        if(page<pages)
        setPage(page+1);
    }
    const prevPage=()=>{
        if(page>1)
        setPage(page-1);
    }
    const changePage=(e)=>{
        if(e.target.valueAsNumber>=1)
        setPage(e.target.valueAsNumber);
    }
    useEffect(()=>{
        PostService.getPost(String(id)).then(res=>{
            setPost(res.data);
        })
    },[id, page, update])
    return (
        <div>
            <table style={{width:"1920px",border:"none"}}>
                <td style={{width:"30%",color:"yellow"}}>

                </td>
                <td style={{width:"60%",color:"yellow"}}>
                    <tr>
                        <td>   
                        <Card style={{marginBottom:"20px",marginTop:"30px"}}>
                            <Card.Header style={{color:"blue"}}>
                                <p>Account created: {post.created_acc.username} ({post.created_acc.role.rolename})</p>
                                <p>Topic: {post.topic.topicname}</p>
                                {(post.updated_at==="")
                                ?<p>Time post: {new Date(post.created_at).toLocaleDateString(undefined,
                                    { year: "numeric", month: "long", day: "numeric", hour:"2-digit",minute:"2-digit",second:"2-digit" })}</p>
                                :<p>Last updated: {new Date(post.updated_at).toLocaleDateString(undefined,
                                    { year: "numeric", month: "long", day: "numeric", hour:"2-digit",minute:"2-digit",second:"2-digit" })}</p>}     
                            </Card.Header>
                            <Card.Body>
                                <Card.Title style={{color:"red"}}>{post.title}</Card.Title>
                                <Card.Text style={{color:"black"}}>
                                <p style={{whiteSpace: "pre-wrap"}}>{post.content}</p>
                                </Card.Text>
                            </Card.Body>               
                        </Card>
                        <Form.Group style={{marginTop:"30px"}}>
                            <Form.Control as="textarea" rows={5} placeholder='Type your comment.....'></Form.Control>
                            <Button style={{color:"white"}}>Comment</Button>
                        </Form.Group>
                        </td>
                        <td style={{verticalAlign:"top"}}>

                        </td>
                    </tr>
                    <tr>

                    </tr>
                </td>
                <td style={{width:"10%",color:"yellow"}}>

                </td>
            </table>
        </div>
    )
}
export default PostDetail;