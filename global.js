/* Change Playgrounds */
function changeFunc() {
    var selectBox = document.getElementById("selectPlayground");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    document.location.href = selectedValue;
}

function createWebSocketConnection() {
        var wsUrl;
        // "wss" is for secure conenctions over https, "ws" is for regular
        if (window.location.protocol === "https:") {
            wsUrl = "wss://127.0.0.1:3000/";
        } else {
            wsUrl = "ws://127.0.0.1:3000/";
        }
        
        // create the websocket and immediately bind handlers
        ws = new WebSocket(wsUrl);
        displayState("created");
        ws.onopen = function () { displayState("open"); };
        ws.onmessage = receiveMessage;
        ws.onclose = function () { displayState("closed"); };
    }

/*
function playgroundSwitcher() {
	var node = document.body;
	node.innerHTML += '<div id="playground-switch" style="position: absolute; bottom: 0; right: 0; left: 0; margin: auto;"><select id="selectPlayground" onchange="changeFunc();"><option value="/Users/nic/playground/index.html">Playground OG</option><option value="/Users/nic/playground/coachmarks/index.html">Coachmarks</option><option value="/Users/nic/playground/design-shop/index.html">Design Shop</option></select></div>';
}
window.onload = playgroundSwitcher;
*/