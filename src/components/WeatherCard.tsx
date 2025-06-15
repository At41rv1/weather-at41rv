
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherData } from "@/types";
import { CloudSun, MapPin, Droplets, Wind } from "lucide-react";

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
        <div className="flex justify-between text-muted-foreground pt-4 border-t">
          {data.humidity && (
            <div className="flex items-center gap-2 text-sm">
              <Droplets className="h-5 w-5 text-primary/70" />
              <div className="flex flex-col items-start">
                <span>Humidity</span>
                <span className="font-semibold text-foreground">{data.humidity}</span>
              </div>
            </div>
          )}
          {data.wind && (
            <div className="flex items-center gap-2 text-sm">
              <Wind className="h-5 w-5 text-primary/70" />
              <div className="flex flex-col items-start">
                <span>Wind</span>
                <span className="font-semibold text-foreground">{data.wind}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
