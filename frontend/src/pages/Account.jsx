import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  Image,
  Badge,
  IconButton,
  useToast,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { getMyRecipes, editRecipe, deleteRecipe } from "../redux/recipeReducer/actions";
import { useSelector as useReduxSelector } from "react-redux";
import styled from "styled-components";

export const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const user = useSelector((store) => store.authReducer.loggedInUser);
  const recipes = useSelector((store) => store.recipeReducer.recipes);
  const isLoading = useSelector((store) => store.recipeReducer.isLoading);
  const token =
    useSelector((store) => store.authReducer.token) ||
    localStorage.getItem("token");

  // Edit Modal
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  // Delete Dialog
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = React.useRef();

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (token) {
      dispatch(getMyRecipes(token));
    }
  }, []);

  const handleEditOpen = (recipe) => {
    setSelectedRecipe(recipe);
    setEditForm({
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      cuisine: recipe.cuisine,
      cookingTime: recipe.cookingTime,
      calories: recipe.calories,
      difficulty: recipe.difficulty,
      vegOrNonVeg: recipe.vegOrNonVeg,
      image: recipe.image,
    });
    onEditOpen();
  };

  const handleEditSubmit = () => {
    dispatch(editRecipe(selectedRecipe._id, token, editForm, toast));
    onEditClose();
  };

  const handleDeleteOpen = (recipe) => {
    setSelectedRecipe(recipe);
    onDeleteOpen();
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteRecipe(selectedRecipe._id, token, toast));
    onDeleteClose();
  };

  return (
    <DIV>
      <Container maxW="6xl" py="2rem">
        {/* User Info */}
        <Box className="profile-header" mb="2rem">
          <Box className="avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </Box>
          <Box>
            <Heading size="lg">{user?.name || "User"}</Heading>
            <Text color="gray.500">{user?.email}</Text>
            <Badge colorScheme={user?.role === "admin" ? "red" : "orange"} mt="0.5rem">
              {user?.role || "user"}
            </Badge>
          </Box>
        </Box>

        {/* Stats */}
        <Flex gap="1rem" mb="2rem" flexWrap="wrap">
          <Box className="stat-card">
            <Text className="stat-num">{recipes.length}</Text>
            <Text className="stat-label">My Recipes</Text>
          </Box>
          <Box className="stat-card">
            <Text className="stat-num">
              {recipes.reduce((acc, r) => acc + (r.likes || 0), 0)}
            </Text>
            <Text className="stat-label">Total Likes</Text>
          </Box>
        </Flex>

        {/* My Recipes */}
        <Flex justify="space-between" align="center" mb="1.5rem">
          <Heading size="md">My Recipes</Heading>
          <Button
            colorScheme="orange"
            size="sm"
            onClick={() => navigate("/user-recipes")}
          >
            + Add New Recipe
          </Button>
        </Flex>

        {isLoading ? (
          <Flex justify="center" py="4rem">
            <Spinner size="xl" color="orange.400" />
          </Flex>
        ) : recipes.length === 0 ? (
          <Box className="empty-state">
            <Text fontSize="3rem">🍽️</Text>
            <Text fontWeight="600" mt="1rem">No recipes yet!</Text>
            <Text color="gray.500" fontSize="sm" mb="1rem">
              Share your first recipe with the community
            </Text>
            <Button colorScheme="orange" onClick={() => navigate("/user-recipes")}>
              Add Recipe
            </Button>
          </Box>
        ) : (
          <Grid
            templateColumns={{ lg: "repeat(3,1fr)", md: "repeat(2,1fr)", base: "1fr" }}
            gap="1.5rem"
          >
            {recipes.map((recipe) => (
              <Box key={recipe._id} className="recipe-card">
                <Box className="card-img-wrap">
                  <Image
                    src={recipe.image || "https://via.placeholder.com/400x200?text=No+Image"}
                    alt={recipe.title}
                    className="card-img"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x200?text=No+Image"; }}
                    onClick={() => navigate(`/recipe/${recipe._id}`)}
                  />
                </Box>
                <Box p="1rem">
                  <Flex justify="space-between" align="flex-start">
                    <Text fontWeight="700" noOfLines={1} flex={1}>
                      {recipe.title}
                    </Text>
                    <Flex gap="0.5rem">
                      <IconButton
                        icon={<EditIcon />}
                        size="xs"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => handleEditOpen(recipe)}
                        aria-label="Edit"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        size="xs"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDeleteOpen(recipe)}
                        aria-label="Delete"
                      />
                    </Flex>
                  </Flex>
                  <Flex gap="0.5rem" mt="0.5rem" flexWrap="wrap">
                    {recipe.cuisine && <Badge colorScheme="blue" fontSize="0.65rem">{recipe.cuisine}</Badge>}
                    {recipe.vegOrNonVeg && (
                      <Badge colorScheme={recipe.vegOrNonVeg === "veg" ? "green" : "red"} fontSize="0.65rem">
                        {recipe.vegOrNonVeg}
                      </Badge>
                    )}
                    {recipe.difficulty && <Badge colorScheme="gray" fontSize="0.65rem">{recipe.difficulty}</Badge>}
                  </Flex>
                  <Flex gap="1rem" mt="0.5rem" color="gray.500" fontSize="sm">
                    {recipe.cookingTime && <Text>⏱ {recipe.cookingTime}m</Text>}
                    {recipe.likes > 0 && <Text>❤️ {recipe.likes}</Text>}
                  </Flex>
                </Box>
              </Box>
            ))}
          </Grid>
        )}
      </Container>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Recipe</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" gap="1rem">
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input value={editForm.title || ""} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
              </FormControl>
              <FormControl>
                <FormLabel>Image URL</FormLabel>
                <Input value={editForm.image || ""} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} />
              </FormControl>
              <FormControl>
                <FormLabel>Ingredients</FormLabel>
                <Textarea value={editForm.ingredients || ""} onChange={(e) => setEditForm({ ...editForm, ingredients: e.target.value })} />
              </FormControl>
              <FormControl>
                <FormLabel>Instructions</FormLabel>
                <Textarea value={editForm.instructions || ""} onChange={(e) => setEditForm({ ...editForm, instructions: e.target.value })} />
              </FormControl>
              <Flex gap="1rem">
                <FormControl>
                  <FormLabel>Cuisine</FormLabel>
                  <Input value={editForm.cuisine || ""} onChange={(e) => setEditForm({ ...editForm, cuisine: e.target.value })} />
                </FormControl>
                <FormControl>
                  <FormLabel>Cooking Time (min)</FormLabel>
                  <Input type="number" value={editForm.cookingTime || ""} onChange={(e) => setEditForm({ ...editForm, cookingTime: e.target.value })} />
                </FormControl>
              </Flex>
              <Flex gap="1rem">
                <FormControl>
                  <FormLabel>Calories</FormLabel>
                  <Input type="number" value={editForm.calories || ""} onChange={(e) => setEditForm({ ...editForm, calories: e.target.value })} />
                </FormControl>
                <FormControl>
                  <FormLabel>Difficulty</FormLabel>
                  <Select value={editForm.difficulty || ""} onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </Select>
                </FormControl>
              </Flex>
              <FormControl>
                <FormLabel>Type</FormLabel>
                <Select value={editForm.vegOrNonVeg || ""} onChange={(e) => setEditForm({ ...editForm, vegOrNonVeg: e.target.value })}>
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                </Select>
              </FormControl>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr="1rem" onClick={onEditClose}>Cancel</Button>
            <Button colorScheme="orange" onClick={handleEditSubmit}>Save Changes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirm */}
      <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Recipe</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete <strong>{selectedRecipe?.title}</strong>? This cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml="1rem">Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </DIV>
  );
};

const DIV = styled.div`
  background: #f7f8fa;
  min-height: 100vh;

  .profile-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    background: white;
    padding: 1.5rem 2rem;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }

  .avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fb8500, #ffb703);
    color: white;
    font-size: 2rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 1rem 2rem;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    min-width: 120px;
  }

  .stat-num {
    font-size: 2rem;
    font-weight: 800;
    color: #fb8500;
  }

  .stat-label {
    font-size: 0.8rem;
    color: #718096;
    text-transform: uppercase;
    font-weight: 600;
  }

  .recipe-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-3px);
    }
  }

  .card-img-wrap {
    height: 180px;
    overflow: hidden;
  }

  .card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  .empty-state {
    text-align: center;
    padding: 4rem;
    background: white;
    border-radius: 16px;
  }

  @media (max-width: 768px) {
    .profile-header {
      padding: 1rem;
      flex-direction: column;
      text-align: center;
    }
  }
`;