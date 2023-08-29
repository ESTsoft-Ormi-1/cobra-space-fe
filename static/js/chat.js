const handlers = {
    chat_messages_tag: null,
    chat_containter: null,
    ws: null,
    retry: 0,

    init() {
        this.chat_messages_tag = document.querySelector("#chat_messages");
        document
            .querySelector("#message_form").addEventListener("submit", this.onsubmit.bind(this));
    },
    connect(ws_url) {
        if (this.ws) this.ws.close();

        this.ws = new WebSocket(ws_url || this.ws?.url);

        this.ws.onopen = this.onopen.bind(this);
        this.ws.onclose = this.onclose.bind(this);
        this.ws.onerror = this.onerror.bind(this);
        this.ws.onmessage = this.onmessage.bind(this);
    },
    reconnect() {
        this.connect();
    },
    onopen() {
        console.log("웹소켓 서버와 접속");
    },
    onclose(event) {
        const close_code = event.code;

        if (close_code === 4000) {
            this.modal("채팅창이 삭제되었습니다. 대기실로 이동합니다.", () => {
                window.location.href = "{% url 'chat:index'%}";
            });
        }
        if (!event.wasClean) {
            console.error("웹소켓 서버가 죽었거나, 네트워크 장애입니다.");
            if (this.retry < 3) {
                this.retry += 1;
                setTimeout(() => {
                    this.reconnect();
                    console.log(`[${this.retry}] 접속 재시도...`);
                }, 1000 * this.retry)
            } else {
                console.log("웹소켓 서버에 접속할 수 없습니다. 대기실로 이동합니다.");
                window.location.href = "{% url 'chat:index' %}";
            }
        }
    },
    onerror() {
        console.log("웹소켓 에러가 발생했습니다. 대기실로 이동합니다.");
        window.location.href = "{% url 'chat:index' %}";
    },
    onmessage(event) {
        const message_json = event.data;
        console.log("메세지 수신: ", message_json);

        const {
            type,
            message,
            sender,
            username
        } = JSON.parse(message_json);
        switch (type) {
            case "chat.message":
                this.append_message(message, sender);
                break;
            case "chat.user.join":
                this.append_message(`${username}님이 들어오셨습니다.`);
                this.username_set.add(username);
                this.update_user_list();
                break;

            case "chat.user.leave":
                this.append_message(`${username}님이 나가셨습니다.`);
                this.username_set.delete(username);
                this.update_user_list();
                break;
            default:
                console.error(`Invaild message type : ${type}`);
        }
    },
    append_message(message, sender) {
        const element = document.createElement("div");
        element.className = "chat-message me";

        let footer = "";
        if (sender === "{{ user.username }}") {
            element.className += " me";
        } else if (sender) {
            footer = ` from ${sender}`;
        }

        const wrapper = document.createElement("div");
        wrapper.className = "message-content";
        wrapper.textContent = message;
        element.appendChild(wrapper);

        this.chat_messages_tag.appendChild(element);

        this.chat_messages_tag.scrollTop = this.chat_messages_tag.scrollHeight;
    },
    onsubmit(event) {
        event.preventDefault();

        const form_data = new FormData(event.target);
        const props = Object.fromEntries(form_data);
        event.target.reset(); // reset form

        const {
            message
        } = props;
        console.log("웹소켓으로 전송할 메세지 :", message);
        this.append_message(message);

        // this.ws.send(JSON.stringify({
        //     type: "chat.message",
        //     message: message
        // }))

        this.scrollToBottom();
    },
    update_user_list() {
        const html = [...this.username_set]
            .map(username => `<li>${username}</li>`)
            .join('');
        document.querySelector("#user_list").innerHTML = html;

        document.querySelector("#user_count").textContent = `(${this.username_set.size}명)`;
    },
    modal(message, ok_handler) {
        const modal_ele = document.querySelector("#staticBackdrop");
        const body_ele = modal_ele.querySelector(".modal-body");
        const button_ele = modal_ele.querySelector(".modal-footer button");

        body_ele.textContent = message;

        button_ele.addEventListener("click", () => {
            if (ok_handler) ok_handler();
            modal.hide();
        })

        const modal = new bootstrap.Modal(modal_ele);
        modal.show();
    },
    scrollToBottom() {
        this.chat_messages_tag.scrollTop = this.chat_messages_tag.scrollHeight;
    },
};

handlers.init();

// const protocol = location.protocol === "http:" ? "ws:" : "wss:";
// // const ws_url = protocol + "//" + 8000 + "/ws" + location.pathname;
// const ws_url = 'ws://localhost:8000/ws/chat/square/chat/'

// handlers.connect(ws_url);