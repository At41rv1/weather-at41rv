
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { ApiData } from "@/types";
import WeatherCard from "@/components/WeatherCard";
import NewsList from "@/components/NewsList";

// IMPORTANT: It's not secure to expose API keys on the client-side.
// For a real application, this should be handled by a backend service.
const API_KEY = "92771772128838772";
const API_URL = "https://samuraiapi.in/v1/chat/completions";

const fetchWeatherAndNews = async (location: string): Promise<ApiData> => {
  const prompt = `For the location '${location}', provide the current weather and the top 3 latest news headlines. Please provide the response strictly in the following JSON format, with no other text before or after the JSON object: {"weather": {"location": "<city>, <country>", "temperature": "<temp>°C", "condition": "<description>", "humidity": "<humidity>%", "wind": "<speed> km/h"}, "news": [{"title": "<headline>", "url": "<full_url>", "source": "<source_name>"}]}`;
  
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "XenAI/gpt-4o-search-preview",
      messages: [{ role: "user", content: prompt }],
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data from the AI service.");
  }

  const data = await response.json();
  
  try {
    const content = data.choices[0].message.content;
    return JSON.parse(content);
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    throw new Error("The AI returned an unexpected data format.");
  }
};

const Index = () => {
  const [location, setLocation] = useState("");

  const mutation = useMutation({
    mutationFn: fetchWeatherAndNews,
    onSuccess: () => {
      toast.success("Information loaded successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) {
      toast.info("Please enter a location.");
      return;
    }
    mutation.mutate(location);
  };
  
  const renderContent = () => {
    if (mutation.isPending) {
      return (
        <div className="grid gap-8 md:grid-cols-2 w-full">
          <Skeleton className="h-[280px] w-full" />
          <Skeleton className="h-[280px] w-full" />
        </div>
      );
    }

    if (mutation.isError) {
      return (
        <div className="text-center text-destructive">
          <p>Sorry, something went wrong.</p>
          <p>{mutation.error.message}</p>
        </div>
      );
    }
    
    if (mutation.isSuccess && mutation.data) {
      return (
        <div className="grid gap-8 md:grid-cols-2 w-full">
          <WeatherCard data={mutation.data.weather} />
          <NewsList articles={mutation.data.news} />
        </div>
      );
    }

    return (
      <div className="text-center text-muted-foreground">
        <p>Search for a location to get the latest weather and news.</p>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center my-8">
          <h1 className="text-4xl font-bold tracking-tight">Weather & News Hub</h1>
          <p className="text-muted-foreground mt-2">Your AI-powered daily briefing</p>
        </header>

        <main className="flex flex-col items-center gap-8">
          <form onSubmit={handleSearch} className="w-full max-w-lg flex gap-2">
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="E.g., London, New York, Tokyo..."
              className="flex-grow"
              disabled={mutation.isPending}
            />
            <Button type="submit" disabled={mutation.isPending}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
          
          <div className="w-full flex justify-center mt-4">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
