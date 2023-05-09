import React from "react";
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import { useMemo, useState, useEffect, useLocation } from "react";
import {
    Box, Flex, Heading, Spacer, Text, Center, Square, FormLabel,
    FormControl, Input, FormHelperText, WrapItem, Avatar, Button
} from "@chakra-ui/react";
import * as colors from "../utils/colors";
import EventsNavBar from "../components/EventsNavBar";


import "./style.css"
//user's created events shows if exists
const Profile = () => {
    const initState = { name: "", address: "", date: "", email: "", time: "", avatar: "", likes: "" };
    const [userProfile, setuserProfile] = useState([]);

    const navigate = useNavigate();
    const [eventsReq, setEventsReq] = useState([]);

    const config = {
        headers: {
            Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
    };
    //look for url of backend
    useEffect(() => {
        axios
            .get(
                `http://127.0.0.1:8000/restaurants/eventowner/`,
                config
            )
            .then(respond => {
                setuserProfile(respond.data);
                setEventsReq(respond.data);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    navigate('/login');
                    alert('User Validation Failed. Please Login.');
                }
            });
    }, []);

    const handleRedirect = (e) => {
        e.preventDefault();
        navigate('/profile/edit');
    };

    return (
        <Box>
            <EventsNavBar>
            </EventsNavBar>

            {eventsReq.count > 0 &&
                eventsReq.results.map((restraurant, index) => (
                    <div className="Profile">
                        <FormControl className="profForm" isReadOnly
                            background={colors.purple.light}
                            maxHeight="300px"
                            borderWidth="1px"
                            borderRadius="lg"
                            overflow="hidden"
                            boxShadow="dark-lg"
                            style={{ cursor: "pointer", flex: 1 }}
                            _hover={{ transform: "scale(1.02)" }}>
                            <Flex><Center>
                                <Box w='300px' class='idCard' >
                                    <Box>
                                        <Center><Box>
                                            <Avatar size='2xl' name='userAvatar' src={restraurant.logo} />{' '}
                                        </Box></Center>

                                        <Center pr={'100%'} pt={'3%'} >
                                            <Button className='transButton' colorScheme='transparent' size='md'> </Button>
                                        </Center>
                                    </Box>
                                </Box></Center>
                                <Box w='70%' p="6">
                                    <Flex>
                                        <Box w='50.5%' fontWeight="bold" >
                                            <FormLabel htmlFor='first-name' color="black">{restraurant.name}</FormLabel>
                                        </Box >
                                    </Flex>
                                    <FormLabel htmlFor='email' color="grey" className="profLabel">{restraurant.date}</FormLabel>
                                    <FormLabel htmlFor='email' className="profLabel">{restraurant.time}</FormLabel>
                                    <FormLabel htmlFor='email' color="grey">{restraurant.address}</FormLabel>
                                    <p></p>
                                </Box>
                            </Flex>
                        </FormControl>
                    </div>
                ))}
        </Box>
    );
}

export default Profile;
