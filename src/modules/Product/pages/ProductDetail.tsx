import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProduct } from "../services/CRUD-product";
import PageHeader from "../../../components/PageHeader";
import { concatDateTimeToDate, formatDate } from "@/utils/formatDate";
import { formatCurrencyBR } from "@/utils/formatCurrencyBr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Users,
  Instagram,
  Store,
  Tag,
  TrendingUp,
} from "lucide-react";
import Loader from "@/components/Loader";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useGetProduct(id || "");

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-64">
        <Loader />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Produto não encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            O produto que você está procurando não existe ou foi removido.
          </p>
          <Button onClick={() => navigate(-1)} variant="outline">
            Voltar
          </Button>
        </Card>
      </div>
    );
  }

  const currentBid =
    product.bids[product.bids.length - 1]?.bid || product.initial_bid;

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={product.name}
        subtitle={product.description}
        action={
          product.store && (
            <Button
              variant="outline"
              onClick={() => navigate(`/store/${product.store?.id}`)}
              className="flex items-center gap-2"
            >
              <Store className="h-4 w-4" />
              Ver Loja
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Imagem do Produto */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="relative ">
              <div
                className="absolute  h-44 sm:h-96 inset-0 bg-cover bg-center filter blur-sm scale-105"
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
                  product.images?.[0]?.url ||
                  "https://th.bing.com/th/id/OIP.rm4o2LZV2iOu83ECOsG-pwHaEm?rs=1&pid=ImgDetMain"
                }
                alt={product.name}
                className="relative w-full h-48 sm:h-96 object-contain object-center "
              />
              <div className="absolute top-0 right-0 bg-black bg-opacity-70 text-white px-2 py-1 m-2 rounded-md text-sm">
                <span className="flex items-center">
                  <Tag className="h-3 w-3 mr-1" />
                  {product.size}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Informações do Leilão */}
        <div className="space-y-6">
          {/* Lance Atual */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Lance Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">
                {formatCurrencyBR(Number(currentBid))}
              </div>
              <p className="text-sm text-gray-500">
                Lance inicial: {formatCurrencyBR(Number(product.initial_bid))}
              </p>
            </CardContent>
          </Card>

          {/* Detalhes do Leilão */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Detalhes do Leilão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Data de Início</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(
                      concatDateTimeToDate(
                        String(product.initial_date),
                        product.initial_time
                      )
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Data de Encerramento</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(
                      concatDateTimeToDate(
                        String(product.end_date),
                        product.end_time
                      )
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Total de Lances</p>
                  <p className="text-sm text-gray-600">{product.bids.length}</p>
                </div>
              </div>

              {product.store && (
                <div className="flex items-center gap-3">
                  <Store className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Loja</p>
                    <p className="text-sm text-gray-600">
                      {product.store.name}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Histórico de Lances */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Histórico de Lances ({product.bids.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {product.bids.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Nenhum lance até o momento
              </h3>
              <p className="text-gray-500">
                Seja o primeiro a fazer um lance neste leilão!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {product.bids
                .sort((a, b) => Number(b.bid) - Number(a.bid))
                .map((bid, index) => (
                  <div
                    key={bid.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-white">
                            {bid.buyer.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {index === 0 && (
                          <Badge className="absolute -top-2 -right-2 text-xs px-1 py-0">
                            Maior
                          </Badge>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-800">
                            {bid.buyer.name}
                          </p>
                          {bid.buyer.instagram && (
                            <a
                              href={`https://instagram.com/${bid.buyer.instagram.replace(
                                /@/,
                                ""
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                            >
                              <Instagram className="h-3 w-3" />
                              <span className="text-xs">
                                {bid.buyer.instagram}
                              </span>
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(
                            concatDateTimeToDate(String(bid.date), bid.time)
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">
                        {formatCurrencyBR(Number(bid.bid))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetail;
