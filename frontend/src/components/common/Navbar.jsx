import React from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { logoutUser } from "../../redux/authReducer/actions";
import styled from "styled-components";

export const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const isAuth = useSelector((store) => store.authReducer.isAuth);
  const token = useSelector((store) => store.authReducer.token);
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar on admin page
  if (location.pathname === "/admin") return null;

  const logoutHandler = () => {
    dispatch(logoutUser(token, toast, navigate));
  };

  return (
    <NAV>
      <Box className="nav-wrapper">
        {/* Main navbar row */}
        <Flex className="nav-inner" align="center" justify="space-between">
          {/* Logo */}
          <Text
            as={Link}
            to="/"
            className="logo"
            fontFamily="Kaushan Script"
            fontSize={{ base: "1.4rem", md: "1.8rem" }}
            fontWeight="bold"
            letterSpacing="1px"
          >
            Recipe<span className="logo-accent">Hub</span>
          </Text>

          {/* Desktop Nav Links */}
          <Flex
            display={{ base: "none", md: "flex" }}
            align="center"
            gap={{ md: "1.5rem", lg: "2rem" }}
          >
            <NavLink to="/explore" label="Explore" current={location.pathname} />
            {isAuth && (
              <>
                <NavLink to="/feed" label="Feed" current={location.pathname} />
                <NavLink to="/account" label="Account" current={location.pathname} />
              </>
            )}
          </Flex>

          {/* Desktop Auth Buttons */}
          <Flex display={{ base: "none", md: "flex" }} gap="0.75rem" align="center">
            {isAuth ? (
              <Button
                onClick={logoutHandler}
                variant="outline"
                colorScheme="orange"
                size="sm"
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="outline"
                  colorScheme="orange"
                  size="sm"
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  to="/signup"
                  colorScheme="orange"
                  size="sm"
                >
                  SignUp
                </Button>
              </>
            )}
          </Flex>

          {/* Mobile Hamburger */}
          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant="ghost"
            aria-label="Toggle Navigation"
          />
        </Flex>

        {/* Mobile Menu */}
        <Collapse in={isOpen} animateOpacity>
          <Box className="mobile-menu" pb="1rem">
            <Stack spacing="0.5rem" mb="1rem">
              <MobileLink to="/explore" label="Explore" onClick={onToggle} current={location.pathname} />
              {isAuth && (
                <>
                  <MobileLink to="/feed" label="Feed" onClick={onToggle} current={location.pathname} />
                  <MobileLink to="/account" label="Account" onClick={onToggle} current={location.pathname} />
                </>
              )}
            </Stack>


            <Flex gap="0.75rem" px="0.5rem">
              {isAuth ? (
                <Button
                  onClick={() => { logoutHandler(); onToggle(); }}
                  colorScheme="orange"
                  variant="outline"
                  size="sm"
                  w="full"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    as={Link}
                    to="/login"
                    onClick={onToggle}
                    variant="outline"
                    colorScheme="orange"
                    size="sm"
                    flex={1}
                  >
                    Login
                  </Button>
                  <Button
                    as={Link}
                    to="/signup"
                    onClick={onToggle}
                    colorScheme="orange"
                    size="sm"
                    flex={1}
                  >
                    SignUp
                  </Button>
                </>
              )}
            </Flex>
          </Box>
        </Collapse>
      </Box>
    </NAV>
  );
};

const NavLink = ({ to, label, current }) => {
  const isActive = current === to;
  return (
    <Text
      as={Link}
      to={to}
      fontWeight={isActive ? "700" : "500"}
      color={isActive ? "orange.500" : "gray.700"}
      borderBottom={isActive ? "2px solid" : "2px solid transparent"}
      borderColor={isActive ? "orange.500" : "transparent"}
      pb="2px"
      _hover={{ color: "orange.500", textDecoration: "none" }}
      transition="all 0.15s"
    >
      {label}
    </Text>
  );
};

const MobileLink = ({ to, label, onClick, current }) => {
  const isActive = current === to;
  return (
    <Text
      as={Link}
      to={to}
      onClick={onClick}
      px="0.5rem"
      py="0.6rem"
      fontWeight={isActive ? "700" : "500"}
      color={isActive ? "orange.500" : "gray.700"}
      borderRadius="8px"
      bg={isActive ? "orange.50" : "transparent"}
      _hover={{ bg: "orange.50", color: "orange.500", textDecoration: "none" }}
      display="block"
    >
      {label}
    </Text>
  );
};

const NAV = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1000;
  background: white;
  box-shadow: 0 1px 0 #e2e8f0;

  .nav-wrapper {
    max-width: 80rem;
    margin: 0 auto;
    padding: 0 1.25rem;
  }

  .nav-inner {
    height: 64px;
  }

  .logo {
    color: #1a202c;
    text-decoration: none;

    .logo-accent {
      color: #ed8936;
    }
  }

  .mobile-menu {
    border-top: 1px solid #e2e8f0;
    padding-top: 0.75rem;
  }

  @media (max-width: 480px) {
    .nav-inner {
      height: 56px;
    }

    .logo {
      font-size: 1.2rem;
    }
  }
`;

export default Navbar;