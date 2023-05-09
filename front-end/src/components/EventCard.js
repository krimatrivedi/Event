import { Box, Image, Stack, IconButton, Flex, HStack } from "@chakra-ui/react";
import * as colors from "../utils/colors";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaQuestionCircle } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/styles";
import "../../src/assets/css/pagination.css";
//all posts of users , pagination is applied if post's count>10.
const useStyles = makeStyles(theme => ({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: "0.5rem"
  },
}));
/* Used https://chakra-ui.com/docs/components/layout/box as a reference*/
function EventCard({ restaurantImg, title,date,time, likes, address,id }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const [isLikedState, setIsLikedState] = useState(false);
  const [likesState, setLikesState] = useState(likes);
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
    doesLike();
  }, []);

  const property = {
    imageUrl: restaurantImg,
    title: title,
    date: date,
    time: time,
    address:address,
  };

  return (
    <Stack marginBottom="1rem">
      <Box
        background={colors.purple.light}
        maxHeight="300px"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        style={{ cursor: "pointer",flex:1}}
        _hover={{ transform: "scale(1.02)" }}
        onClick={() => navigate(`/restaurants/${id}`)}
      >
            
       <div className="rescontainer">
        <Image src={property.imageUrl} height="165px" width="285px" />
        
        <Box p="6">
          <Box display="flex" alignItems="baseline"></Box>
          <Box
            mt="1"
            fontWeight="bold"
            as="h4"
            lineHeight="tight"
            isTruncated
            color="black"
            align="left"
          >
            {property.title}
          </Box>
        
          <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
            align="left"
            color={colors.pink.medium}
          >
            {property.time},{property.date}
          </Box>
          <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
            align="left"
            color="grey"
          >
            {property.address}
          </Box>
          <Box display="flex" mt="2" alignItems="center">
            <Box as="span" ml="2" color="gray.500" fontSize="sm">
              {likesState} likes
            </Box>
          </Box>
        </Box>
        </div>
      </Box>
      
      <Box boxShadow="dark-lg" p="2" rounded="md" bg="white">
        <HStack>
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
         </HStack>
         </Box>
    </Stack>
  );
}

export default EventCard;
