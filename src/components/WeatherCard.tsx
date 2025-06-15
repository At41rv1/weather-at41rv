
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherData } from "@/types";
import { CloudSun, MapPin } from "lucide-react";

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard = ({ data }: WeatherCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Weather</span>
          <CloudSun className="h-6 w-6 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">{data.location}</h3>
        </div>
        <div className="text-5xl font-bold tracking-tighter">{data.temperature}</div>
        <p className="text-muted-foreground text-lg">{data.condition}</p>
        <div className="flex justify-between text-muted-foreground">
          {data.humidity && <span>Humidity: {data.humidity}</span>}
          {data.wind && <span>Wind: {data.wind}</span>}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
