// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// Bring in Phoenix channels client library:
import {Socket, Presence} from "phoenix"

// And connect to the path in "lib/phoenix_cursors_web/endpoint.ex". We pass the
// token for authentication. Read below how it should be used.
let socket = new Socket("/socket", {
  params: {token: sessionStorage.userToken}
});

function cursorTemplate({ x, y, name, color, msg }) {
  const li = document.createElement('li');
  li.classList =
    'flex flex-col absolute pointer-events-none whitespace-nowrap overflow-hidden';
  li.style.left = x + 'px';
  li.style.top = y + 'px';
  li.style.color = color;

  li.innerHTML = `
    <svg
      version="1.1"
      width="25px"
      height="25px"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 21 21">
        <polygon
          fill="black"
          points="8.2,20.9 8.2,4.9 19.8,16.5 13,16.5 12.6,16.6" />
        <polygon
          fill="currentColor"
          points="9.2,7.3 9.2,18.5 12.2,15.6 12.6,15.5 17.4,15.5"
        />
    </svg>
    <span class="mt-1 ml-4 px-1 text-sm text-white" />
  `;

  li.lastChild.style.backgroundColor = color;
  li.lastChild.textContent = name;

  if(msg){
    li.innerHTML+=`
      <span class="text-green-50 mt-1 py-0 px-1 text-sm text-left rounded-br-md opacity-80 fit-content" />
    `

    li.lastChild.style.backgroundColor = color;
    li.lastChild.textContent = msg;
  }


  return li;
}


socket.connect()

let channel = socket.channel("cursor:lobby", {});

channel
  .join()
  .receive("ok", resp => {
    console.log("Joined successfully", resp);

    document.addEventListener('mousemove', (e) => {
      const x = e.pageX / window.innerWidth;
      const y = e.pageY / window.innerHeight;
      channel.push('move', {x, y, msg});
    });
  })
  .receive("error", resp => { console.log("Unable to join", resp) });

window.msgform.addEventListener("submit", (e) => {
  e.preventDefault();
  channel.push("msg_send", { msg: e.target.msg.value });
  e.target.msg.value = "";
});

const presence = new Presence(channel);

presence.onSync(() => {

  const ul = document.createElement('ul');

  presence.list((name, {metas: [firstDevice] }) => {
    const {x, y, msg, color} = firstDevice;
    const cursorLi = cursorTemplate({
      name,
      color,
      msg,
      x: x * window.innerWidth,
      y: y * window.innerHeight
    });
    ul.appendChild(cursorLi);
  });
  document.getElementById('cursor-list').innerHTML = ul.innerHTML;
});

export default socket
