export class WebSocketService {
    connect(url) {
        this.ws = new WebSocket(url);
        this.ws.onopen = () => console.log('Connected');
    }

    send(message) {
        if (this.ws) this.ws.send(message);
    }
}
