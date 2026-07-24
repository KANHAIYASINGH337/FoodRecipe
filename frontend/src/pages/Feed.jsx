import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Spinner,
  Text,
  useToast,
  Badge,
  Image,
  IconButton,
} from "@chakra-ui/react";
import { BsSearch, BsHeart, BsHeartFill, BsBookmark } from "react-icons/bs";
import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getAllRecipes, likeRecipe } from "../redux/recipeReducer/actions";

export const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const recipes = useSelector((store) => store.recipeReducer.recipes);
  const isLoading = useSelector((store) => store.recipeReducer.isLoading);
  const token =
    useSelector((store) => store.authReducer.token) ||
    localStorage.getItem("token");
  const isAuth = useSelector((store) => store.authReducer.isAuth);

  const [search, setSearch] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("all");
  const [vegFilter, setVegFilter] = useState("all");

  useEffect(() => {
    dispatch(getAllRecipes());
  }, []);

  const handleLike = (id) => {
    if (!isAuth) {
      toast({
        title: "Please login to like recipes",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    dispatch(likeRecipe(id, token));
  };

  const filtered = recipes.filter((r) => {
    const matchSearch =
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.ingredients?.toLowerCase().includes(search.toLowerCase());
    const matchCuisine =
      cuisineFilter === "all" || r.cuisine === cuisineFilter;
    const matchVeg =
      vegFilter === "all" || r.vegOrNonVeg === vegFilter;
    return matchSearch && matchCuisine && matchVeg;
  });

  const cuisines = [...new Set(recipes.map((r) => r.cuisine).filter(Boolean))];

  return (
    <DIV>
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        mb="2rem"
        flexWrap="wrap"
        gap="1rem"
      >
        <Box>
          <Heading size="lg" fontWeight="800">
            Recipe Feed
          </Heading>
          <Text color="gray.500" fontSize="sm">
            Discover {recipes.length}+ recipes from our community
          </Text>
        </Box>
        {isAuth && (
          <Button
            leftIcon={<MdAdd size={20} />}
            colorScheme="orange"
            onClick={() => navigate("/user-recipes")}
          >
            Add Recipe
          </Button>
        )}
      </Flex>

      {/* Filters */}
      <Flex gap="1rem" mb="2rem" flexWrap="wrap">
        <InputGroup maxW="320px">
          <InputLeftElement pointerEvents="none">
            <BsSearch color="gray" />
          </InputLeftElement>
          <Input
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg="white"
          />
        </InputGroup>

        <Select
          maxW="180px"
          bg="white"
          value={cuisineFilter}
          onChange={(e) => setCuisineFilter(e.target.value)}
        >
          <option value="all">All Cuisines</option>
          {cuisines.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>

        <Select
          maxW="160px"
          bg="white"
          value={vegFilter}
          onChange={(e) => setVegFilter(e.target.value)}
        >
          <option value="all">Veg & Non-Veg</option>
          <option value="veg">🥦 Veg Only</option>
          <option value="non-veg">🍗 Non-Veg Only</option>
        </Select>
      </Flex>

      {/* Content */}
      {isLoading ? (
        <Flex justify="center" py="5rem">
          <Spinner size="xl" color="orange.400" thickness="4px" />
        </Flex>
      ) : filtered.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          py="5rem"
          color="gray.400"
        >
          <Text fontSize="4rem">🍽️</Text>
          <Text fontSize="lg" fontWeight="600" mt="1rem">
            No recipes found
          </Text>
          <Text fontSize="sm">Try adjusting your filters</Text>
        </Flex>
      ) : (
        <Grid
          templateColumns={{
            lg: "repeat(3, 1fr)",
            md: "repeat(2, 1fr)",
            base: "1fr",
          }}
          gap="1.5rem"
        >
          {filtered.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onLike={handleLike}
              onClick={() => navigate(`/recipe/${recipe._id}`)}
            />
          ))}
        </Grid>
      )}
    </DIV>
  );
};

const RecipeCard = ({ recipe, onLike, onClick }) => {
  const difficultyColor = {
    Easy: "green",
    Medium: "orange",
    Hard: "red",
  };

  return (
    <CARD onClick={onClick}>
      <Box className="card-img-wrapper">
        <Image
          src={recipe.image || "https://via.placeholder.com/400x250?text=No+Image"}
          alt={recipe.title}
          className="card-img"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x250?text=No+Image";
          }}
        />
        <Badge
          className="veg-badge"
          colorScheme={recipe.vegOrNonVeg === "veg" ? "green" : "red"}
        >
          {recipe.vegOrNonVeg === "veg" ? "🥦 Veg" : "🍗 Non-Veg"}
        </Badge>
      </Box>

      <Box p="1rem">
        <Flex justify="space-between" align="flex-start" mb="0.5rem">
          <Heading size="sm" noOfLines={2} flex={1}>
            {recipe.title}
          </Heading>
          <IconButton
            icon={<BsHeart />}
            variant="ghost"
            size="sm"
            colorScheme="red"
            onClick={(e) => {
              e.stopPropagation();
              onLike(recipe._id);
            }}
            aria-label="Like"
          />
        </Flex>

        <Flex gap="0.5rem" flexWrap="wrap" mb="0.75rem">
          {recipe.cuisine && (
            <Badge colorScheme="blue" fontSize="0.7rem">
              {recipe.cuisine}
            </Badge>
          )}
          {recipe.difficulty && (
            <Badge
              colorScheme={difficultyColor[recipe.difficulty] || "gray"}
              fontSize="0.7rem"
            >
              {recipe.difficulty}
            </Badge>
          )}
        </Flex>

        <Flex gap="1rem" color="gray.500" fontSize="sm">
          {recipe.cookingTime && <Text>⏱ {recipe.cookingTime} min</Text>}
          {recipe.calories && <Text>🔥 {recipe.calories} cal</Text>}
          {recipe.likes > 0 && <Text>❤️ {recipe.likes}</Text>}
        </Flex>

        {recipe.createdBy?.name && (
          <Text fontSize="xs" color="gray.400" mt="0.5rem">
            By {recipe.createdBy.name}
          </Text>
        )}
      </Box>
    </CARD>
  );
};

const DIV = styled.div`
  min-height: 100vh;
  background: #f7f8fa;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const CARD = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  .card-img-wrapper {
    position: relative;
    height: 200px;
    overflow: hidden;
  }

  .card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover .card-img {
    transform: scale(1.05);
  }

  .veg-badge {
    position: absolute;
    top: 10px;
    right: 10px;
  }
`;

export default Feed;