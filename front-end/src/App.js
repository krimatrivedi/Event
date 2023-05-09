import { Route, Routes, BrowserRouter } from "react-router-dom";
import EventsNavBar from "./components/EventsNavBar";
import Events from "./modules/Events";
import Eventliked from "./modules/Eventliked";
import Eventowner from "./modules/Eventowner";
import { ChakraProvider, theme } from "@chakra-ui/react";
import EventView from "./modules/EventView";
import RestaurantEditView from "./modules/RestaurantEditView";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import LandingLayout from "./components/LandingLayout";
import Profile from "./components/Profile";
import ProfileEdit from "./components/ProfileEdit";
import EventCreate from "./components/EventCreate";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter style={{ height: "100vh" }}>
        <Routes>
          <Route path="/" element={<LandingLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
          </Route>
          <Route path="/events" element={<Events />}></Route>
          <Route path="/restaurants/:id" element={<EventView />}></Route>
          <Route path="/ownerevent" element={<Eventowner />}></Route>
          <Route path="/like" element={<Eventliked />}></Route>
          <Route
            path="/restaurants/:id/edit"
            element={<RestaurantEditView />}
          ></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/profile/edit" element={<ProfileEdit />}></Route>
          <Route
            path="/event/create"
            element={<EventCreate />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
