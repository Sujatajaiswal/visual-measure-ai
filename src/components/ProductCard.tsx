import React from "react";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  isSelected: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  isSelected,
}) => (
  <div
    onClick={onClick}
    className={`group relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
      isSelected
        ? "ring-2 ring-indigo-500 border-indigo-500"
        : "border-gray-200"
    }`}
  >
    <div className="aspect-square bg-gray-100 relative overflow-hidden">
      {product.images[0] ? (
        <img
          src={product.images[0]}
          alt={product.id}
          className="w-full h-full object-contain mix-blend-multiply p-4 group-hover:scale-105 transition-transform"
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          No Image
        </div>
      )}
    </div>
    <div className="p-3">
      <h3 className="font-medium text-gray-900 truncate">{product.category}</h3>
      <p className="text-sm text-gray-500">{product.id}</p>
    </div>
  </div>
);

export default ProductCard;
