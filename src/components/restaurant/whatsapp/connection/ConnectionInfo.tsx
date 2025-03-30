
import React from 'react';
import { Smartphone, Link2Off } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';

type ConnectionInfoProps = {
  accountInfo: {
    id: string;
    name: string;
  } | null;
  onEdit: () => void;
  onDisconnect: () => void;
};

const ConnectionInfo: React.FC<ConnectionInfoProps> = ({ 
  accountInfo, 
  onEdit, 
  onDisconnect 
}) => {
  return (
    <>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">ID da Conta:</span>
            <span className="text-sm">{accountInfo?.id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Nome da Conta:</span>
            <span className="text-sm">{accountInfo?.name}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
        >
          Editar Conexão
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDisconnect}
        >
          <Link2Off className="mr-2 h-4 w-4" />
          Desconectar
        </Button>
      </CardFooter>
    </>
  );
};

export default ConnectionInfo;
