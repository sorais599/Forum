import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import PostService from '../Service/PostService';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import moreIcon from '../SVG/more.svg';
import { TailSpin } from 'react-loader-spinner';
import axios from "axios";
import parse from "html-react-parser";
import Swal from 'sweetalert2';
import SideComponent from '../Component/SideComponent';
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PostDetail() {

    const serverUrl = "https://dvhl-forum-be.herokuapp.com";

    let Sock = new SockJS(serverUrl + '/ws');

    let stompClient = over(Sock);

    const relativeTime = require('dayjs/plugin/relativeTime');

    dayjs.extend(relativeTime);

    const role = localStorage.getItem("role");

    const accid = localStorage.getItem("accid");

    let navigate = useNavigate();

    const handleShowEdit = (postid) => {
        navigate(`/editpost/${postid}`);
    }

    const [showDelete, setShowDelete] = useState(false);

    const handleCloseDelete = () => setShowDelete(false);

    const handleShowDelete = () => {
        setShowDelete(true);
    }

    const [mount, setMount] = useState(false);

    let { id } = useParams();

    const [loading, setLoading] = useState(false);

    const [updatePost, setUpdatePost] = useState(false);

    const reloadPost = () => { setUpdatePost(!updatePost); }

    const [updateComments, setUpdateComments] = useState(false);

    const reloadComments = () => {
        setUpdateComments(!updateComments);
    }

    const [isEdit, setIsEdit] = useState(false);

    const [post, setPost] = useState({
        created_acc: {
            username: "",
            role: {
                rolename: ""
            }
        },
        topic: {
            topicname: ""
        },
        content: '',
    });

    const [newComment, setNewComment] = useState("");

    const changeNewComment = (e) => setNewComment(e.target.value);

    const [comments, setComments] = useState([]);

    const [isReply, setIsReply] = useState(false);

    const [replyCommentId, setReplyCommentId] = useState(0);

    const [editCommentId, setEditCommentId] = useState(0);

    const [editCommentContent, setEditCommentContent] = useState("");

    const showEditComment = (comment) => {
        setIsEdit(true);
        setEditCommentId(comment.id);
        setEditCommentContent(comment.content);
    }

    const cancelEditComment = () => setIsEdit(false);

    const changeEditComment = (e) => setEditCommentContent(e.target.value)

    const submitEditComment = () => {
        let comment = {
            content: editCommentContent
        }
        if (editCommentContent !== "") {
            PostService.editComment(editCommentId, comment).then(res => {
                reloadComments();
                setIsEdit(false);
                toast.success('Comment changed !!!', {
                    position: "top-right",
                    autoClose: 5000,
                });
            })
        }
    }

    const [deleteCommentId, setDeleteCommentId] = useState(0);

    const showDeleteComment = (commentid) => {
        setDeleteCommentId(commentid);
        handleShowDeleteCommentModal();
    }

    const [deleteCommentModal, setDeleteCommentModal] = useState(false);

    const handleShowDeleteCommentModal = () => {
        setDeleteCommentModal(true);
    }

    const handleCloseDeleteCommentModal = () => {
        setDeleteCommentModal(false);
    }

    const deleteComment = () => {
        PostService.deleteComment(deleteCommentId).then(res => {
            reloadComments();
            toast.success('Comment deleted !!!', {
                position: "top-right",
                autoClose: 5000,
            });
        })
        handleCloseDeleteCommentModal();

    }

    const [page, setPage] = useState(1);

    const [pages, setPages] = useState(0);

    const nextPage = () => {
        if (page < pages)
            setPage(page + 1);
    }

    const replyComment = (commentid) => {
        setReplyCommentId(commentid);
        setIsReply(true);
    }

    const cancelReply = () => {
        setIsReply(false);
    }

    const prevPage = () => {
        if (page > 1)
            setPage(page - 1);
    }

    const changePage = (e) => {
        if (e.target.valueAsNumber >= 1)
            setPage(e.target.valueAsNumber);
    }

    const addComment = (repliedComment) => {
        let comment = {
            content: newComment
        }
        if (newComment !== "") {
            PostService.addComment(post.id, replyCommentId, comment).then(res => {
                if (res.data.data.status === "OK") {
                    if (replyCommentId === 0) {
                        toast.success('Commented !!!', {
                            position: "top-right",
                            autoClose: 5000,
                        });
                        // stompClient.send(`/notify/${post.created_acc.id}`, {}, `${localStorage.getItem("username")} commented on your post: ${post.title}`);
                    } else {
                        toast.success('Replied !!!', {
                            position: "top-right",
                            autoClose: 5000,
                        });
                        // stompClient.send(`/notify/${repliedComment.created_acc.id}`, {}, `${localStorage.getItem("username")} replied your comment in post: ${post.title}`);
                    }
                }
                if (page !== 1)
                    setPage(1);
                else
                    // stompClient.send("notify/updateComments/" + String(id));
                    reloadComments();
            })
            setIsReply(false);
            setNewComment("");
        }
    }

    const deletePost = () => {
        console.log(id);
        handleCloseDelete();
        PostService.deletePost(String(id)).then(res => {
            if (res.data.status === 401) {
                Swal.fire({
                    icon: 'danger',
                    title: 'Session expired !!!!',
                    showConfirmButton: false,
                    timer: 1500
                })
                navigate("/")
            }
            navigate("/posts/all")
        });
    }

    const connectSocket = () => {
        stompClient.connect({
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Access-Control-Allow-Credentials": true,
        }, onConnected, onError);
    }

    const onConnected = () => {
        stompClient.subscribe("/receivedUpdatePost/" + String(id), _res => {
            reloadPost();
        })
        stompClient.subscribe("/receivedUpdateComments/" + String(id), _res => {
            reloadComments();
        })
    }

    const onError = (err) => {
        console.log(err);
    }

    useEffect(() => {
        setLoading(true);
        const ourRequest = axios.CancelToken.source();
        setTimeout(async () => {
            await PostService.getPost(String(id), ourRequest).then(res => {
                if (res.data.status === 401) {
                    Swal.fire({
                        icon: 'danger',
                        title: 'Session expired !!!!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    navigate("/")
                }
                setPost(res.data);
            })
            setLoading(false);
            if (mount === false)
                setMount(true);
            return () => {
                ourRequest.cancel('Request is canceled by user');
            }
        }, 800);
    }, [id, updatePost])

    useEffect(() => {
        connectSocket();
        setLoading(true);
        setTimeout(async () => {
            await PostService.getComments(String(id), page).then(res => {
                if (res.data.status === 401) {
                    navigate("/")
                }
                setComments(res.data.content);
                setPages(res.data.totalPages)
            })
            setLoading(false);
            if (mount === false)
                setMount(true);
        }, 800);
    }, [id, page, updateComments])

    return (
        <div>
            <ToastContainer theme="dark" />
            <div>
                <table style={{ width: "100%", border: "none", marginTop: "30px" }}>
                    <tr>
                        <td style={{ width: "25%", verticalAlign: "top" }}>
                            <table style={{ width: "70%", textAlign: "center" }}>
                                <tr>
                                    {
                                        (loading === true)
                                            ? <td style={{ textAlign: "right" }}>
                                                <TailSpin wrapperStyle={{ display: "block", position: "fixed", bottom: "5px" }} color="red" height={200} width={200} />
                                            </td> : <></>
                                    }
                                </tr>
                                <tr>
                                    <td><SideComponent /></td>
                                </tr>
                            </table>
                        </td>
                        {
                            (mount === false)
                                ?
                                <td style={{ width: "55%" }}></td>
                                :
                                <motion.td style={{ width: "55%" }}
                                    animate={{
                                        opacity: [0, 1],
                                        translateY: [80, 0],
                                    }}
                                >
                                    <tr style={{ marginBottom: "20px" }}>
                                        <td style={{ width: "100%" }}>
                                            <Card style={{ marginBottom: "20px" }}>
                                                <Card.Header style={{ color: "blue" }}>
                                                    <img style={{ width: "50px", height: "50px", borderRadius: "50%" }} src={post.created_acc.avatarUrl} alt=''></img>
                                                    <b>&nbsp;{post.created_acc.username}</b>
                                                    &nbsp;<img style={{ width: "20px", height: "20px" }} src={post.created_acc.role.imageUrl} alt=''></img>
                                                    {
                                                        <>&nbsp;|&nbsp;
                                                            {dayjs(post.created_at).locale("en").fromNow()}
                                                            &nbsp;
                                                            {dayjs(post.created_at).format('(DD/MM/YYYY [at] HH:mm)')}
                                                        </>
                                                    }
                                                    <p>Topic: {post.topic.topicname}</p>
                                                </Card.Header>
                                                <Card.Body>
                                                    <Card.Title style={{ color: "red" }}>{post.title}</Card.Title>
                                                    {parse(post.content)}
                                                </Card.Body>
                                            </Card>
                                            <Form.Group style={{ marginTop: "30px" }}>
                                                <Form.Control as="textarea" rows={3} placeholder='Type your comment.....' onChange={changeNewComment}></Form.Control>
                                                <div style={{ width: "100%", textAlign: 'right' }}>
                                                    <Button style={{ color: "white", width: "100%" }} onClick={() => addComment(undefined)}>Comment</Button>
                                                </div>
                                            </Form.Group>
                                        </td>
                                        <td style={{ verticalAlign: "top" }}>
                                            {
                                                (role !== "user" || accid === String(post.created_acc.id))
                                                    ?
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="light">
                                                            <img src={moreIcon} alt="logo" />
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu variant='dark'>
                                                            {
                                                                (accid === String(post.created_acc.id))
                                                                    ?
                                                                    <Dropdown.Item href="#" onClick={() => handleShowEdit(post.id)}>
                                                                        Edit Post
                                                                    </Dropdown.Item>
                                                                    :
                                                                    <></>
                                                            }
                                                            {
                                                                (role !== "user" || accid === String(post.created_acc.id))
                                                                    ?
                                                                    <Dropdown.Item href="#" onClick={handleShowDelete}>
                                                                        Delete Post
                                                                    </Dropdown.Item>
                                                                    :
                                                                    <></>
                                                            }
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                    : <></>
                                            }
                                        </td>
                                    </tr>
                                    {
                                        (comments.length === 0)
                                            ? <h2 style={{ textAlign: "center", marginTop: "30px" }}>Be the first to comment on this post !!!</h2>
                                            : <div>
                                                <tr>
                                                    <ButtonGroup aria-label="Basic example">
                                                        <Button variant="secondary" onClick={prevPage}>{"<<<"} Previous Page</Button>
                                                        <Button variant="secondary" onClick={nextPage}>Next Page {">>>"}</Button>
                                                    </ButtonGroup>
                                                    <label style={{ marginLeft: "30px" }}>Page:</label><input min={1} max={pages} type="number" style={{ width: "50px", marginLeft: "10px" }} value={page} onChange={changePage} />
                                                </tr>
                                                {
                                                    comments.map(
                                                        comment =>
                                                            <tr key={comment.id}>
                                                                <td style={{ width: "100%" }}>
                                                                    <Card style={{ marginBottom: "20px", marginTop: "30px" }}>
                                                                        <Card.Header style={{ color: "blue" }}>
                                                                            <img style={{ width: "50px", height: "50px", borderRadius: "50px" }} src={comment.created_acc.avatarUrl} alt=''></img>
                                                                            <b>&nbsp;{comment.created_acc.username}</b>
                                                                            &nbsp;<img style={{ width: "20px", height: "20px" }} src={comment.created_acc.role.imageUrl} alt=''></img>
                                                                            {
                                                                                <>&nbsp;|&nbsp;
                                                                                    {dayjs(comment.created_at).locale("en").fromNow()}
                                                                                    &nbsp;
                                                                                    {dayjs(comment.created_at).format('(DD/MM/YYYY [at] HH:mm)')}
                                                                                </>
                                                                            }
                                                                        </Card.Header>
                                                                        <Card.Body>
                                                                            {
                                                                                (comment.replied_cmt !== null)
                                                                                    ? <>
                                                                                        <p style={{ color: "#DDD8D8", fontSize: "15px" }}>(Replied to <b>@{comment.replied_cmt.created_acc.username}</b>)</p>
                                                                                        <p style={{ color: "#DDD8D8", fontSize: "15px", whiteSpace: "pre-wrap" }}>{comment.replied_cmt.content}</p>
                                                                                    </>
                                                                                    : <></>
                                                                            }
                                                                            {
                                                                                (isEdit === true && editCommentId === comment.id)
                                                                                    ?
                                                                                    <div>
                                                                                        <Form.Control as="textarea" cols={4} value={editCommentContent} onChange={changeEditComment}></Form.Control>
                                                                                        <div style={{ width: "100%", textAlign: "right" }}>
                                                                                            <Button style={{ color: "white", marginRight: "10px" }} onClick={cancelEditComment}>Cancel</Button>
                                                                                            <Button style={{ color: "white", }} onClick={submitEditComment}>Edit</Button>
                                                                                        </div>
                                                                                    </div>
                                                                                    :
                                                                                    <Card.Text style={{ color: "black" }}>
                                                                                        <p style={{ whiteSpace: "pre-wrap" }}>{comment.content}</p>
                                                                                    </Card.Text>
                                                                            }

                                                                        </Card.Body>
                                                                        {
                                                                            (isReply === true && replyCommentId === comment.id)
                                                                                ?
                                                                                <Card.Footer>
                                                                                    <Form.Control as="textarea" cols={1} placeholder='Reply comment.....' onChange={changeNewComment}></Form.Control>
                                                                                    <div style={{ width: "100%", textAlign: "right" }}>
                                                                                        <Button style={{ color: "white" }} onClick={() => addComment(comment)}>Reply</Button>
                                                                                        <Button style={{ color: "white", marginLeft: "10px" }} onClick={cancelReply}>Cancel</Button>
                                                                                    </div>
                                                                                </Card.Footer>
                                                                                :
                                                                                <Card.Footer style={{ textAlign: "right" }}>
                                                                                    <Button style={{ color: "white" }} onClick={() => replyComment(comment.id)}>Reply</Button>
                                                                                </Card.Footer>
                                                                        }
                                                                    </Card>
                                                                </td>
                                                                <td style={{ verticalAlign: "top" }}>
                                                                    {
                                                                        (role !== "user" || accid === String(comment.created_acc.id) || accid === String(post.created_acc.id))
                                                                            ?
                                                                            <Dropdown style={{ marginTop: "30px" }}>
                                                                                <Dropdown.Toggle variant="light">
                                                                                    <img src={moreIcon} alt="logo" />
                                                                                </Dropdown.Toggle>
                                                                                <Dropdown.Menu variant="dark">
                                                                                    {
                                                                                        (accid === String(comment.created_acc.id))
                                                                                            ?
                                                                                            <Dropdown.Item href="#" onClick={() => showEditComment(comment)}>
                                                                                                Edit Comment
                                                                                            </Dropdown.Item>
                                                                                            :
                                                                                            <></>
                                                                                    }
                                                                                    {
                                                                                        (role !== "user" || accid === String(comment.created_acc.id) || accid === String(post.created_acc.id))
                                                                                            ?
                                                                                            <Dropdown.Item href="#" onClick={() => showDeleteComment(comment.id)}>
                                                                                                Delete Comment
                                                                                            </Dropdown.Item>
                                                                                            :
                                                                                            <></>
                                                                                    }
                                                                                </Dropdown.Menu>
                                                                            </Dropdown>
                                                                            : <></>
                                                                    }
                                                                </td>
                                                            </tr>
                                                    )
                                                }
                                            </div>
                                    }

                                    <tr>

                                    </tr>
                                </motion.td>
                        }
                        <td style={{ width: "20%", color: "yellow" }}>
                            <Modal
                                show={showDelete}
                                onHide={handleCloseDelete}
                                backdrop="static"
                                keyboard={false}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>Delete Post</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    You really want to delete this Post ???
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseDelete}>
                                        Close
                                    </Button>
                                    <Button variant="primary" onClick={deletePost}>Delete</Button>
                                </Modal.Footer>
                            </Modal>
                            <Modal
                                show={deleteCommentModal}
                                onHide={handleCloseDeleteCommentModal}
                                backdrop="static"
                                keyboard={false}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>Delete Comment</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    You really want to delete this comment ???
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseDeleteCommentModal}>
                                        Close
                                    </Button>
                                    <Button variant="primary" onClick={deleteComment}>Delete</Button>
                                </Modal.Footer>
                            </Modal>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    )
}
export default PostDetail;