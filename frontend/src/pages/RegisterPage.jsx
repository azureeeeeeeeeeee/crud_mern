import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Heading,
  Box,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
// import { toast } from "react-toastify";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");

  const handleShowPassword = () => setShow(!show);
  const handleShowPassword2 = () => setShow2(!show2);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      return alert("Password do not match !");
    }

    const data = { username, password, email };
    try {
      await api.post("/auth/register", data);
      navigate("/login");
    } catch (error) {
      console.log("Error occured : ", error);
    }
  };

  return (
    <Box
      borderRadius="l"
      className="flex flex-col gap-4 w-96 mx-auto my-6 pt-20"
    >
      <Heading as="h2" size="3xl">
        Todo App
      </Heading>
      <Box className="mt-4">
        <form onSubmit={handleRegister} method="POST">
          <Box className="text-left mb-4">
            <Text>* You Cannot Change username</Text>
            <Input
              placeholder="Enter Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Box>

          <Box className="text-left mb-4">
            <Text>Email</Text>
            <Input
              type="email"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>

          <Box className="text-left my-4">
            <Text>Password</Text>
            <InputGroup className="" size="md">
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
          </Box>

          <Box className="text-left">
            <Text>Confirm Password</Text>
            <InputGroup className="" size="md">
              <Input
                pr="4.5rem"
                type={show2 ? "text" : "password"}
                placeholder={show2 ? "Confirm Password" : "********"}
                onChange={(e) => setPassword2(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleShowPassword2}>
                  {show2 ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>

          <Text>
            Already have an account ?{" "}
            <Link to="/login" className="text-sky-500">
              login
            </Link>
          </Text>

          <Button type="submit" className="mt-4" colorScheme="blue">
            Register
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default RegisterPage;
