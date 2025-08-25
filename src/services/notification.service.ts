import { notification } from "../types/services";

export default {
    async handlePostEvent(eventType: string, payload: notification) {
        switch (eventType) {
            case "post.create":
                console.log("Handle post creation notification:", eventType, payload);
                break;
            case "post.like":
                console.log("Handle post like notification:", eventType, payload);
                break;
            default:
                console.warn(`Unknown email event type: ${eventType}`);
        }
    }
}