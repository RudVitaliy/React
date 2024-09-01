import React, { useState, useMemo, useEffect } from "react";
import RecipesGridList from "../bricks/RecipesGridList";
import RecipesTableList from "../bricks/RecipesTableList";
import ViewSwitcher from "../bricks/ViewSwitcher";
import SearchForm from "../bricks/SearchForm";
import RecipeFormModal from "../bricks/RecipeFormModal";
import Button from "react-bootstrap/Button";

function RecipeList() {
    const [viewType, setViewType] = useState("grid");
    const [isFullDescription, setIsFullDescription] = useState(false);
    const [searchBy, setSearchBy] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        async function fetchRecipes() {
            try {
                const response = await fetch("http://localhost:8000/recipe/list");
                if (!response.ok) {
                    throw new Error("Failed to fetch recipes.");
                }
                const data = await response.json();
                setRecipes(data);
            } catch (error) {
                console.error("Failed to fetch recipes:", error);
            }
        }
        fetchRecipes();
    }, []);

    const filteredRecipeList = useMemo(() => {
        return recipes.filter((item) => {
            const searchTerm = searchBy.toLowerCase();
            return (
                item.name.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm)
            );
        });
    }, [searchBy, recipes]);

    function handleRecipeAdded(newRecipe) {
        setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
    }

    function handleRecipeUpdated(updatedRecipe) {
        setRecipes((prevRecipes) =>
            prevRecipes.map((recipe) =>
                recipe.id === updatedRecipe.id ? updatedRecipe : recipe
            )
        );
        setEditingRecipe(null);
    }

    return (
        <div>
            <div className="mb-3">
                <ViewSwitcher 
                    viewType={viewType} 
                    setViewType={setViewType} 
                    isFullDescription={isFullDescription} 
                    setIsFullDescription={setIsFullDescription} 
                />
                <SearchForm setSearchBy={setSearchBy} />
                <Button 
                    variant="primary" 
                    onClick={() => {
                        setEditingRecipe(null); 
                        setShowModal(true);
                    }}
                >
                    Add New Recipe
                </Button>
            </div>
            <RecipeFormModal 
                show={showModal} 
                handleClose={() => setShowModal(false)}
                onRecipeAdded={handleRecipeAdded}
                onRecipeUpdated={handleRecipeUpdated}
                recipe={editingRecipe}
            />
            <div>
                {viewType === "grid" ? (
                    <RecipesGridList 
                        recipeList={filteredRecipeList} 
                        isFullDescription={isFullDescription} 
                        onEditRecipe={(recipe) => {
                            setEditingRecipe(recipe);
                            setShowModal(true);
                        }}
                    />
                ) : (
                    <RecipesTableList 
                        recipeList={filteredRecipeList} 
                        isFullDescription={isFullDescription} 
                        onEditRecipe={(recipe) => {
                            setEditingRecipe(recipe);
                            setShowModal(true);
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default RecipeList;
