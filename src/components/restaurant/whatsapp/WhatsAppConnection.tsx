
import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { useWhatsApp } from '@/context/WhatsAppContext';
import ConnectionHeader from './connection/ConnectionHeader';
import ConnectionInfo from './connection/ConnectionInfo';
import ConnectionForm from './connection/ConnectionForm';
import { z } from 'zod';

const connectionSchema = z.object({
  token: z.string().min(1, { message: 'Token é obrigatório' }),
  phoneNumberId: z.string().min(1, { message: 'ID do número é obrigatório' }),
  appId: z.string().optional(),
  appSecret: z.string().optional(),
});

const WhatsAppConnection: React.FC = () => {
  const { isConnected, isLoading, connectionError, accountInfo, connectWhatsApp, disconnectWhatsApp } = useWhatsApp();
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSubmit = async (values: z.infer<typeof connectionSchema>) => {
    await connectWhatsApp(
      values.token, 
      values.phoneNumberId,
      values.appId || undefined,
      values.appSecret || undefined
    );
    setIsEditing(false);
  };

  const handleDisconnect = () => {
    disconnectWhatsApp();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <ConnectionHeader 
          isConnected={isConnected} 
          isEditing={isEditing} 
        />
      </CardHeader>
      
      {isConnected && !isEditing ? (
        <ConnectionInfo 
          accountInfo={accountInfo} 
          onEdit={() => setIsEditing(true)} 
          onDisconnect={handleDisconnect} 
        />
      ) : (
        <ConnectionForm 
          onSubmit={handleSubmit}
          onCancel={isConnected ? () => setIsEditing(false) : undefined}
          isLoading={isLoading}
          connectionError={connectionError}
          isConnected={isConnected}
        />
      )}
    </Card>
  );
};

export default WhatsAppConnection;
