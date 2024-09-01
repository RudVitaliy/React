import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

function RecipeFormModal({ show, handleClose, onRecipeAdded, onRecipeUpdated, recipe }) {
    const [recipeName, setRecipeName] = useState("");
    const [instructions, setInstructions] = useState("");
    const [imgUri, setImgUri] = useState("");
    const [ingredients, setIngredients] = useState([{ name: "", amount: "", unit: "" }]);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loadingIngredients, setLoadingIngredients] = useState(false);

    useEffect(() => {
        if (recipe) {
            setRecipeName(recipe.name || "");
            setInstructions(recipe.description || "");
            setImgUri(recipe.imgUri || "");
            loadIngredients(recipe.ingredients || []);
        } else {
            setRecipeName("");
            setInstructions("");
            setImgUri("");
            setIngredients([{ name: "", amount: "", unit: "" }]);
        }
    }, [recipe]);

    const loadIngredients = async (ingredientData) => {
        setLoadingIngredients(true);
        try {
            const fetchedIngredients = await Promise.all(
                ingredientData.map(async (ingredient) => {
                    const response = await fetch(`http://localhost:8000/ingredient/get?id=${ingredient.id}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const ingredientDetails = await response.json();
                    return {
                        ...ingredientDetails,
                        amount: ingredient.amount,
                        unit: ingredient.unit
                    };
                })
            );
            setIngredients(fetchedIngredients.length > 0 ? fetchedIngredients : [{ name: "", amount: "", unit: "" }]);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
            setServerError("Failed to load ingredients.");
        } finally {
            setLoadingIngredients(false);
        }
    };

    function handleIngredientChange(index, field, value) {
        const newIngredients = [...ingredients];
        newIngredients[index][field] = field === "amount" ? (value === "" ? "" : parseFloat(value)) : value;
        setIngredients(newIngredients);
    }

    function addIngredient() {
        setIngredients([...ingredients, { name: "", amount: "", unit: "" }]);
    }

    function removeIngredient(index) {
        setIngredients(ingredients.filter((_, i) => i !== index));
    }

    function validateForm() {
        const newErrors = {};
        
        if (!recipeName) {
            newErrors.recipeName = "Recipe name is required.";
        }

        ingredients.forEach((ingredient, index) => {
            if (ingredient.amount && (isNaN(ingredient.amount) || ingredient.amount <= 0 || ingredient.amount > 1000)) {
                newErrors[`amount-${index}`] = "Amount must be a number between 1 and 1000.";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function submitIngredient(ingredient) {
        try {
            const url = ingredient.id ? "http://localhost:8000/ingredient/update" : "http://localhost:8000/ingredient/create";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: ingredient.id || null, 
                    name: ingredient.name,
                    amount: ingredient.amount,
                    unit: ingredient.unit,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    `Failed to ${ingredient.id ? "update" : "create"} ingredient: ${errorData.errorMessage || "Unknown error"}`
                );
            }

            const data = await response.json();
            return data.id; 
        } catch (error) {
            console.error("Error in submitIngredient:", error);
            throw new Error(`Failed to ${ingredient.id ? "update" : "create"} ingredient: ${error.message}`);
        }
    }

    async function submitRecipe(ingredientIds) {
        try {
            const url = recipe ? "http://localhost:8000/recipe/update" : "http://localhost:8000/recipe/create";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: recipe?.id || null, 
                    name: recipeName,
                    description: instructions,
                    imgUri: imgUri,
                    ingredients: ingredients.map((ing, index) => ({
                        id: ingredientIds[index] || null, 
                        name: ing.name,
                        amount: ing.amount,
                        unit: ing.unit,
                    })),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    `Failed to ${recipe ? "update" : "create"} recipe: ${errorData.errorMessage || "Unknown error"}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error("Error in submitRecipe:", error);
            throw new Error(`Failed to ${recipe ? "update" : "create"} recipe: ${error.message}`);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        
        if (validateForm()) {
            try {
                setServerError("");

                const ingredientIds = await Promise.all(
                    ingredients.map(ingredient => submitIngredient(ingredient))
                );

                const newRecipe = await submitRecipe(ingredientIds);

                if (recipe) {
                    onRecipeUpdated(newRecipe);
                } else {
                    onRecipeAdded(newRecipe);
                }

                handleClose();
            } catch (error) {
                console.error("Error in handleSubmit:", error);
                setServerError(error.message);
            }
        }
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{recipe ? "Edit Recipe" : "Add New Recipe"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {serverError && (
                    <div className="alert alert-danger">
                        {serverError}
                    </div>
                )}
                {loadingIngredients ? (
                    <div>Loading ingredients...</div>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="recipeName">
                            <Form.Label>Recipe Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={recipeName}
                                onChange={(e) => setRecipeName(e.target.value)}
                                isInvalid={!!errors.recipeName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.recipeName}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="instructions">
                            <Form.Label>Instructions</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="imgUri">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                value={imgUri}
                                onChange={(e) => setImgUri(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Ingredients</Form.Label>
                            {ingredients.map((ingredient, index) => (
                                <Row key={index} className="mb-2">
                                    <Col>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingredient name"
                                            value={ingredient.name}
                                            onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            type="number"
                                            placeholder="Amount"
                                            value={ingredient.amount}
                                            onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                                            isInvalid={!!errors[`amount-${index}`]}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors[`amount-${index}`]}
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            type="text"
                                            placeholder="Unit"
                                            value={ingredient.unit}
                                            onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                                        />
                                    </Col>
                                    <Col xs="auto">
                                        <Button 
                                            variant="danger" 
                                            onClick={() => removeIngredient(index)}
                                        >
                                            Remove
                                        </Button>
                                    </Col>
                                </Row>
                            ))}
                            <Button variant="link" onClick={addIngredient}>
                                Add Ingredient
                            </Button>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {recipe ? "Update Recipe" : "Add Recipe"}
                        </Button>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
}

export default RecipeFormModal;
