
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle } from 'lucide-react';

interface EmailConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const EmailConfirmationPopup: React.FC<EmailConfirmationPopupProps> = ({ 
  isOpen, 
  onClose, 
  email 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-w-[90vw] p-0">
        <div className="text-center p-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-violet/10 rounded-full flex items-center justify-center">
                <Mail className="h-10 w-10 text-violet" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
          
          <DialogHeader className="text-center mb-6">
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              Confirmez votre adresse email
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mb-8">
            <p className="text-lg text-gray-700">
              Un email de confirmation a été envoyé à :
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-violet text-lg">
                {email}
              </p>
            </div>
            <p className="text-gray-600">
              Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation 
              pour activer votre compte.
            </p>
            <p className="text-sm text-gray-500">
              Si vous ne voyez pas l'email, vérifiez vos spams ou courriers indésirables.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={onClose}
              className="w-full bg-violet hover:bg-violet/90 text-white font-medium py-3"
            >
              J'ai compris
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                // Simulate resend email
                console.log('Resending email...');
              }}
              className="w-full"
            >
              Renvoyer l'email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailConfirmationPopup;
