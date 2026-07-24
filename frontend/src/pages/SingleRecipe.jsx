import styled from "styled-components";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Badge,
  Button,
  Flex,
  Heading,
  Image,
  List,
  ListItem,
  Text,
  Divider,
  Spinner,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Tag,
} from "@chakra-ui/react";
import axios from "axios";

function SingleRecipe() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/recipes/${postId}`)
      .then((res) => {
        setRecipe(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [postId]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="orange.400" thickness="4px" />
      </Flex>
    );
  }

  if (!recipe) {
    return (
      <Flex justify="center" align="center" direction="column" minH="60vh" gap="1rem">
        <Text fontSize="3rem">😕</Text>
        <Heading size="md">Recipe not found</Heading>
        <Button colorScheme="orange" onClick={() => navigate("/explore")}>
          Back to Explore
        </Button>
      </Flex>
    );
  }

  const ingredients = recipe.ingredients
    ? recipe.ingredients.split(",").map((i) => i.trim()).filter(Boolean)
    : [];

  const instructions = recipe.instructions
    ? recipe.instructions.split(".").map((i) => i.trim()).filter(Boolean)
    : [];

  return (
    <DIV>
      {/* Back Button */}
      <Button
        variant="ghost"
        colorScheme="orange"
        mb="1.5rem"
        onClick={() => navigate(-1)}
      >
        ← Back
      </Button>

      <Flex gap="2rem" direction={{ base: "column", md: "row" }}>
        {/* Left: Image + Ingredients */}
        <Box flex={1}>
          <Image
            src={recipe.image || "https://via.placeholder.com/600x400?text=No+Image"}
            alt={recipe.title}
            borderRadius="16px"
            w="100%"
            maxH="400px"
            objectFit="cover"
            onError={(e) => { e.target.src = "https://via.placeholder.com/600x400?text=No+Image"; }}
          />

          <Divider my="1.5rem" />

          <Heading size="md" textTransform="uppercase" mb="1rem">
            🧂 Ingredients
          </Heading>
          <List display="grid" gridTemplateColumns="repeat(auto-fill, minmax(180px, 1fr))" gap={3}>
            {ingredients.map((ing, i) => (
              <ListItem key={i} display="flex" alignItems="center" gap="0.5rem">
                <Box as={CheckIcon} color="green.500" w={4} h={4} flexShrink={0} />
                <Text fontSize="sm">{ing}</Text>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Right: Details + Instructions */}
        <Box flex={1}>
          {/* Recipe Info */}
          <Box bg="white" borderRadius="16px" p="1.5rem" boxShadow="md" mb="1.5rem">
            <Heading size="lg" textTransform="uppercase" mb="0.75rem">
              {recipe.title}
            </Heading>

            <Flex gap="0.5rem" flexWrap="wrap" mb="1rem">
              {recipe.vegOrNonVeg && (
                <Badge colorScheme={recipe.vegOrNonVeg === "veg" ? "green" : "red"} fontSize="0.8rem" px="2" py="1">
                  {recipe.vegOrNonVeg === "veg" ? "🥦 Veg" : "🍗 Non-Veg"}
                </Badge>
              )}
              {recipe.cuisine && (
                <Badge colorScheme="blue" fontSize="0.8rem" px="2" py="1">
                  {recipe.cuisine}
                </Badge>
              )}
              {recipe.difficulty && (
                <Badge
                  colorScheme={recipe.difficulty === "Easy" ? "green" : recipe.difficulty === "Medium" ? "orange" : "red"}
                  fontSize="0.8rem" px="2" py="1"
                >
                  {recipe.difficulty}
                </Badge>
              )}
            </Flex>

            <Flex gap="1.5rem" flexWrap="wrap" color="gray.600" fontSize="sm" mb="1rem">
              {recipe.cookingTime && (
                <Flex align="center" gap="0.5rem">
                  <Text fontSize="1.2rem">⏱</Text>
                  <Box>
                    <Text fontWeight="600">{recipe.cookingTime} min</Text>
                    <Text fontSize="xs" color="gray.400">Cook Time</Text>
                  </Box>
                </Flex>
              )}
              {recipe.calories && (
                <Flex align="center" gap="0.5rem">
                  <Text fontSize="1.2rem">🔥</Text>
                  <Box>
                    <Text fontWeight="600">{recipe.calories} cal</Text>
                    <Text fontSize="xs" color="gray.400">Calories</Text>
                  </Box>
                </Flex>
              )}
              {recipe.likes > 0 && (
                <Flex align="center" gap="0.5rem">
                  <Text fontSize="1.2rem">❤️</Text>
                  <Box>
                    <Text fontWeight="600">{recipe.likes}</Text>
                    <Text fontSize="xs" color="gray.400">Likes</Text>
                  </Box>
                </Flex>
              )}
            </Flex>

            {recipe.createdBy?.name && (
              <Text fontSize="sm" color="gray.500">
                👨‍🍳 By <strong>{recipe.createdBy.name}</strong>
              </Text>
            )}
          </Box>

          {/* Instructions */}
          <Box bg="white" borderRadius="16px" p="1.5rem" boxShadow="md">
            <Heading size="md" textTransform="uppercase" mb="1.5rem">
              📋 Instructions
            </Heading>
            {instructions.length > 0 ? (
              <Stepper orientation="vertical" gap="0" index={-1}>
                {instructions.map((step, i) => (
                  <Step key={i}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>
                    <Box pb="1.5rem" pl="0.5rem">
                      <StepTitle>
                        <Text fontSize="sm">{step}</Text>
                      </StepTitle>
                    </Box>
                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>
            ) : (
              <Text color="gray.500" fontSize="sm">{recipe.instructions}</Text>
            )}
          </Box>
        </Box>
      </Flex>
    </DIV>
  );
}

export default SingleRecipe;

const DIV = styled.div`
  width: min(80rem, 100%);
  margin: 2rem auto 5rem;
  padding: 0 1.25rem;

  @media (max-width: 768px) {
    margin: 1rem auto 3rem;
  }
`;