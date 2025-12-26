import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: WebSocket;
  private messageSubject = new Subject<any>(); // To handle incoming messages
  private isConnected = false; // Flag to prevent multiple connections
  private reconnectInterval = 5000; // Reconnect delay (5 seconds)
  private websocketUrl!: string; // Store WebSocket URL

  constructor() {}

  connect(url: string) {
    if (this.isConnected) return; // Prevent multiple connections
    this.websocketUrl = url;

    this.socket = new WebSocket(url);
    this.isConnected = true;

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      console.log('Received message:', event.data);
      this.messageSubject.next((event.data)); // Parse JSON messages
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket Disconnected');
      this.isConnected = false;
      setTimeout(() => this.reconnect(), this.reconnectInterval); // Try reconnecting
    };
  }

  private reconnect() {
    if (!this.isConnected) {
      console.log('Reconnecting WebSocket...');
      this.connect(this.websocketUrl);
    }
  }

  sendMessage(message: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open. Cannot send message.');
    }
  }

  getMessages(): Observable<any> {
    
    return this.messageSubject.asObservable();
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.isConnected = false;
    }
  }
}
