import React,{useState,useEffect} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import PostService from '../Service/PostService';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { Link, useNavigate, useParams } from 'react-router-dom';
import {TailSpin} from 'react-loader-spinner';
import Moment from 'react-moment';
import axios from "axios";
import SideComponent from '../Component/SideComponent';
import '../CSS/PostAndTopic.css';
import { animate, motion } from "framer-motion"

function Posts(){
    let navigate=useNavigate();

    const[mount,setMount]=useState(false);

    const[loading,setLoading]=useState(false);

    const [update,setUpdate] = useState(false);

    const[result,setResult]=useState([]);

    const[page,setPage]=useState(1);

    const[pages,setPages]=useState(0);

    const changePage=(e)=>{
        if(e.target.valueAsNumber>=1)
        setPage(e.target.valueAsNumber);
    }

    let{topicid}=useParams();

    let{key}=useParams();

    const nextPage=()=>{
        if(page<pages)
        setPage(page+1);
    }

    const prevPage=()=>{
        if(page>1)
        setPage(page-1);
    }

    useEffect(()=>{
        setLoading(true);
        const ourRequest=axios.CancelToken.source();
        setTimeout(async()=>{
            if(key!==undefined)
                await PostService.getPostsByKeyword(key,page,ourRequest).then(res=>{
                    if(res.data.status===401){
                        alert("session expired");
                        navigate("/")
                    }
                    if(res.data.content!==null){
                        setResult(res.data.content);
                        setPages(res.data.totalPages)
                    }
                })
            else if(topicid!==undefined)
                await PostService.getPostsByTopic(topicid,page,ourRequest).then(res=>{
                    if(res.data.status===401){
                        alert("session expired");
                        navigate("/")
                    }
                    if(res.data.content!==null){
                        setResult(res.data.content);
                        setPages(res.data.totalPages)
                    }
                })
            else await PostService.getPosts(page,ourRequest).then(res=>{
                if(res.data.status===401){
                    alert("session expired");
                    navigate("/")
                }
                if(res.data.content!==null){
                    setResult(res.data.content);
                    setPages(res.data.totalPages)
                }
            })
            setLoading(false);
            if (mount===false)
                setMount(true);
            return()=>{
                ourRequest.cancel('Request is canceled by user');
            }
        },800);
    },[page, update, key]);
    
    return(
        <div>
                <div>
                    {/* <h1 style={{textAlign:"center",color:"white"}}>POST</h1> */}
                    <table style={{width:"100%",border:"none",marginTop:"30px"}}>
                        <td style={{width:"30%",color:"yellow",verticalAlign:"top"}}>
                        <table style={{width:"100%",textAlign:"center"}}>
                            <tr>
                                {
                                    (loading===true)
                                    ?<td style={{textAlign:"right"}}>
                                        <TailSpin wrapperStyle={{display:"block",position:"fixed",bottom:"5px"}} color="red" height={200} width={200} />
                                    </td>:<></>
                                }    
                            </tr>
                            <tr>
                                <td><SideComponent/></td>
                            </tr>
                        </table>
                        </td>   
                        <td style={{width:"60%",color:"yellow"}}>
                        {
                        (mount===false)
                        ?
                        <></>
                        :    
                        <motion.table style={{width:"100%"}}
                            animate={{
                                opacity:[0,1],
                                translateY:[80,0],
                            }}
                        >
                                <tbody>
                                {
                                        result.map(
                                            post=>
                                            <tr key={post.id}>
                                                <td>
                                                <Card style={{marginBottom:"20px"}}>
                                                    <Card.Header style={{color:"blue"}}>
                                                    <img style={{width:"50px",height:"50px",borderRadius:"50%"}} src={post.created_acc.avatarUrl} alt=''></img>
                                                    <b>&nbsp;{post.created_acc.username}</b> ({post.created_acc.role.rolename})
                                                    {
                                                        <>&nbsp;|&nbsp;
                                                            <Moment fromNow>{post.created_at}</Moment>
                                                            &nbsp;
                                                            (<Moment format='DD/MM/YYYY HH:mm'>{post.created_at}</Moment>)
                                                        </>
                                                    }
                                                    <p>Topic: {post.topic.topicname}</p>    
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <Card.Title className='post-title' onClick={()=>navigate(`/postDetail/${post.id}`)} >{post.title}</Card.Title>
                                                    </Card.Body>
                                                </Card>
                                                </td>
                                                <td style={{verticalAlign:"top"}}>
                                                </td>
                                            </tr>
                                        )
                                    }
                                    <tr>
                                        <ButtonGroup aria-label="Basic example">
                                            <Button variant="secondary"onClick={prevPage}>{"<<<"} Previous</Button>
                                            <Button variant="secondary"onClick={nextPage}>Next {">>>"}</Button>
                                        </ButtonGroup>
                                            <label style={{marginLeft:"30px"}}>Page:</label><input min={1} max={pages} type="number" style={{width:"50px",marginLeft:"10px"}} value={page} onChange={changePage}/>
                                    </tr>
                                </tbody>
                            </motion.table>
                        }
                        </td>
                        <td style={{width:"10%",color:"yellow",verticalAlign:"top"}}>
                        </td>
                    </table>
                </div>
        </div>
    )
}
export default Posts;