import React from "react";
import { IProduct } from "../types/product";
import { Clock, Tag } from "lucide-react";
import CountdownTimer from "../../../components/CountdownTimer";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: IProduct;
  compact?: boolean;
  actions?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  compact = false,
  actions = false,
}) => {
  const { name, images, initial_bid, size, end_date } = product;
  const navigate = useNavigate();

  const navigateToDetails = () => {
    navigate(`/product/${product.id}`, { state: { product } });
  };
  return (
    <>
      <div className="group block bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative">
          <img
            src={
              (images?.length && images?.length > 0 && images[0]?.url) ||
              "https://th.bing.com/th/id/OIP.rm4o2LZV2iOu83ECOsG-pwHaEm?rs=1&pid=ImgDetMain"
            }
            alt={name}
            className="w-full h-48 sm:h-64 object-cover object-center"
          />

          <div className="absolute top-0 right-0 bg-black bg-opacity-70 text-white px-2 py-1 m-2 rounded-md text-sm">
            <span className="flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              {size}
            </span>
          </div>

          {!compact && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <CountdownTimer endDate={end_date} />
            </div>
          )}
        </div>

        <div className="p-4 flex  justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-teal-600 transition-colors">
              {name}
            </h3>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Lance atual</p>
                <p className="text-lg font-bold text-teal-600">
                  ${initial_bid}
                </p>
              </div>

              {compact && (
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <CountdownTimer endDate={end_date} />
                </div>
              )}
            </div>
          </div>
          <div className=""></div>
        </div>
        {actions && (
          <button
            onClick={navigateToDetails}
            className="w-full py-4 bg-teal-600 text-white"
          >
            ir para detalhes do produto
          </button>
        )}
      </div>
    </>
  );
};

export default ProductCard;
