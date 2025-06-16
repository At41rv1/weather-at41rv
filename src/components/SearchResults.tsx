
import { SearchData } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface SearchResultsProps {
  data: SearchData;
}

const SearchResults = ({ data }: SearchResultsProps) => {
  const { results, query, totalResults } = data;

  if (!results || results.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8">
        <p>No results found for "{query}"</p>
        <p className="text-sm mt-2">Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Found {totalResults ? `${totalResults} results` : `${results.length} results`} for "{query}"
      </div>
      
      {results.map((result, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-primary hover:underline line-clamp-2"
                >
                  {result.title}
                </a>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-green-600">
                    {result.displayUrl || new URL(result.url).hostname}
                  </span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {result.snippet}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SearchResults;
