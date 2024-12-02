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
import { Label } from "@/components/ui/label";
import { StarIcon } from "@/components/ui/star-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const RecipeForm = ({ addRecipe }) => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addRecipe({ title, ingredients, steps, rating: 0 });
    setTitle("");
    setIngredients("");
    setSteps("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="ingredients">Ingredients</Label>
        <Textarea
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="steps">Preparation Steps</Label>
        <Textarea
          id="steps"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Add Recipe</Button>
    </form>
  );
};

const StarRating = ({ rating, onRate }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`w-5 h-5 cursor-pointer ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => onRate(star)}
        />
      ))}
    </div>
  );
};

const RecipeCard = ({ recipe, onRate }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{recipe.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>
          <strong>Ingredients:</strong> {recipe.ingredients}
        </CardDescription>
        <CardDescription className="mt-2">
          <strong>Steps:</strong> {recipe.steps}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <StarRating
          rating={recipe.rating}
          onRate={(rating) => onRate(recipe.title, rating)}
        />
        <span>Rating: {recipe.rating}/5</span>
      </CardFooter>
    </Card>
  );
};

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [filter, setFilter] = useState(0);
  const [search, setSearch] = useState("");
  const [isGridView, setIsGridView] = useState(true);

  const addRecipe = (recipe) => {
    setRecipes([...recipes, recipe]);
  };

  const rateRecipe = (title, rating) => {
    setRecipes(
      recipes.map((recipe) =>
        recipe.title === title ? { ...recipe, rating } : recipe
      )
    );
  };

  const filteredRecipes = recipes
    .filter((recipe) => recipe.rating >= filter)
    .filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(search.toLowerCase()) ||
        recipe.ingredients.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Recipe Sharing and Rating</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Recipe</h2>
        <RecipeForm addRecipe={addRecipe} />
      </div>

      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <Input
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />
        <div className="flex items-center space-x-4">
          <Select
            value={filter}
            onValueChange={(value) => setFilter(Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All ratings</SelectItem>
              <SelectItem value="1">1 star and above</SelectItem>
              <SelectItem value="2">2 stars and above</SelectItem>
              <SelectItem value="3">3 stars and above</SelectItem>
              <SelectItem value="4">4 stars and above</SelectItem>
              <SelectItem value="5">5 stars only</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Label htmlFor="grid-view">Grid View</Label>
            <Switch
              id="grid-view"
              checked={isGridView}
              onCheckedChange={setIsGridView}
            />
          </div>
        </div>
      </div>

      <div
        className={`grid gap-4 ${
          isGridView ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        }`}
      >
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.title} recipe={recipe} onRate={rateRecipe} />
        ))}
      </div>
    </div>
  );
}
