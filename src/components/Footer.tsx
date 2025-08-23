import React from "react";
import { Heart, Instagram, Twitter, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="flex items-center mb-4">
              <img src={Logo} alt="Garimpei" className="h-20" />
            </Link>
            <p className="text-gray-300 mb-4">
              Descubra peças de moda exclusivas e dê lances nos seus itens
              favoritos. Encontre tesouros vintage entre outros.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/garimpeiapp/"
                className="text-gray-300 hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/garimpeiapp/"
                className="text-gray-300 hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/garimpeiapp/"
                className="text-gray-300 hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Ajuda</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="https://www.instagram.com/garimpeiapp/"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="https://www.instagram.com/garimpeiapp/"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Entre em Contato
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Termos e Condições
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>
            © {new Date().getFullYear()} Garimpei App. Todos os Direitos
            Reservados.
          </p>
          <p className="mt-2 flex items-center justify-center">
            Feito com <Heart className="h-4 w-4 mx-1 text-red-500" /> for IDK
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
