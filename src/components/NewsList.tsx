
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsArticle } from "@/types";
import { Newspaper } from "lucide-react";

interface NewsListProps {
  articles: NewsArticle[];
}

const NewsList = ({ articles }: NewsListProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Latest News</span>
          <Newspaper className="h-6 w-6 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {articles.map((article, index) => (
            <li key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <h4 className="font-semibold group-hover:text-primary transition-colors leading-snug">
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
