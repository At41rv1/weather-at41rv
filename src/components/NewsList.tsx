
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsArticle } from "@/types";
import { Newspaper } from "lucide-react";

interface NewsListProps {
  articles: NewsArticle[];
}

const NewsList = ({ articles }: NewsListProps) => {
  return (
    <Card className="w-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Newspaper className="h-7 w-7 text-primary" />
          <span className="text-2xl">Latest News</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {articles.map((article, index) => (
            <li key={index}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-4 rounded-lg transition-colors hover:bg-muted/50"
              >
                <h4 className="font-semibold text-lg group-hover:text-primary transition-colors leading-snug">
                  {article.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-2">{article.source}</p>
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default NewsList;
