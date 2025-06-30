import React from "react";
import { Link } from "react-router-dom";
import { Clock, Tag, Store } from "lucide-react";
import CountdownTimer from "../../../components/CountdownTimer";
import { IProduct } from "../../Product/types/product";
import { concatDateTimeToDate } from "../../../utils/formatDate";

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link
      to={`/bids/${product.id}`}
      className="group block bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative">
        <img
          src={
            product?.images?.[0]?.url ??
            "https://th.bing.com/th/id/R.0065d42f4349d2ffdcce16e22e7e9c4a?rik=h5yH%2fslzdTnATQ&riu=http%3a%2f%2fwww.wixeq.com%2fwp-content%2fuploads%2f2017%2f12%2fsem-imagem.jpg&ehk=d32D9mtcYvZSbd1xnS2Qv6kSPoqLi98uqHWp%2fPTZnt8%3d&risl=&pid=ImgRaw&r=0"
          }
          alt={product.name}
          className="w-full h-48 sm:h-64 object-cover object-center"
        />

        <div className="absolute top-0 left-0 bg-black bg-opacity-70 text-white px-2 py-1 m-2 rounded-md text-sm">
          <span className="flex items-center">
            <Store className="h-3 w-3 mr-1" />
            {product.store?.name}
          </span>
        </div>

        <div className="absolute top-0 right-0 bg-black bg-opacity-70 text-white px-2 py-1 m-2 rounded-md text-sm">
          <span className="flex items-center">
            <Tag className="h-3 w-3 mr-1" />
            {product.size}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4"></div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-teal-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Lance atual</p>
            <p className="text-lg font-bold text-teal-600">
              $
              {product?.bids?.[product?.bids?.length - 1]?.bid ??
                product.initial_bid}
            </p>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <CountdownTimer
              endDate={concatDateTimeToDate(
                String(product.end_date),
                product.end_time
              )}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
