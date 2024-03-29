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
import {
  FaHome,
  FaNewspaper,
  FaUtensils,
  FaCaretDown,
  FaUserCircle,
} from "react-icons/fa";
import Notification from "./Notification";
import axios from "axios";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";

function NavBar() {
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
        setRestID(respond.data.id);
        setIsOwner(true);
      });
  }, []);

  return (
    <Box bg={colors.purple.medium} h="70px">
      <Flex justify="space-between">
        <HStack>
          <Image
            onClick={() => navigate("/restaurants")}
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
              onClick={() => navigate("/restaurants")}
              cursor="pointer"
              style={{
                color: "white",
                fontSize: "1.75rem",
                fontWeight: "bold",
              }}
            >
              Resti
            </Text>
            <Text
              onClick={() => navigate("/restaurants")}
              cursor="pointer"
              style={{ color: "white", fontSize: "1.75rem" }}
            >
              fy
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
                  style={{ color: "white", width: "20px", height: "20px" }}
                />
              }
              variantColor="white"
              variant="link"
              onClick={() => navigate("/restaurants")}
            >
              Home
            </Button>
            <Button
              style={{ textDecoration: "none" }}
              leftIcon={
                <FaNewspaper
                  style={{ color: "white", width: "20px", height: "20px" }}
                />
              }
              variantColor="white"
              variant="link"
              onClick={() => navigate("/feed")}
            >
              Feed
            </Button>
            <Button
              style={{ textDecoration: "none" }}
              leftIcon={
                <FaUtensils
                  style={{ color: "blue", width: "20px", height: "20px" }}
                />
              }
              variantColor="white"
              variant="link"
              onClick={() =>{
                if (!isOwner) {
                  navigate("/restaurant/create")
                }
                else {
                  navigate(`/restaurants/${restID}`)
                }
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
                color: "white",
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
