import Mitt from "mitt";

// 消息总线，事件订阅模式
const eventHub = new Mitt();

export default eventHub;
