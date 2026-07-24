import {
  Box,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Grid,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Spinner,
  Stack,
  Tag,
  Text,
  useDisclosure,
  Badge,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const CUISINES = ["Mexican", "Italian", "Chinese", "Indian", "German", "Greek", "Filipino", "Japanese", "Continental"];

export const Explore = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [vegFilter, setVegFilter] = useState("all");
  const [cuisineFilter, setCuisineFilter] = useState("all");

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/recipes`)
      .then((res) => {
        setRecipes(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  const filtered = recipes.filter((r) => {
    const matchSearch =
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.ingredients?.toLowerCase().includes(search.toLowerCase());
    const matchVeg = vegFilter === "all" || r.vegOrNonVeg === vegFilter;
    const matchCuisine = cuisineFilter === "all" || r.cuisine === cuisineFilter;
    return matchSearch && matchVeg && matchCuisine;
  });

  const handleApply = () => onClose();

  const diffColor = { Easy: "green", Medium: "orange", Hard: "red" };

  return (
    <Box>
      {/* Hero */}
      <Box h={{ base: "35vh", md: "45vh" }} position="relative">
        <Image
          src="https://images.unsplash.com/photo-1495546968767-f0573cca821e?auto=format&fit=crop&q=80&w=2831"
          alt="Hero"
          w="100%"
          h="100%"
          objectFit="cover"
        />
        <Flex
          position="absolute"
          inset="0"
          align="center"
          justify="center"
          direction="column"
          gap="1.5rem"
          bg="rgba(0,0,0,0.35)"
        >
          <Heading
            color="white"
            textAlign="center"
            size={{ base: "lg", md: "2xl" }}
            textShadow="1px 1px 4px black"
            px="1rem"
          >
            Find the best recipes in a few steps!
          </Heading>
          <Button colorScheme="orange" size="lg">
            Search now
          </Button>
        </Flex>
      </Box>

      {/* Search Bar */}
      <Box boxShadow="0 4px 10px #0002" py="1rem" px="1.5rem" bg="white">
        <Flex
          gap="1rem"
          align="center"
          width="min(80rem,100%)"
          mx="auto"
          flexWrap="wrap"
        >
          <InputGroup maxW="320px" flex={1}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search for a recipe..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          <Button
            leftIcon={
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="#F58332" d="M9 5a1 1 0 1 0 0 2a1 1 0 0 0 0-2zM6.17 5a3.001 3.001 0 0 1 5.66 0H19a1 1 0 1 1 0 2h-7.17a3.001 3.001 0 0 1-5.66 0H5a1 1 0 0 1 0-2h1.17zM15 11a1 1 0 1 0 0 2a1 1 0 0 0 0-2zm-2.83 0a3.001 3.001 0 0 1 5.66 0H19a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H5a1 1 0 1 1 0-2h7.17z"/>
              </svg>
            }
            variant="outline"
            colorScheme="orange"
            onClick={onOpen}
          >
            Advanced Search
          </Button>
          {(vegFilter !== "all" || cuisineFilter !== "all") && (
            <Button
              size="sm"
              variant="ghost"
              colorScheme="gray"
              onClick={() => { setVegFilter("all"); setCuisineFilter("all"); }}
            >
              Clear Filters
            </Button>
          )}
          <Text color="gray.500" fontSize="sm" ml="auto">
            {filtered.length} recipes found
          </Text>
        </Flex>
      </Box>

      {/* Filter Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Advanced Search</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="1rem">
              <Box>
                <Text fontWeight="600" mb="0.5rem">Type</Text>
                <RadioGroup value={vegFilter} onChange={setVegFilter}>
                  <Stack direction="row" spacing={5}>
                    <Radio colorScheme="gray" value="all">All</Radio>
                    <Radio colorScheme="green" value="veg">🥦 Veg Only</Radio>
                    <Radio colorScheme="red" value="non-veg">🍗 Non-Veg Only</Radio>
                  </Stack>
                </RadioGroup>
              </Box>
              <Box>
                <Text fontWeight="600" mb="0.5rem">Cuisine</Text>
                <Select value={cuisineFilter} onChange={(e) => setCuisineFilter(e.target.value)}>
                  <option value="all">All Cuisines</option>
                  {CUISINES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr="1rem" onClick={onClose}>Close</Button>
            <Button colorScheme="orange" onClick={handleApply}>Apply</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Recipe Grid */}
      <DIV>
        {isLoading ? (
          <Flex justify="center" align="center" py="5rem" gridColumn="1/-1">
            <Spinner thickness="4px" speed="0.65s" color="orange.400" size="xl" />
          </Flex>
        ) : filtered.length === 0 ? (
          <Flex direction="column" align="center" py="5rem" gridColumn="1/-1" color="gray.400">
            <Text fontSize="3rem">🍽️</Text>
            <Text fontWeight="600" mt="1rem">No recipes found</Text>
            <Text fontSize="sm">Try adjusting your search or filters</Text>
          </Flex>
        ) : (
          filtered.map((recipe) => (
            <Card
              key={recipe._id}
              borderRadius="16px"
              overflow="hidden"
              boxShadow="md"
              transition="all 0.2s ease"
              _hover={{ boxShadow: "xl", transform: "translateY(-4px)" }}
              cursor="pointer"
              onClick={() => navigate(`/recipe/${recipe._id}`)}
            >
              <CardHeader p="0">
                <Image
                  src={recipe.image || "https://via.placeholder.com/400x200?text=No+Image"}
                  alt={recipe.title}
                  w="100%"
                  h="200px"
                  objectFit="cover"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/400x200?text=No+Image"; }}
                />
              </CardHeader>
              <Box p="1rem">
                <Heading fontSize="md" mb="0.5rem" noOfLines={1} textTransform="uppercase">
                  {recipe.title}
                </Heading>
                <Flex gap="0.5rem" flexWrap="wrap" mb="0.75rem">
                  {recipe.cuisine && <Badge colorScheme="blue">{recipe.cuisine}</Badge>}
                  {recipe.vegOrNonVeg && (
                    <Badge colorScheme={recipe.vegOrNonVeg === "veg" ? "green" : "red"}>
                      {recipe.vegOrNonVeg === "veg" ? "🥦 Veg" : "🍗 Non-Veg"}
                    </Badge>
                  )}
                  {recipe.difficulty && (
                    <Badge colorScheme={diffColor[recipe.difficulty] || "gray"}>
                      {recipe.difficulty}
                    </Badge>
                  )}
                </Flex>
                <Flex gap="1rem" color="gray.500" fontSize="sm" mb="0.75rem">
                  {recipe.cookingTime && <Text>⏱ {recipe.cookingTime} min</Text>}
                  {recipe.calories && <Text>🔥 {recipe.calories} cal</Text>}
                  {recipe.likes > 0 && <Text>❤️ {recipe.likes}</Text>}
                </Flex>
                <CardFooter p="0">
                  <Button
                    size="sm"
                    colorScheme="orange"
                    variant="outline"
                    w="full"
                    onClick={(e) => { e.stopPropagation(); navigate(`/recipe/${recipe._id}`); }}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Box>
            </Card>
          ))
        )}
      </DIV>
    </Box>
  );
};

const DIV = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: min(80rem, 100%);
  margin-inline: auto;
  padding: 3rem 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1.5rem 1rem;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export default Explore;