/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
  // Application Constructor
  initialize: function() {
    document.addEventListener(
      "deviceready",
      this.onDeviceReady.bind(this),
      false
    );
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function() {
    //this.receivedEvent('deviceready');

    this.txtBtconnectStatus = document.getElementById("txt_btconnect_status");
    this.txtSensorStatus = document.getElementById("txt_sensor_status");
    this.txtCnt = document.getElementById("txt_cnt");
    this.txtThreshold = document.getElementById("txt_threshold");
    this.txtDuration = document.getElementById("txt_duration");

    this.inputSetValue = document.getElementById("input_set_value");
    this.inputBTaddrValue = document.getElementById("input_btaddr_value");
    this.btnSensorstatusSwitch = document.getElementById(
      "btn_sensorstatus_switch"
    );
    this.btnSetThreshold = document.getElementById("btn_set_threshold");
    this.btnGetThreshold = document.getElementById("btn_get_threshold");
    this.btnSetDuration = document.getElementById("btn_set_duration");
    this.btnGetDuration = document.getElementById("btn_get_duration");
    this.btnSetBTaddr = document.getElementById("btn_set_btaddr");

    //================================================== init
    this.board = new bluetoothConnect("");
    //drawChartTrigger
    setInterval(drawBackgroundColor, 50);
    //================================================= btn event listen
    //Bluetooth Address
    this.btnSetBTaddr.addEventListener("click", newBTConnect);
    //SensorStatus
    this.btnSensorstatusSwitch.addEventListener("click", StatusSwitch);
    //Threshold
    this.btnGetThreshold.addEventListener("click", getThreshold);
    this.btnSetThreshold.addEventListener("click", setThreshold);
    //Duration
    this.btnGetDuration.addEventListener("click", getDuration);
    this.btnSetDuration.addEventListener("click", setDuration);

    $("#select_device").focus(function() {
      var self = this;
      var value = $(self).val();
      $(self).empty();
      bluetoothSerial.list(function(devices) {
        devices.map(function(device) {
          var option = new Option(
            device.name,
            device.address,
            false,
            device.address === value
          );
          $(self).append(option);
        });
      });
    });
  },

  getAddrValue: function() {
    return $("#select_device").val();
  },

  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector(".listening");
    var receivedElement = parentElement.querySelector(".received");

    listeningElement.setAttribute("style", "display:none;");
    receivedElement.setAttribute("style", "display:block;");

    console.log("Received Event: " + id);
  }
};

app.initialize();
