import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@/components/ui/rating";

const initialRecipes = [
  {
    id: 1,
    title: "Spaghetti Carbonara",
    ingredients: "Spaghetti, Eggs, Pancetta, Parmesan cheese, Black pepper",
    steps:
      "1. Cook spaghetti\n2. Fry pancetta\n3. Mix eggs and cheese\n4. Combine all ingredients",
    image: "https://via.placeholder.com/300x200.png?text=Spaghetti+Carbonara",
    rating: 4.5,
  },
  {
    id: 2,
    title: "Chicken Stir Fry",
    ingredients: "Chicken breast, Mixed vegetables, Soy sauce, Ginger, Garlic",
    steps:
      "1. Cut chicken and vegetables\n2. Stir fry chicken\n3. Add vegetables\n4. Season and serve",
    image: "https://via.placeholder.com/300x200.png?text=Chicken+Stir+Fry",
    rating: 4.2,
  },
];

function RecipeCard({ recipe, onViewRecipe, onToggleFavorite, isFavorite }) {
  return (
    <Card className="w-full sm:w-64 m-2">
      <CardHeader>
        <CardTitle>{recipe.title}</CardTitle>
        <CardDescription>
          <Rating value={recipe.rating} readOnly />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-40 object-cover mb-2"
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => onViewRecipe(recipe)}>View Recipe</Button>
        <Button
          variant="outline"
          onClick={() => onToggleFavorite(recipe)}
          className={isFavorite ? "bg-yellow-200" : ""}
        >
          {isFavorite ? "★" : "☆"}
        </Button>
      </CardFooter>
    </Card>
  );
}

function RecipeForm({ recipe, onSave, onCancel }) {
  const [title, setTitle] = useState(recipe?.title || "");
  const [ingredients, setIngredients] = useState(recipe?.ingredients || "");
  const [steps, setSteps] = useState(recipe?.steps || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...recipe, title, ingredients, steps });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Recipe Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Ingredients (comma separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        required
      />
      <Textarea
        placeholder="Steps (numbered list)"
        value={steps}
        onChange={(e) => setSteps(e.target.value)}
        required
      />
      <div className="flex justify-end space-x-2">
        <Button type="submit">Save</Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function RecipeDetails({ recipe, onClose, onEdit, onDelete }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{recipe.title}</CardTitle>
          <CardDescription>
            <Rating value={recipe.rating} readOnly />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-48 object-cover mb-4"
          />
          <h3 className="font-bold">Ingredients:</h3>
          <p>{recipe.ingredients}</p>
          <h3 className="font-bold mt-4">Steps:</h3>
          <p className="whitespace-pre-line">{recipe.steps}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={onEdit}>Edit</Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function App() {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedRecipes = showFavorites
    ? filteredRecipes.filter((recipe) => favorites.includes(recipe.id))
    : filteredRecipes;

  const handleSaveRecipe = (savedRecipe) => {
    if (savedRecipe.id) {
      setRecipes(
        recipes.map((r) => (r.id === savedRecipe.id ? savedRecipe : r))
      );
    } else {
      setRecipes([...recipes, { ...savedRecipe, id: Date.now(), rating: 0 }]);
    }
    setIsEditing(false);
    setSelectedRecipe(null);
  };

  const handleDeleteRecipe = (recipe) => {
    setRecipes(recipes.filter((r) => r.id !== recipe.id));
    setSelectedRecipe(null);
  };

  const handleToggleFavorite = (recipe) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(recipe.id)
        ? prevFavorites.filter((id) => id !== recipe.id)
        : [...prevFavorites, recipe.id]
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Recipe Sharing Platform</h1>
      <div className="mb-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Input
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={() => setIsEditing(true)}>Add New Recipe</Button>
        <Button
          variant="outline"
          onClick={() => setShowFavorites(!showFavorites)}
        >
          {showFavorites ? "Show All" : "Show Favorites"}
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onViewRecipe={setSelectedRecipe}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={favorites.includes(recipe.id)}
          />
        ))}
      </div>
      {selectedRecipe && !isEditing && (
        <RecipeDetails
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onEdit={() => setIsEditing(true)}
          onDelete={() => handleDeleteRecipe(selectedRecipe)}
        />
      )}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>
                {selectedRecipe ? "Edit Recipe" : "Add New Recipe"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecipeForm
                recipe={selectedRecipe}
                onSave={handleSaveRecipe}
                onCancel={() => {
                  setIsEditing(false);
                  setSelectedRecipe(null);
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
