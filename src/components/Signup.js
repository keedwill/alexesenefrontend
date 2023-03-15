import React, { useState } from 'react';
import logo from '../images/icon-left-font-cut.jpg';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signupCheck = (e) => {
        e.preventDefault();
        const inputCheck = () => {
            const textRegex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,30}$/i;
            const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,30})$/i;

            if (textRegex.test(lastName) && textRegex.test(firstName) && emailRegex.test(email)) {
                return true;
            } else {
                alert('Please enter valid data');
                return false;
            }
        };
        if (inputCheck()) {
            axios({
                method: 'POST',
                url: 'https://alexeseneblog.onrender.com/users/signup',
                data: {
                    lastName,
                    firstName,
                    email,
                    password
                }
            })
                .then((res) => {
                    if (res.status === 201) {
                        document.getElementById('message').classList.add('confirmation');
                        document.getElementById('message').innerText =
                            'Your user account has been successfully created !';
                        setLastName('');
                        setFirstName('');
                        setEmail('');
                        setPassword('');
                    } else {
                        console.log('there is a mistake');
                    }
                })
                .catch((err) => {
                    console.log(err);
                    document.getElementById('message').classList.add('warning');
                    document.getElementById('message').innerText = 'An error has occurred.';
                });
        }
    };

    return (
        <>
            <section className="container">
                <Link to="/">
                    <img src={'https://i.imgur.com/mlvn4K4.jpg'} alt="logo" className="logo" />
                </Link>
                <article className="form">
                    <form onSubmit={signupCheck}>
                        <h1>Registration</h1>
                        <div className="form-control">
                            <label htmlFor="lastName">Last name :</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="form-control">
                            <label htmlFor="firstName">First name :</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="form-control">
                            <label htmlFor="email">Email :</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-control">
                            <label htmlFor="password">Password :</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span className="advice">
                                Min 8 characters including at least one number, one capital letter,
                                one tiny
                            </span>
                        </div>
                        <button type="submit" className="btn">
                            Register
                        </button>
                        <p id="message"></p>
                    </form>
                    <p>
                        Already have an account ?
                        <Link to="/login">
                            <span className="signupLink">To log in</span>
                        </Link>
                    </p>
                </article>
            </section>
        </>
    );
};

export default Signup;
