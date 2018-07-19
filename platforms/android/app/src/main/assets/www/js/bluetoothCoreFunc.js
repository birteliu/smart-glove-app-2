for (var sensorStatus = !1, vThreshold = 0, vDuration = 0, writeToBuf = !1, msgArr = [], strBuf = "", drawChartHandle, dataBuf = [], showsize = 50, i = 0; i < showsize; i++) dataBuf.push([i, 0]);
google.charts.load("current", { packages: ["corechart", "line"] });

function toUTF8Array(d) { for (var a = [], c = 0; c < d.length; c++) { var b = d.charCodeAt(c);
        128 > b ? a.push(b) : 2048 > b ? a.push(192 | b >> 6, 128 | b & 63) : 55296 > b || 57344 <= b ? a.push(224 | b >> 12, 128 | b >> 6 & 63, 128 | b & 63) : (c++, b = 65536 + ((b & 1023) << 10 | d.charCodeAt(c) & 1023), a.push(240 | b >> 18, 128 | b >> 12 & 63, 128 | b >> 6 & 63, 128 | b & 63)) } return a }

function bluetoothConnect(d) { return new webduino.Arduino({ transport: "bluetooth", address: d }) }

function MsgAnalysis(d) { for (var a = 0; a < d.length; a++) { var c = String.fromCharCode(d[a]); "*" == c && (writeToBuf = !writeToBuf); if (writeToBuf) strBuf += c;
        else { var b = strBuf.split("*");
            strBuf = "";
            c = b[1].substring(0, 1);
            b = b[1].substring(1);
            msgArr.push({ cmd: c, value: b }) } } }

function newBTConnect() { void 0 != app.board._transport && app.board._transport.close();
    app.board = new bluetoothConnect(app.getAddrValue());
    setBTConnectStatus();
    app.board._transport.on("message", function(d) { MsgAnalysis(d) }) }

function setBTConnectStatus() {
    app.txtBtconnectStatus.textContent = app.board.isConnected ? "手套狀態：已連結" : "手套狀態：未連結"
    if (!app.board.isConnected) {
        requestAnimationFrame(setBTConnectStatus);
    }
}

function StatusSwitch() { sensorStatus ? app.board._transport.send(toUTF8Array("1,0*")) : app.board._transport.send(toUTF8Array("1,1*")) }

function getThreshold() { app.board._transport.send(toUTF8Array("2," + app.inputSetValue.value + "*"));
    app.txtThreshold.textContent = "壓力閾值：" + vThreshold }

function setThreshold() { 50 <= app.inputSetValue.value && 1023 >= app.inputSetValue.value ? app.board._transport.send(toUTF8Array("3," + app.inputSetValue.value + "*")) : "" != app.inputSetValue.value && (app.inputSetValue.value = "Error,the range [50 ~ 1023]") }

function getDuration() { app.board._transport.send(toUTF8Array("4," + app.inputSetValue.value + "*"));
    app.txtDuration.textContent = "感測時間：" + vDuration }

function setDuration() { 50 <= app.inputSetValue.value && 1E3 >= app.inputSetValue.value ? app.board._transport.send(toUTF8Array("5," + app.inputSetValue.value + "*")) : "" != app.inputSetValue.value && (app.inputSetValue.value = "Error,the range [50 ~ 1000]") }

function drawBackgroundColor() {
    if (0 != msgArr.length) {
        var d = new google.visualization.DataTable;
        d.addColumn("number", "X");
        d.addColumn("number", "G");
        var a = msgArr.shift();
        if ("undefined" != a)
            if ("G" == a.cmd) { var c; for (c = 0; c < dataBuf.length - 1; c++) dataBuf[c][1] = dataBuf[c + 1][1];
                dataBuf[c][1] = parseInt(a.value) } else {
                "m" == a.cmd ? 0 == a.value ? (app.txtSensorStatus.textContent = "感測器開關：關閉", sensorStatus = !1) : 1 == a.value && (app.txtSensorStatus.textContent = "感測器開關：開啟", sensorStatus = !0) : "c" == a.cmd ? app.txtCnt.textContent =
                    a.value : "t" == a.cmd ? (vThreshold = parseInt(a.value), app.txtThreshold.textContent = "壓力閾值：" + vThreshold) : "d" == a.cmd ? (vDuration = parseInt(a.value), app.txtDuration.textContent = "感測時間：" + vDuration) : (console.log(a.cmd), console.log(a.value));
                return
            }
        d.addRows(dataBuf);
        (new google.visualization.LineChart(document.getElementById("chart_div"))).draw(d, { hAxis: { title: "Time" }, vAxis: { title: "Popularity", viewWindow: { max: 1023, min: 0 } }, backgroundColor: "#ffffff" })
    }
}
