import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMemo, useState, useEffect, useLocation } from "react";
import {
  Box,
  Flex,
  Heading,
  Spacer,
  Text,
  Center,
  Square,
  FormLabel,
  FormControl,
  Input,
  FormHelperText,
  WrapItem,
  Avatar,
  Button,
} from "@chakra-ui/react";
import EventsNavBar from "../EventsNavBar";
// event is created here and image of event is saved in media folder of backend
const EventCreate = () => {
  const [userProfile, setuserProfile] = useState([]);

  const initState = {
    name: "",
    address: "",
    email: "",
    date: "",
    time: "",

    avatar: "",
  };
  const [formValue, setFormValue] = useState(initState);
  const [formErr, setFormErr] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
    },
  };

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormValue({ ...formValue, [e.target.name]: e.target.files[0] });
      setuserProfile({
        ...userProfile,
        [e.target.name]: URL.createObjectURL(e.target.files[0]),
      });
    } else {
      const { name, value } = e.target;
      setFormValue({ ...formValue, [name]: value });
      setFormErr((formErr) => ({ ...formErr, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErr(validation(formValue));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErr).length === 0 && isSubmit) {
      const fd = new FormData();
      fd.append("_method", "POST");
      if (formValue.name !== "") {
        fd.append("name", formValue.name);
      }
      if (formValue.address !== "") {
        fd.append("address", formValue.address);
      }
      if (formValue.email !== "") {
        fd.append("email", formValue.email);
      }

      if (formValue.date !== "") {
        fd.append("date", formValue.date);
      }
      if (formValue.time !== "") {
        fd.append("time", formValue.time);
      }

      if (formValue.avatar !== "") {
        fd.append("logo", formValue.avatar);
      }

      // Validated now send the request
      axios
        .post(`http://127.0.0.1:8000/restaurants/new/`, fd, config)
        .then((res) => {
          alert("Event Successfully Created.");
          navigate(`/restaurants/${res.data.id}`);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            navigate("/login");
            alert("User Validation Failed. Please Login.");
          }
          if (!error.response.data.id) {
            // output error msg
            alert("Creation Failed: Check Error Messages.");
            if (error.response.data.name) {
              setFormErr((formErr) => ({
                ...formErr,
                name: error.response.data.username,
              }));
            }
            if (error.response.data.address) {
              setFormErr((formErr) => ({
                ...formErr,
                address: error.response.data.address,
              }));
            }
            if (error.response.data.email) {
              setFormErr((formErr) => ({
                ...formErr,
                email: error.response.data.email,
              }));
            }

            if (error.response.data.avatar) {
              setFormErr((formErr) => ({
                ...formErr,
                avatar: error.response.data.avatar,
              }));
              alert("Avatar Upload Failed.");
            }
          }
          console.log(error.response);
        });
    }
  }, [formErr]);

  const validation = (formValue) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!formValue.name) {
      errors.name = "Name is required.";
    }
    if (!formValue.address) {
      errors.address = "Address is required.";
    }
    if (!formValue.email) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formValue.email)) {
      errors.email = "Email Format Invalid.";
    }

    if (!formValue.avatar) {
      errors.avatar = "Logo Required.";
      alert("Please Upload a Logo.");
    }
    return errors;
  };

  // Check if the user currently owns a event.
  // Use an axios API request to  http://127.0.0.1:8000/restaurants/owned/
  // If yes, redirect to the event page.
  // If no, render the form.


  return (
    <Box>
      <EventsNavBar></EventsNavBar>

      <div className="Profile">
        <FormControl className="profForm" onSubmit={handleSubmit}>
          <Flex>
            <Center>
              <Box w="300px" class="idCard">
                <Box>
                  <Center>
                    <Box>
                      <Avatar
                        size="2xl"
                        name="userAvatar"
                        src={userProfile.avatar}
                      />{" "}
                    </Box>
                  </Center>
                  <Center>
                    <Box>
                      <Text as="abbr" fontSize="2xl" color={"black"}>
                        {formValue.name}
                      </Text>
                    </Box>
                  </Center>
                  <Center>
                    <Box>
                      <Text as="kbd" color={"gray"}>
                        {formValue.address}
                      </Text>
                    </Box>
                  </Center>
                </Box>

                <Center pl={"28%"} pt={"3%"} maxWidth={"72%"}>
                  <Button
                    className="transButton"
                    name="avatar"
                    colorScheme="transparent"
                    size="md"
                  >
                    <input
                      type="file"
                      name="avatar"
                      id="submitButton"
                      onChange={handleChange}
                    />
                  </Button>
                </Center>
              </Box>
            </Center>

            <Box w="70%">
              <h4 className="profileTitle">Create Your Event</h4>

              <FormLabel htmlFor="name" color="black">
                Event Name
              </FormLabel>
              <Input id="name" name="name" onChange={handleChange} />
              <p>{formErr.name}</p>

              <FormLabel htmlFor="address" color="black">
                Address
              </FormLabel>
              <Input id="address" name="address" onChange={handleChange} />
              <p>{formErr.address}</p>

              <FormLabel htmlFor="email" color="black">
                Email
              </FormLabel>
              <Input
                id="email"
                name="email"
                type="email"
                onChange={handleChange}
              />
              <p>{formErr.email}</p>

              <Flex>

                <Box w="50.5%">
                  <FormLabel htmlFor="date" color="black">
                    date
                  </FormLabel>
                </Box>
                <Box w="50.5%">
                  <FormLabel htmlFor="time" color="black">
                    Time
                  </FormLabel>
                </Box>

              </Flex>
              <Flex>
                <Box w="1%"></Box>
                <Center w="49.5%">
                  <Input id="phone" type="date" name="date" onChange={handleChange} />
                </Center>
                <Box w="1%"></Box>
                <Center w="49.5%">
                  <Input id="phone" type="time" name="time" onChange={handleChange} />
                </Center>
                <Box w="1%"></Box>

              </Flex>
              <Center pr={"40%"} pt={"3%"}>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  colorScheme="blue"
                  size="md"
                >
                  Create Event
                </Button>
              </Center>
            </Box>
          </Flex>
        </FormControl>
      </div>
    </Box>
  );
};

export default EventCreate;
