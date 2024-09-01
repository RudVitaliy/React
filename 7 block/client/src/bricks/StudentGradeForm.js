import React, { useState } from "react";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

export default function RecipeFormModal({ show, handleClose }) {
    const defaultIngredients = Array.from({ length: 10 }, () => ({
        ingredient: "",
        amount: "",
        unit: "",
    }));

    const [recipeName, setRecipeName] = useState("");
    const [instructions, setInstructions] = useState("");
    const [ingredients, setIngredients] = useState(defaultIngredients);
    const [errors, setErrors] = useState({});
    const [formState, setFormState] = useState({
        state: "inactive",
        error: null,
    });

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index][field] = value;
        setIngredients(updatedIngredients);
    };

    const validateForm = () => {
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
    };

    const submitIngredient = async (ingredient) => {
        try {
            const response = await fetch("http://localhost:8000/ingredient/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: ingredient.ingredient,
                    id: "",
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to create ingredient: ${errorData.errorMessage || "Unknown error"}`);
            }

            const data = await response.json();
            return data.id;
        } catch (error) {
            throw new Error(`Failed to create ingredient: ${error.message}`);
        }
    };

    const submitRecipe = async (ingredientIds) => {
        try {
            const response = await fetch("http://localhost:8000/recipe/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: recipeName,
                    description: instructions,
                    ingredients: ingredients.map((ing, index) => ({
                        id: ingredientIds[index],
                        amount: parseFloat(ing.amount), // Ensure amount is a number
                        unit: ing.unit,
                    })),
                    id: "",
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to create recipe: ${errorData.errorMessage || "Unknown error"}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error(`Failed to create recipe: ${error.message}`);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!validateForm()) {
            return;
        }

        setFormState({ state: "pending", error: null });

        try {
            // Submit ingredients and get their IDs
            const ingredientIds = await Promise.all(
                ingredients.map((ingredient) => submitIngredient(ingredient))
            );

            // Submit the recipe with ingredient IDs
            await submitRecipe(ingredientIds);

            setFormState({ state: "success", error: null });

            handleClose(); // Close the modal after successful submission
        } catch (error) {
            setFormState({ state: "error", error: error.message });
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Form noValidate validated={!!errors.recipeName} onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Recipe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {formState.state === "error" && (
                        <div className="alert alert-danger">
                            Error: {formState.error}
                        </div>
                    )}
                    <Form.Group controlId="recipeName">
                        <Form.Label>Recipe Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={recipeName}
                            isInvalid={!!errors.recipeName}
                            onChange={(e) => setRecipeName(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.recipeName}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="instructions">
                        <Form.Label>Cooking Instructions</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <div className="mb-3">
                        <Row className="border-bottom font-weight-bold">
                            <Col xs={1}>#</Col>
                            <Col>Ingredient</Col>
                            <Col>Amount</Col>
                            <Col>Unit</Col>
                        </Row>
                        {ingredients.map((ingredient, index) => (
                            <Row
                                key={index}
                                className="mb-2 align-items-center border-bottom"
                            >
                                <Col xs={1} className="text-center">
                                    {index + 1}
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        value={ingredient.ingredient}
                                        onChange={(e) =>
                                            handleIngredientChange(index, "ingredient", e.target.value)
                                        }
                                        required
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        value={ingredient.amount}
                                        isInvalid={!!errors[`amount-${index}`]}
                                        onChange={(e) =>
                                            handleIngredientChange(index, "amount", e.target.value)
                                        }
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors[`amount-${index}`]}
                                    </Form.Control.Feedback>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        value={ingredient.unit}
                                        onChange={(e) =>
                                            handleIngredientChange(index, "unit", e.target.value)
                                        }
                                        required
                                    />
                                </Col>
                            </Row>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex flex-row justify-content-between align-items-center w-100">
                        <div>
                            {formState.state === "error" && (
                                <div className="text-danger">
                                    Error: {formState.error}
                                </div>
                            )}
                        </div>
                        <div className="d-flex flex-row gap-2">
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={formState.state === "pending"}
                            >
                                {formState.state === "pending" ? (
                                    <Icon size={0.8} path={mdiLoading} spin={true} />
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
