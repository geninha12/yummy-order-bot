
import React from 'react';
import { Smartphone } from 'lucide-react';
import { CardTitle, CardDescription } from '@/components/ui/card';

type ConnectionHeaderProps = {
  isConnected: boolean;
  isEditing: boolean;
};

const ConnectionHeader: React.FC<ConnectionHeaderProps> = ({ isConnected, isEditing }) => {
  let title = 'Conectar ao WhatsApp';
  let description = 'Conecte sua conta do WhatsApp Business API para enviar mensagens automáticas';

  if (isConnected) {
    if (isEditing) {
      title = 'Editar Conexão WhatsApp';
      description = 'Atualize suas credenciais do WhatsApp Business API';
    } else {
      title = 'WhatsApp Conectado';
      description = 'Sua conta do WhatsApp Business está conectada e pronta para enviar mensagens';
    }
  }

  return (
    <>
      <CardTitle className="text-lg font-medium flex items-center">
        {isConnected && !isEditing && <Smartphone className="mr-2 h-5 w-5 text-primary" />}
        {title}
      </CardTitle>
      <CardDescription>
        {description}
      </CardDescription>
    </>
  );
};

export default ConnectionHeader;
