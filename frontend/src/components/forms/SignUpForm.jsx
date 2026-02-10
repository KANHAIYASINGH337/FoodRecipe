import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import { createUser } from "../../redux/authReducer/actions";
import { useDispatch } from "react-redux";
import styled from "styled-components";

export const SignUpForm = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createUser(formData, toast, navigate));
  };

  return (
    <StyledBox>
      <Heading textTransform={"uppercase"} mb="2rem" size="2xl">
        Sign Up
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input className="signup-input" type="text" name="name" onChange={handleChange} />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input className="signup-input" type="email" name="email" value={formData.email} onChange={handleChange} />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input className="signup-input" type="password" name="password" onChange={handleChange} />
        </FormControl>
        <Button type="submit" colorScheme="blue" mt={4}>
          Sign Up
        </Button>
      </form>
    </StyledBox>
  );
};

const StyledBox = styled(Box)`
  .signup-input {
    caret-color: black !important;
    cursor: text;
  }
  
  .signup-input:focus {
    caret-color: black !important;
  }
`;
