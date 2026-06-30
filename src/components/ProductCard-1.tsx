import { Link } from "react-router-dom";
import { Card } from "./ui-c/card";
import { Badge } from "./ui-c/badge";
import { Sparkles } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  isNFT?: boolean;
  category: string;
}

const ProductCard = ({ id, name, price, image, isNFT, category }: ProductCardProps) => {
  return (
    <Link to={`/product/${id}`}>
      <Card className="group overflow-hidden border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-[var(--shadow-premium)] bg-card">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {isNFT && (
            <Badge className="absolute top-4 right-4 bg-accent/90 text-accent-foreground backdrop-blur-sm animate-glow-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              NFT Edition
            </Badge>
          )}
        </div>
        <div className="p-4 space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{category}</p>
          <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">
            {name}
          </h3>
          <p className="font-bold text-accent">${price}</p>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
