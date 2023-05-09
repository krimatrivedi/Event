import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Button,
  Heading,
  Spinner,
  Center,
  Tag,
  TagLabel,
  Image,
  Grid,
  GridItem,
  Stack,
} from "@chakra-ui/react";
import { FaHeart, FaUserFriends } from "react-icons/fa";
import * as colors from "../../utils/colors";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EventsNavBar from "../../components/EventsNavBar";
import MenuItems from "../../components/MenuItems";
import Carousel from "../../components/Carousel";
import { useNavigate } from "react-router-dom";

//User's selected or when created single post shows

function EventView() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState([]);

  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const config = {
    headers: {
      Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
    },
  };
  const navigate = useNavigate();

  const likeRestaurant = async () => {
    console.log("was liked")
    axios
      .patch(`http://127.0.0.1:8000/restaurants/${id}/like/`, null, config)
      .then(() => {
        setLikes(likes + 1);
        setIsLiked(true);
      })
      .catch((err) => {
        if (err.response.status == 401) navigate("/login");
      });
  };

  const unLikeRestaurant = async () => {
    axios
      .patch(`http://127.0.0.1:8000/restaurants/${id}/unlike/`, null, config)
      .then(() => {
        setLikes(likes - 1);
        setIsLiked(false);
      })
      .catch((err) => {
        if (err.response.status == 401) navigate("/login");
      });
  };

  const doesLike = () => {
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/restaurants/doeslike/${id}/`, config)
      .then((res) => {
        setIsLiked(res.data.is_liked);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status == 401) navigate("/login");
      });
  };

  const getOwnedRestaurant = () => {
    console.log("hererer")
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/restaurants/owned/", config)
      .then((res) => {
        if (res.data.id != id || !window.sessionStorage.getItem("token")) {
          setIsOwner(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status == 401) navigate("/login");
      });
  };

  const getRestaurant = () => {
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/restaurants/info/${id}/`)
      .then((res) => {
        setRestaurant(res.data);
        setLikes(res.data.likes.length);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status == 401) navigate("/login");
      });
  };

  useEffect(() => {
    getRestaurant();
    getOwnedRestaurant();
    if (!isOwner) {
      doesLike();
    }
  }, [window.location.pathname]);

  return (
    <Box>
      <EventsNavBar />
      {!loading ? (
        <Box
          style={{
            marginLeft: "2rem",
            height: "100vh",
            margin: "auto",
            marginTop: "1rem",
          }}
        >
          <Grid templateColumns="repeat(5, 1fr)" gap={5}>
            <GridItem rowSpan={2} colSpan={1}>
              <Stack marginLeft="1rem">
                <Heading
                  marginTop="0.5rem"
                  as="h3"
                  size="md"
                  style={{ color: "black" }}
                >
                  Event's Information
                </Heading>


                <Box
                  style={{
                    marginTop: "2rem",
                  }}
                  //   boxSize="sm"
                  background="white"
                  borderRadius="4rem"
                  height="200px"
                >
                  <Center>
                    <Image
                      borderRadius="2rem"
                      width="250px"
                      height="150px"
                      marginTop="1.4rem"
                      src={restaurant.logo}
                    />
                  </Center>
                </Box>
                <Center>
                  <Heading
                    marginTop="0.5rem"
                    as="h3"
                    size="xs"
                    style={{ color: "white", opacity: "0.75" }}
                  >
                    {restaurant.name}
                  </Heading>
                </Center>

                {isOwner ? (
                  <Button
                    style={{ marginTop: "1.5rem" }}
                    background={colors.purple.dark}
                    color="white"
                    opacity="0.7"
                    variant="solid"
                    _hover={{ opacity: "1" }}
                    onClick={() => {
                      navigate(`/restaurants/${id}/edit`);
                    }}
                  >
                    Edit
                  </Button>
                ) : (
                  <Stack>

                    <Button
                      leftIcon={<FaHeart />}
                      background={!isLiked ? colors.purple.dark : "#F21F44"}
                      color="white"
                      opacity="0.7"
                      variant="solid"
                      _hover={{ opacity: "1" }}
                      onClick={() => {
                        isLiked ? unLikeRestaurant() : likeRestaurant();
                      }}
                    >
                      {isLiked ? "Unlike" : "Like"}
                    </Button>
                  </Stack>
                )}

                <Center>
                  <Stack marginTop="2rem" marginBottom="1rem">

                    <Tag size="md" background={colors.grey.dark}>
                      <FaHeart color="white" />
                      <TagLabel marginLeft="0.5rem" color="white">
                        {restaurant.likes && `Likes: ${likes}`}
                      </TagLabel>
                    </Tag>
                  </Stack>
                </Center>
              </Stack>
            </GridItem>
            <GridItem rowSpan={8} colSpan={4}>
              <Box marginLeft="2rem">
                <Tabs variant="soft-rounded" marginTop="7rem">
                  <TabList color="white">
                    <Tab color="white">GENERAL</Tab>

                  </TabList>
                  <TabPanels>
                    {/* General */}
                    <TabPanel>
                      <Stack>
                        <Box>
                          <Heading
                            marginTop="0.5rem"
                            as="h3"
                            size="md"
                            style={{ color: "black" }}
                          >
                            {restaurant.name && restaurant.name}
                          </Heading>

                        </Box>
                        <Box>
                          <Heading
                            marginTop="0.5rem"
                            as="h5"
                            size="md"
                            style={{ color: "grey" }}
                          >
                            {restaurant.address && restaurant.address}
                          </Heading>


                        </Box>

                        <Box>
                          <Heading
                            marginTop="0.5rem"
                            as="h3"
                            size="sm"
                            style={{ color: "grey" }}
                          >
                            {restaurant.date && restaurant.date}
                          </Heading>

                        </Box>
                        <Box>

                          <Heading
                            marginTop="0.5rem"
                            as="h3"
                            size="sm"
                            style={{
                              color: "white",
                              opacity: "0.6",
                            }}
                          >
                            {restaurant.time && restaurant.time}
                          </Heading>
                        </Box>

                      </Stack>
                    </TabPanel>

                    <TabPanel>
                      <Carousel res_id={id} />
                    </TabPanel>

                  </TabPanels>
                </Tabs>
              </Box>
            </GridItem>
          </Grid>
        </Box>
      ) : (
        <Box textAlign="center" marginTop="50vh">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color={colors.purple.medium}
            size="xl"
          />
        </Box>
      )}
    </Box>
  );
}

export default EventView;
