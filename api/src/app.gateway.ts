import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  MessageBody,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'dgram';

@WebSocketGateway({transports: ['websocket']})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  wss;

  private logger = new Logger('AppGateway');

  handleConnection(@ConnectedSocket() client: Socket): void {
    this.logger.log(`INFO: Client connected from server.`);
    client.emit('connection', 'Successfully connected to server');
  }

  handleDisconnect(): void {
    this.logger.log(`INFO: Client disconnected from server.`);
  }

  @SubscribeMessage('test')
  handleMad(@ConnectedSocket() client: Socket, @MessageBody() data: any): void {
    console.log('data', data);
    this.logger.log('INFO: test detected.');
    client.emit('tested', 'test tested!');
  }
}
