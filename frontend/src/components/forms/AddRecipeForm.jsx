import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Textarea,
  useToast,
  Flex,
  Text,
  Image,
} from "@chakra-ui/react";
import { addNewRecipe } from "../../redux/recipeReducer/actions";

const CUISINES = ["Indian", "Italian", "Chinese", "Mexican", "Continental", "Japanese", "Greek", "Other"];

export const AddRecipeForm = ({ closeModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const token =
    useSelector((store) => store.authReducer.token) ||
    localStorage.getItem("token");

  const isLoading = useSelector((store) => store.recipeReducer.isLoading);

  const [form, setForm] = useState({
    title: "",
    image: "",
    ingredients: "",
    instructions: "",
    vegOrNonVeg: "veg",
    cuisine: "Indian",
    cookingTime: "",
    calories: "",
    difficulty: "Easy",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.ingredients || !form.instructions) {
      toast({
        title: "Please fill required fields",
        description: "Title, Ingredients and Instructions are required",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const recipeData = {
      ...form,
      cookingTime: form.cookingTime ? Number(form.cookingTime) : undefined,
      calories: form.calories ? Number(form.calories) : undefined,
    };

    dispatch(addNewRecipe(token, recipeData, toast, navigate, closeModal));
  };

  return (
    <Box as="div" pb="1rem">
      <Stack spacing="1rem">

        {/* Title */}
        <FormControl isRequired>
          <FormLabel fontWeight="600">Recipe Title</FormLabel>
          <Input
            name="title"
            placeholder="e.g. Spicy Chicken Curry"
            value={form.title}
            onChange={handleChange}
          />
        </FormControl>

        {/* Image URL */}
        <FormControl>
          <FormLabel fontWeight="600">Image URL</FormLabel>
          <Input
            name="image"
            placeholder="https://example.com/image.jpg"
            value={form.image}
            onChange={handleChange}
          />
          {form.image && (
            <Image
              src={form.image}
              alt="Preview"
              mt="0.5rem"
              borderRadius="8px"
              maxH="150px"
              objectFit="cover"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          )}
        </FormControl>

        {/* Ingredients */}
        <FormControl isRequired>
          <FormLabel fontWeight="600">Ingredients</FormLabel>
          <Textarea
            name="ingredients"
            placeholder="chicken, onion, tomato, spices, oil..."
            value={form.ingredients}
            onChange={handleChange}
            rows={3}
          />
          <Text fontSize="xs" color="gray.500" mt="0.25rem">
            Separate ingredients with commas
          </Text>
        </FormControl>

        {/* Instructions */}
        <FormControl isRequired>
          <FormLabel fontWeight="600">Instructions</FormLabel>
          <Textarea
            name="instructions"
            placeholder="Heat oil, add onions, cook for 5 mins..."
            value={form.instructions}
            onChange={handleChange}
            rows={4}
          />
        </FormControl>

        {/* Veg / Non-Veg + Cuisine */}
        <Flex gap="1rem" flexWrap="wrap">
          <FormControl flex={1} minW="140px">
            <FormLabel fontWeight="600">Type</FormLabel>
            <Select name="vegOrNonVeg" value={form.vegOrNonVeg} onChange={handleChange}>
              <option value="veg">🥦 Veg</option>
              <option value="non-veg">🍗 Non-Veg</option>
            </Select>
          </FormControl>

          <FormControl flex={1} minW="140px">
            <FormLabel fontWeight="600">Cuisine</FormLabel>
            <Select name="cuisine" value={form.cuisine} onChange={handleChange}>
              {CUISINES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </FormControl>
        </Flex>

        {/* Cooking Time + Calories + Difficulty */}
        <Flex gap="1rem" flexWrap="wrap">
          <FormControl flex={1} minW="100px">
            <FormLabel fontWeight="600">Time (min)</FormLabel>
            <Input
              name="cookingTime"
              type="number"
              placeholder="30"
              value={form.cookingTime}
              onChange={handleChange}
              min={1}
            />
          </FormControl>

          <FormControl flex={1} minW="100px">
            <FormLabel fontWeight="600">Calories</FormLabel>
            <Input
              name="calories"
              type="number"
              placeholder="350"
              value={form.calories}
              onChange={handleChange}
              min={1}
            />
          </FormControl>

          <FormControl flex={1} minW="120px">
            <FormLabel fontWeight="600">Difficulty</FormLabel>
            <Select name="difficulty" value={form.difficulty} onChange={handleChange}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </Select>
          </FormControl>
        </Flex>

        {/* Buttons */}
        <Flex justify="space-between" pt="0.5rem">
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            colorScheme="orange"
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Adding..."
          >
            Add Recipe
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};