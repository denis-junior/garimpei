import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: string;
  setError: (error: string) => void;
}
const ErrorPayment = ({ error, setError }: ErrorProps) => {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <AlertDialog open={!!error}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Erro no Pagamento
            </AlertDialogTitle>
            <AlertDialogDescription className="text-red-700">
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setError("")}>
              Tentar novamente
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ErrorPayment;
