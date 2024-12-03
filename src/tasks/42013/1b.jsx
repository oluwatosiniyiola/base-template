import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StarIcon } from "@/icons/StarIcon";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: "",
    steps: "",
    image: "placeholder.jpg",
  });
  const [viewRecipe, setViewRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const handleAddRecipe = () => {
    if (newRecipe.title && newRecipe.ingredients && newRecipe.steps) {
      setRecipes([...recipes, { ...newRecipe, id: Date.now(), rating: 0 }]);
      setNewRecipe({
        title: "",
        ingredients: "",
        steps: "",
        image: "placeholder.jpg",
      });
    }
  };

  const handleDeleteRecipe = (id) => {
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
    if (viewRecipe && viewRecipe.id === id) {
      setViewRecipe(null);
    }
  };

  const handleFavorite = (recipe) => {
    const isFavorite = favorites.includes(recipe.id);
    setFavorites(
      isFavorite
        ? favorites.filter((id) => id !== recipe.id)
        : [...favorites, recipe.id]
    );
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Recipe Sharing Platform</h1>

      {/* Search Bar */}
      <Input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {/* Add Recipe Form */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Recipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newRecipe.title}
                onChange={(e) =>
                  setNewRecipe({ ...newRecipe, title: e.target.value })
                }
              />
              <Label htmlFor="ingredients">Ingredients</Label>
              <Input
                id="ingredients"
                value={newRecipe.ingredients}
                onChange={(e) =>
                  setNewRecipe({ ...newRecipe, ingredients: e.target.value })
                }
              />
              <Label htmlFor="steps">Steps</Label>
              <Input
                id="steps"
                value={newRecipe.steps}
                onChange={(e) =>
                  setNewRecipe({ ...newRecipe, steps: e.target.value })
                }
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddRecipe}>Add Recipe</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Recipes List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onDelete={handleDeleteRecipe}
            onView={() => setViewRecipe(recipe)}
            onFavorite={handleFavorite}
            isFavorite={favorites.includes(recipe.id)}
          />
        ))}
      </div>

      {/* View Recipe Modal */}
      {viewRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-full max-w-lg p-4">
            <CardHeader>
              <CardTitle>{viewRecipe.title}</CardTitle>
              <img
                src={viewRecipe.image}
                alt={viewRecipe.title}
                className="mt-2 w-full h-40 object-cover"
              />
            </CardHeader>
            <CardContent>
              <CardDescription>
                <strong>Ingredients:</strong> {viewRecipe.ingredients}
              </CardDescription>
              <CardDescription>
                <strong>Steps:</strong> {viewRecipe.steps}
              </CardDescription>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < viewRecipe.rating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button onClick={() => setViewRecipe(null)}>Close</Button>
              <Button onClick={() => handleDeleteRecipe(viewRecipe.id)}>
                Delete
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Favorites Section */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Favorites</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes
          .filter((recipe) => favorites.includes(recipe.id))
          .map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onView={() => setViewRecipe(recipe)}
            />
          ))}
      </div>
    </div>
  );
}

function RecipeCard({ recipe, onDelete, onView, onFavorite, isFavorite }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{recipe.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Ingredients: {recipe.ingredients.slice(0, 50)}...
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onView}>View Recipe</Button>
        <div className="flex items-center">
          <Button
            variant={isFavorite ? "secondary" : "outline"}
            onClick={() => onFavorite(recipe)}
          >
            {isFavorite ? "Unfavorite" : "Favorite"}
          </Button>
          <Button onClick={() => onDelete(recipe.id)} className="ml-2">
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default App;
