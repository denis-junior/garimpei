import React, { useState } from "react";
import { IProduct } from "../types/product";
import { Clock, Tag, Trash2 } from "lucide-react";
import CountdownTimer from "../../../components/CountdownTimer";
import { useNavigate } from "react-router-dom";
import { useCheckSeller } from "../../../utils/checkoSeller";
import { concatDateTimeToDate } from "../../../utils/formatDate";
import { useDeleteProduct } from "../services/CRUD-product";
import ConfirmationModal from "@/components/ConfirmationModal";
import { EStatus } from "@/enum";

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
  const { name, images, size, end_date, end_time } = product;
  const navigate = useNavigate();
  const checkSeller = useCheckSeller();
  const [itemDelete, setItemDelete] = useState<IProduct>();
  const { mutate } = useDeleteProduct();

  const navigateToDetails = () => {
    if (checkSeller) {
      return navigate(`/product/${product.id}`, { state: { product } });
    }
    return navigate(`/bids/${product.id}`);
  };

  const confirmDelete = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    store: IProduct
  ) => {
    e.stopPropagation();
    setItemDelete(store);
  };

  const handleDelete = () => {
    if (itemDelete) {
      mutate(itemDelete.id);
      cancelDelete();
    }
  };

  const cancelDelete = () => {
    setItemDelete(undefined);
  };

  return (
    <>
      <div className="group block bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative">
          <div
            className="absolute  h-44 sm:h-60 inset-0 bg-cover bg-center filter blur-sm scale-105"
            style={{
              backgroundImage: `url(${
                product?.images?.[0]?.url ??
                "https://th.bing.com/th/id/R.0065d42f4349d2ffdcce16e22e7e9c4a?rik=h5yH%2fslzdTnATQ&riu=http%3a%2f%2fwww.wixeq.com%2fwp-content%2fuploads%2f2017%2f12%2fsem-imagem.jpg&ehk=d32D9mtcYvZSbd1xnS2Qv6kSPoqLi98uqHWp%2fPTZnt8%3d&risl=&pid=ImgRaw&r=0"
              })`,
            }}
          />

          <div className="absolute inset-0 bg-black bg-opacity-40" />

          <img
            src={
              (images?.length && images?.length > 0 && images[0]?.url) ||
              "https://th.bing.com/th/id/OIP.rm4o2LZV2iOu83ECOsG-pwHaEm?rs=1&pid=ImgDetMain"
            }
            alt={name}
            className="relative w-full h-48 sm:h-64 object-contain object-center "
          />

          {checkSeller && product.status === EStatus.programmed && (
            <div className="absolute top-0 left-0 bg-black bg-opacity-70 text-white px-2 py-1 m-2 rounded-md text-sm">
              <div className=" flex gap-2">
                <button
                  onClick={(e) => confirmDelete(e, product)}
                  className="p-2 bg-white bg-opacity-80 rounded-full text-gray-700 hover:text-red-600 hover:bg-opacity-100 transition-colors"
                  title="Deletar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="absolute top-0 right-0 bg-black bg-opacity-70 text-white px-2 py-1 m-2 rounded-md text-sm">
            <span className="flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              {size}
            </span>
          </div>

          {!compact && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <CountdownTimer
                endDate={concatDateTimeToDate(String(end_date), end_time)}
              />
            </div>
          )}
        </div>

        <div className="p-4 flex  justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors">
              {name}
            </h3>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Lance atual</p>
                <p className="text-lg font-bold text-primary">
                  $
                  {product.bids[product.bids.length - 1]?.bid ??
                    product.initial_bid}
                </p>
              </div>

              {compact && (
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <CountdownTimer
                    endDate={concatDateTimeToDate(String(end_date), end_time)}
                  />
                </div>
              )}
            </div>
          </div>
          <div className=""></div>
        </div>
        {actions && (
          <button
            onClick={navigateToDetails}
            className="w-full py-4 bg-primary text-white"
          >
            ir para detalhes do produto
          </button>
        )}
      </div>
      {/* Delete confirmation modal */}
      {itemDelete && (
        <ConfirmationModal
          title="Excluir esse item"
          message="Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."
          onCancel={cancelDelete}
          onConfirm={handleDelete}
          confirmText="Excluir"
          cancelText="Cancelar"
        />
      )}
    </>
  );
};

export default ProductCard;
