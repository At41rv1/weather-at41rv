
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Frown } from "lucide-react";
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
      model: "TogetherAI/NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
      messages: [{ role: "user", content: prompt }],
      stream: false,
    }),
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      const errorMessage = errorData?.error?.message || "Failed to fetch data from the AI service.";
      throw new Error(errorMessage);
    } catch (e) {
      throw new Error("An unexpected error occurred with the AI service. The response was not in the expected format.");
    }
  }

  const data = await response.json();
  
  try {
    const content = data.choices[0].message.content;
    const parsedContent = JSON.parse(content);
    if (!parsedContent.weather || !parsedContent.news) {
      throw new Error("The AI returned data in an unexpected structure.");
    }
    return parsedContent;
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    if (e instanceof Error) {
        throw new Error(`The AI returned an unexpected data format: ${e.message}`);
    }
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
      toast.error(error.message, {
        duration: 8000,
      });
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
        <div className="text-center text-destructive bg-destructive/10 p-6 rounded-lg w-full max-w-2xl mx-auto flex flex-col items-center gap-4">
          <Frown className="h-12 w-12" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Oops! Something went wrong.</h3>
            <p className="text-sm">We couldn't retrieve the information for your location.</p>
            <p className="text-xs bg-destructive/20 p-3 rounded-md font-mono text-destructive/90 mt-4 break-all">
              <strong>Details:</strong> {mutation.error.message}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              This might be an issue with the API service or the provided credentials. Please try again later or verify your API configuration.
            </p>
          </div>
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
        <header className="text-center my-8 md:my-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 pb-2">Weather & News Hub</h1>
          <p className="text-muted-foreground mt-2 text-lg">Your AI-powered daily briefing</p>
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

        <footer className="text-center mt-16 py-6 border-t">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Weather & News Hub. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/80 mt-2">
            Powered by AI. Data may not always be accurate.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
