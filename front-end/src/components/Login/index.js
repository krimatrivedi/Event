import React from "react";
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import { useMemo, useState, useEffect, useLocation } from "react";
import { Box, Flex, Heading, Spacer, Text, Center, Square } from "@chakra-ui/react";

const Login = () => {
    document.body.style = 'background: rgb(71, 64, 210); background: linear-gradient(to top,rgba(137, 247, 254, 1),rgba(102, 166, 255, 1));';
    const initState = { username: "", password: "" };
    const [formValue, setFormValue] = useState(initState);
    const [formErr, setFormErr] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [user, setUser] = useState({ token: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValue({ ...formValue, [name]: value });
        setFormErr(formErr => ({ ...formErr, [name]: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErr(validation(formValue));
        setIsSubmit(true);
    };

    useEffect(() => {
        // Source: https://stackoverflow.com/questions/38510640/how-to-make-a-rest-post-call-from-reactjs-code
        if (Object.keys(formErr).length === 0 && isSubmit) {
            // Validated now send the request
            fetch('http://127.0.0.1:8000/accounts/api/token/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formValue.username,
                    password: formValue.password,
                })
            })
                .then(response => response.json())
                .then(json => {
                    if (!json.access) {
                        alert("Login Failed. Please Recheck Login Information.");
                    }
                    else {
                        // Source: https://stackoverflow.com/questions/40399873/initializing-and-using-sessionstorage-in-react
                        setUser({ token: json.access });
                        window.sessionStorage.setItem("token", json.access);
                        const config = {
                            headers: {
                                Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
                            },
                        };
                        axios
                        .get(
                            `http://127.0.0.1:8000/accounts/view/`,
                            config
                        )
                        .then(respond => {
                            window.sessionStorage.setItem("username", respond.data.username);
                            window.sessionStorage.setItem("avatar", respond.data.avatar);
                        })
                        .catch((err) => {
                            if (err.response.status === 401){
                                navigate('/login');
                                alert('Login Failed.');
                            }
                        });
                        alert("Login Success.");
                        document.body.style = 'background: transparent;';
                        //home page dashboard
                        navigate('/events');
                    }
                })
        }
    }, [formErr]);

    const validation = (formValue) => {
        const errors = {};
        if (!formValue.username) {
            errors.username = "Username is required."
        }
        if (!formValue.password) {
            errors.password = "Password is required."
        }
        return errors;
    }

    // <pre>{JSON.stringify(formValue, undefined, 2)}</pre>
    return (<div className="Landing">
        <Link to="/">
            <Flex>
                <Center w='100px'>
                    <img className="imageLogo" src={require('../../assets/images/logo.png')}
                        width="124" height="120" alt="logo"></img>
                </Center>
                <Square size='150px' >
                <Text fontSize='4xl' color='white'><h1><b>Even</b>t</h1></Text>
                </Square>
            </Flex>
        </Link>

        <form onSubmit={handleSubmit}>
            <h3 class="landTitle">Login</h3>

            <div className="form-group">
                <label>Username</label>
                <input type="text" name="username" value={formValue.username} onChange={handleChange}
                    className="form-control" placeholder="Username" />
            </div>
            <p>{formErr.username}</p>

            <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" id="passwordSign" value={formValue.password} onChange={handleChange}
                    className="form-control" placeholder="Password" />
            </div>
            <p>{formErr.password}</p>

            <a id="noaccount"> <Link to="/signup">No account? Sign up now!</Link> </a> <br />
            <button className="button blue">Login</button>
        </form></div>
    );
}


export default Login;
