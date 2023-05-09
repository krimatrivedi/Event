import React from "react";
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import { useMemo, useState, useEffect, useLocation } from "react";
import {
  Box, Flex, Heading, Spacer, Text, Center, Square, FormLabel,
  FormControl, Input, FormHelperText, WrapItem, Avatar, Button, IconButton
} from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";

import EventsNavBar from "../components/EventsNavBar";
import "./style.css"
import * as colors from "../utils/colors";
//user's liked events shows if exists
function Eventliked({ likes, id }) {

  const initState = { name: "", address: "", date: "", email: "", time: "", avatar: "" };
  const [userProfile, setuserProfile] = useState([]);
  const [isLikedState, setIsLikedState] = useState(false);
  const [likesState, setLikesState] = useState(likes);
  const navigate = useNavigate();
  const [eventsReq, setEventsReq] = useState([]);

  const config = {
    headers: {
      Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
    },
  };

  const doesLike = () => {
    axios
      .get(`http://127.0.0.1:8000/restaurants/doeslike/${id}/`, config)
      .then((res) => {
        setIsLikedState(res.data.is_liked);
      })
      .catch((err) => {
        if (err.response.status == 401) navigate("/login");
      });
  };

  const likeRestaurant = async () => {
    axios
      .patch(`http://127.0.0.1:8000/restaurants/${id}/like/`, null, config)
      .then(() => {
        setIsLikedState(true);
        setLikesState(likesState + 1);
      })
      .catch((err) => {
        if (err.response.status == 401) navigate("/login");
      });
  };

  const unLikeRestaurant = async () => {
    axios
      .patch(`http://127.0.0.1:8000/restaurants/${id}/unlike/`, null, config)
      .then(() => {
        setIsLikedState(false);
        setLikesState(likesState - 1);
      })
      .catch((err) => {
        if (err.response.status == 401) navigate("/login");
      });
  };


  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/restaurants/like/`,
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
    doesLike();
  }, []);

  const handleRedirect = (e) => {
    e.preventDefault();
    navigate('/profile/edit');
  };
  
  return (
    <Box>
      <EventsNavBar>
      </EventsNavBar>
      <Heading
        as="h3"
        size="lg"
      >
        All liked Events

      </Heading>
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
                <Box w='300px' class='idCard'>
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
                  <Flex>
                    <Box w='50.5%' fontWeight="bold" align="left" >
                      <FormLabel htmlFor='email' className="profLabel">{restraurant.time}</FormLabel>
                    </Box >
                    <Box w='49.5%' align="left" >
                      <IconButton
                        marginRight="9rem"
                        variant="link"
                        aria-label="like"
                        opacity={isLikedState ? "100%" : "50%"}
                        onClick={() =>
                          isLikedState ? unLikeRestaurant() : likeRestaurant()
                        }
                        _hover={{ transform: "scale(1.25)" }}
                        _focus={{ outline: "none" }}
                        icon={
                          <FaHeart
                            style={{
                              color: colors.pink.medium,
                              width: "25px",
                              height: "25px",
                            }}
                          />
                        }
                      />
                    </Box >
                  </Flex>
                  <FormLabel htmlFor='email' color="grey" className="profLabel">{restraurant.address}</FormLabel>

                  <p></p>




                </Box>
              </Flex>
            </FormControl>
          </div>
        ))}
    </Box>
  );
}




export default Eventliked;
