import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Icons
import { BsFillTrashFill } from 'react-icons/bs';
import { ImBubbles3, ImPencil } from 'react-icons/im';
import { HiHeart } from 'react-icons/hi';
import { FiSend } from 'react-icons/fi';

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');
    const [file, setFile] = useState('');
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [updatePostContent, setUpdatePostContent] = useState(false);
    const [newContent, setNewContent] = useState('');

    const token = JSON.parse(localStorage.getItem('token'));
    const tokenParts = token.split('.');
    const encodedPayload = tokenParts[1];
    const rawPayload = atob(encodedPayload);
    const tokenUser = JSON.parse(rawPayload);
    const userId = tokenUser.userId;

    const getPosts = async () => {
        const response = await fetch('https://alexeseneblog.onrender.com/posts', {
            headers: { Authorization: 'Bearer ' + token }
        });
        const posts = await response.json();
        setPosts(posts);
    };

    useEffect(() => {
        getPosts();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const postChecker = () => {
            const textRegex = /^[\w'\-,.][^_¡÷¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/i;
            if (textRegex.test(content)) {
                return true;
            } else {
                alert('Please check the content of the post');
                return false;
            }
        };

        if (postChecker()) {
            const formData = new FormData();
            formData.append('content', content);
            formData.append('image', file);
            formData.append('userId', userId);

            axios({
                method: 'POST',
                url: 'https://alexeseneblog.onrender.com/posts',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + token
                },
                data: formData
            })
                .then((res) => {
                    if (res.status === 201) {
                        setContent('');
                        setFile('');
                        getPosts();
                    } else {
                        console.log('there is a mistake');
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };
    return (
        <>
            <NavBar />
            <section className="dashboard">
                <form className="postInputBox" onSubmit={handleSubmit}>
                    <textarea
                        // style={{ border: 'red solid 1px' }}
                        rows={4}
                        id="content"
                        name="content"
                        placeholder="Today's post is ..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    {/* <input
                      type="textarea"
                      id="content"
                      name="content"
                      placeholder="Today's post is ..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                  /> */}
                    <input
                        // style={{ border: 'red solid 1px' }}
                        type="file"
                        id="file"
                        name="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <button
                        // style={{ border: 'red solid 5px' }}
                        type="submit"
                        className="btnPublish"
                    >
                        Create Post
                    </button>
                </form>
                <div className="postContainer">
                    <h1>Latest posts</h1>
                    <ul className="postList">
                        {posts.map((post) => {
                            const { id, content, imageUrl, createdAt, user, like } = post;
                            const idPost = post.id;

                            const deletePost = async (e) => {
                                e.preventDefault();
                                axios({
                                    method: 'DELETE',
                                    url: `https://alexeseneblog.onrender.com/posts/${id}`,
                                    headers: { Authorization: 'Bearer ' + token }
                                }).then(() => getPosts());
                            };

                            const sendLike = () => {
                                axios({
                                    method: 'POST',
                                    data: {
                                        postId: id,
                                        userId: userId
                                    },
                                    url: `https://alexeseneblog.onrender.com/posts/${id}/like`,
                                    headers: {
                                        Authorization: 'Bearer ' + token
                                    }
                                })
                                    .then(() => {
                                        getPosts();
                                    })
                                    .catch((error) => console.log(error));
                            };

                            const createComment = async (e) => {
                                e.preventDefault();
                                const commentChecker = () => {
                                    const textRegex =
                                        /^[\w'\-,.][^_¡÷¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,500}$/i;
                                    if (textRegex.test(comment)) {
                                        return true;
                                    } else {
                                        alert('Please check the content of the comment');
                                        return false;
                                    }
                                };

                                if (commentChecker()) {
                                    axios({
                                        method: 'POST',
                                        data: {
                                            content: comment,
                                            postId: id,
                                            userId: userId
                                        },
                                        withCredentiels: true,
                                        url: `https://alexeseneblog.onrender.com/posts/${id}/comment`,
                                        headers: {
                                            Authorization: 'Bearer ' + token
                                        }
                                    })
                                        .then(() => {
                                            setComment('');
                                            getComments();
                                        })
                                        .catch((error) => console.log(error));
                                }
                            };

                            const getComments = async () => {
                                const response = await fetch(
                                    `https://alexeseneblog.onrender.com/posts/${id}/comment`,
                                    { headers: { Authorization: 'Bearer ' + token } }
                                );
                                const comments = await response.json();
                                setComments(comments.data);
                            };

                            return (
                                <li key={id}>
                                    <div className="headerPost">
                                        <h2 className="postTitle">
                                            By{' '}
                                            <Link to={`profile/${user.id}`}>
                                                {' '}
                                                {user.firstName + ' ' + user.lastName}
                                            </Link>{' '}
                                            <span id="creationDate">
                                                {new Date(createdAt).toLocaleDateString('fr-FR')}
                                            </span>
                                        </h2>
                                        {(user.id === tokenUser.userId || tokenUser.isAdmin) && (
                                            <div>
                                                <BsFillTrashFill
                                                    size={20}
                                                    className="trashIcon"
                                                    onClick={deletePost}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <p id="postContent">{content}</p>
                                    {imageUrl && <img src={imageUrl} alt="" />}
                                    <div className="postInteract">
                                        <form>
                                            <input
                                                type="text"
                                                placeholder="
                        Type your comment..."
                                                id="comment"
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                            <FiSend
                                                className="sendIcon"
                                                size={22}
                                                onClick={createComment}
                                            >
                                                To send
                                            </FiSend>
                                        </form>
                                        <ImBubbles3
                                            size={28}
                                            className="commentIcon"
                                            onClick={getComments}
                                        />
                                        <div className="likeBox">
                                            <HiHeart
                                                size={28}
                                                className="heartIcon"
                                                onClick={sendLike}
                                            />
                                            <span>{like}</span>
                                        </div>
                                    </div>
                                    <div className="commentContainer">
                                        <ul>
                                            {comments.map((commentData) => {
                                                const { id, content, postId, createdAt, user } =
                                                    commentData;

                                                const deleteComment = async (e) => {
                                                    e.preventDefault();
                                                    axios({
                                                        method: 'DELETE',
                                                        url: `https://alexeseneblog.onrender.com/comments/${id}`,
                                                        headers: {
                                                            Authorization: 'Bearer ' + token
                                                        }
                                                    }).then(() => getComments());
                                                };

                                                if (idPost === postId) {
                                                    return (
                                                        <li key={id} className="commentBox">
                                                            <div className="headerComment">
                                                                <h3 className="commentTitle">
                                                                    <Link
                                                                        to={`profile/${user.id}`}
                                                                        id="profileLink"
                                                                    >
                                                                        {user.lastName +
                                                                            ' ' +
                                                                            user.firstName}
                                                                    </Link>
                                                                    {', '}
                                                                    <span id="creationDate">
                                                                        {' '}
                                                                        on{' '}
                                                                        {new Date(
                                                                            createdAt
                                                                        ).toLocaleDateString(
                                                                            'fr-FR'
                                                                        )}
                                                                    </span>
                                                                    {', '}
                                                                    said :
                                                                </h3>
                                                                {(user.id === tokenUser.userId ||
                                                                    tokenUser.isAdmin) && (
                                                                    <BsFillTrashFill
                                                                        size={20}
                                                                        className="trashIcon"
                                                                        onClick={deleteComment}
                                                                    />
                                                                )}
                                                            </div>
                                                            <p>{content}</p>
                                                        </li>
                                                    );
                                                }
                                            })}
                                        </ul>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </section>
        </>
    );
};

export default Dashboard;
