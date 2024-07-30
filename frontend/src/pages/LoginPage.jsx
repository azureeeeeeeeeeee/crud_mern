import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Heading,
  Box,
  Text,
} from "@chakra-ui/react";
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

const LoginPage = () => {
  const [show, setShow] = useState(false);
  const handleShowPassword = () => setShow(!show);

  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = { email, password };

    try {
      await api.post("/auth/login", data);
      setIsLoggedIn(true);
    } catch (err) {
      console.error(
        "Login error:",
        err.response ? err.response.data.message : err.message
      );
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <Box
      borderRadius="l"
      className="flex flex-col gap-4 w-96 mx-auto my-6 pt-20"
    >
      <Heading as="h2" size="3xl">
        Todo App
      </Heading>
      <form onSubmit={handleLogin} method="POST" className="mt-6">
        <Input
          type="email"
          placeholder="Enter Email"
          onChange={(e) => setemail(e.target.value)}
        />
        <InputGroup className="my-4" size="md">
          <Input
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder={show ? "Enter Password" : "********"}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Text>
          Do not have an account ?{" "}
          <Link to="/register" className="text-sky-500">
            register
          </Link>
        </Text>
        <Button type="submit" colorScheme="blue">
          Login
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;
