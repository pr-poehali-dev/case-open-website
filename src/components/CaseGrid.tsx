
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Case {
  id: string;
  name: string;
  price: number;
  image: string;
  count?: number;
}

interface CaseGridProps {
  onOpenCase?: (caseItem: Case) => void;
}

export const CaseGrid = ({ onOpenCase }: CaseGridProps) => {
  // Демо-данные для кейсов
  const cases: Case[] = [
    {
      id: "case1",
      name: "Кейс Прайм",
      price: 250,
      image: "https://images.unsplash.com/photo-1604085572504-a392ddf0d86a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      count: 5324
    },
    {
      id: "case2",
      name: "Кейс Хрома",
      price: 450,
      image: "https://images.unsplash.com/photo-1595323397663-b329313268d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      count: 2981
    },
    {
      id: "case3",
      name: "Гамма Кейс",
      price: 350,
      image: "https://images.unsplash.com/photo-1595323397490-631c6057ab4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      count: 4123
    },
    {
      id: "case4",
      name: "Кейс Операция",
      price: 600,
      image: "https://images.unsplash.com/photo-1593642533144-3d62aa4783ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      count: 1856
    },
    {
      id: "case5",
      name: "Праздничный Кейс",
      price: 800,
      image: "https://images.unsplash.com/photo-1607302628343-3e4d63c2e372?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      count: 987
    },
    {
      id: "case6",
      name: "VIP Кейс",
      price: 1500,
      image: "https://images.unsplash.com/photo-1535914954645-aef726eb8fdd?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      count: 562
    },
    {
      id: "case7",
      name: "Легендарный Кейс",
      price: 2500,
      image: "https://images.unsplash.com/photo-1560158670-a6ebd42631db?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      count: 348
    },
    {
      id: "case8",
      name: "Дракон Кейс",
      price: 1200,
      image: "https://images.unsplash.com/photo-1589802829985-817e51171b92?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      count: 892
    }
  ];

  const handleCaseClick = (caseItem: Case) => {
    if (onOpenCase) {
      onOpenCase(caseItem);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {cases.map((caseItem) => (
        <div key={caseItem.id} className="group">
          <Card 
            className="bg-[#1a1f2c] border-gray-800 overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#f97316]/20"
          >
            <div className="relative">
              <img 
                src={caseItem.image} 
                alt={caseItem.name} 
                className="w-full h-48 object-cover object-center transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f2c] to-transparent"></div>
              
              <Badge 
                className="absolute top-3 right-3 bg-[#0e1015]/80 text-white border-none"
              >
                {caseItem.count?.toLocaleString()} открытий
              </Badge>
            </div>
            
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-white truncate">{caseItem.name}</h3>
                <span className="text-[#f97316] font-bold">{caseItem.price} ₽</span>
              </div>
              
              <Button 
                className="w-full bg-[#f97316] hover:bg-[#ea580c]"
                onClick={() => handleCaseClick(caseItem)}
              >
                Открыть кейс
              </Button>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};
