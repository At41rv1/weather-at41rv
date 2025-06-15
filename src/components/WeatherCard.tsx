
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherData } from "@/types";
import { CloudSun, MapPin, Droplets, Wind, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard = ({ data }: WeatherCardProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="w-full max-w-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CloudSun className="h-7 w-7 text-primary" />
            <span className="text-2xl">Current Weather</span>
          </div>
          <div className="flex items-center gap-2 text-base font-medium text-muted-foreground">
            <MapPin className="h-5 w-5" />
            <span>{data.location}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="text-center flex-1">
            <div className="text-7xl font-bold tracking-tighter">{data.temperature}</div>
            <p className="text-muted-foreground text-xl capitalize mt-1">{data.condition}</p>
          </div>
          <div className="flex flex-col items-center justify-center border-l pl-6">
             <Clock className="h-8 w-8 text-primary/80 mb-2" />
            <div className="text-4xl font-bold tracking-tight">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <p className="text-sm text-muted-foreground">Live Time</p>
          </div>
        </div>
        
        <div className="flex justify-around text-muted-foreground pt-6 border-t">
          {data.humidity && (
            <div className="flex items-center gap-3">
              <Droplets className="h-6 w-6 text-primary/80" />
              <div className="flex flex-col items-start">
                <span className="text-base">Humidity</span>
                <span className="font-semibold text-foreground text-lg">{data.humidity}</span>
              </div>
            </div>
          )}
          {data.wind && (
            <div className="flex items-center gap-3">
              <Wind className="h-6 w-6 text-primary/80" />
              <div className="flex flex-col items-start">
                <span className="text-base">Wind</span>
                <span className="font-semibold text-foreground text-lg">{data.wind}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
