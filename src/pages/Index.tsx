
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Frown } from "lucide-react";
import { SearchData } from "@/types";
import SearchResults from "@/components/SearchResults";

const API_URL = "https://samuraiapi.in/search";

const fetchSearchResults = async (query: string): Promise<SearchData> => {
  const url = new URL(API_URL);
  url.searchParams.append('q', query);
  url.searchParams.append('engine', 'google');
  url.searchParams.append('max_results', '10');
  url.searchParams.append('region', 'all');
  url.searchParams.append('safesearch', 'moderate');
  url.searchParams.append('type', 'text');

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch search results");
  }

  const data = await response.json();
  
  return {
    results: data.results || [],
    query: query,
    totalResults: data.totalResults || 0
  };
};

const Index = () => {
  const [query, setQuery] = useState("");

  const mutation = useMutation({
    mutationFn: fetchSearchResults,
    onSuccess: () => {
      toast.success("Search results loaded successfully!");
    },
    onError: (error) => {
      toast.error(error.message, {
        duration: 8000,
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.info("Please enter a search query.");
      return;
    }
    mutation.mutate(query);
  };
  
  const renderContent = () => {
    if (mutation.isPending) {
      return (
        <div className="w-full max-w-4xl space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      );
    }

    if (mutation.isError) {
      return (
        <div className="text-center text-destructive bg-destructive/10 p-6 rounded-lg w-full max-w-2xl mx-auto flex flex-col items-center gap-4">
          <Frown className="h-12 w-12" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Oops! Something went wrong.</h3>
            <p className="text-sm">We couldn't retrieve the search results.</p>
            <p className="text-xs bg-destructive/20 p-3 rounded-md font-mono text-destructive/90 mt-4 break-all">
              <strong>Details:</strong> {mutation.error.message}
            </p>
          </div>
        </div>
      );
    }
    
    if (mutation.isSuccess && mutation.data) {
      return (
        <SearchResults data={mutation.data} />
      );
    }

    return (
      <div className="text-center text-muted-foreground">
        <p>Enter your search query to find information on the web.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center my-8 md:my-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 pb-2">Web Search</h1>
          <p className="text-muted-foreground mt-2 text-lg">Search the web for anything</p>
        </header>

        <main className="flex flex-col items-center gap-8">
          <form onSubmit={handleSearch} className="w-full max-w-lg flex gap-2">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for anything..."
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
            © {new Date().getFullYear()} Web Search. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/80 mt-2">
            Powered by SamuraiAPI search.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
