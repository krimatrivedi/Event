import {
  Box,
  Flex,
  HStack,
  Image,
  Text,
  Input,
  Button,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Select,
} from "@chakra-ui/react";
import logo from "../assets/images/logo.png";
import * as colors from "../utils/colors";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FaHome,
  FaHeart,
  FaNewspaper,
  FaUtensils,

  FaPlus,
  FaCaretDown,
  FaUserCircle,
} from "react-icons/fa";
import Notification from "./Notification";
import axios from "axios";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";


//navigate function will lead to app.js to look for route, notification appears if any post is liked, settings (profile,edit profile,log out)
function NavBar(id) {
  const navigate = useNavigate();
  const [isOwner, setIsOwner] = useState(false);
  const [restID, setRestID] = useState(0);

  const config = {
    headers: {
      Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
    },
  };

  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/restaurants/owned/`,
        config
      )
      .then(respond => {
        setRestID(respond.data);
        setIsOwner(true);

      });
  }, []);

  return (
    <Box bg={colors.purple.light} h="70px">
      <Flex justify="space-between">
        <HStack>
          <Image
            onClick={() => navigate("/events")}
            style={{
              cursor: "pointer",
              height: "50px",
              marginLeft: "1rem",
              marginTop: ".5rem",
            }}
            src={logo}
            alt="Restify"
          ></Image>
          <Flex>
            <Text
              onClick={() => navigate("/events")}
              cursor="pointer"
              style={{
                color: "white",
                fontSize: "1.75rem",
                fontWeight: "bold",
              }}
            >
              Even
            </Text>
            <Text
              onClick={() => navigate("/events")}
              cursor="pointer"
              style={{ color: "white", fontSize: "1.75rem" }}
            >
              t
            </Text>
          </Flex>


          <ButtonGroup
            style={{ marginTop: "0.5rem", marginLeft: "2rem" }}
            spacing={6}
          >
            <Button
              style={{ textDecoration: "none" }}
              leftIcon={
                <FaHome
                  style={{ color: "black", width: "20px", height: "20px" }}
                />
              }
              variantColor="teal"
              variant="link"
              onClick={() => navigate("/events")}
            >
              Home
            </Button>
            <Button
              style={{ textDecoration: "none" }}
              leftIcon={
                <FaNewspaper
                  style={{ color: "black", width: "20px", height: "20px" }}
                />
              }
              variantColor="teal"
              variant="link"

              onClick={() => {

                navigate("/ownerevent")

              }}
            >

              Feed
            </Button>
            <Button
              style={{ textDecoration: "none" }}
              leftIcon={
                <FaHeart
                  style={{ color: "black", width: "20px", height: "20px" }}
                />
              }
              variantColor="teal"
              variant="link"
              onClick={() => {
                navigate("/like")
              }}
            >
              Liked
            </Button>
            <Button
              style={{ textDecoration: "none" }}
              leftIcon={
                <FaPlus
                  style={{ color: "blue", width: "20px", height: "20px" }}
                />
              }
              variantColor="teal"
              variant="link"
              onClick={() => {
                navigate("/event/create")
              }}
            >
              Create an event
            </Button>
          </ButtonGroup>
        </HStack>
        <HStack style={{ marginTop: "0.5rem", marginRight: "4rem" }}>
          <Notification style={{ textDecoration: "none" }} />
          <Menu>
            <MenuButton
              style={{
                marginLeft: "1.5rem",
                background: "grey",
                opacity: "0.6",
                color: "black",
                textDecoration: "none",
              }}
              variant="link"
              as={Button}
              rightIcon={<FaCaretDown />}
              leftIcon={
                <Avatar
                  size="xs"
                  name="userAvatar"
                  src={window.sessionStorage.getItem("avatar")}
                />
              }
            >
              {window.sessionStorage.getItem("username")}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
              <MenuItem onClick={() => navigate("/profile/edit")}>
                Edit Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  const config = {
                    headers: {
                      Authorization: `Bearer ${window.sessionStorage.getItem(
                        "token"
                      )}`,
                    },
                  };
                  window.sessionStorage.setItem("token", "");
                  navigate("/login");
                }}
              >
                Log out
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
}

export default NavBar;
