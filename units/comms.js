// Copyright (c) 2019, Taegus Cromis, The Conceal Developers
//
// Please see the included LICENSE file for more information.

const vsprintf = require("sprintf-js").vsprintf;
const moment = require("moment");
const W2W = require("w2w-api");

module.exports = {
  RpcCommunicator: function (configOpts, errorCallback) {
    // create the W2W api interface object
    var W2WApi = new W2W("http://127.0.0.1", "3333", configOpts.node.port, (configOpts.node.rfcTimeout || 5) * 1000);
    var checkInterval = null;
    var timeoutCount = 0;
    var IsRunning = false;
    var lastHeight = 0;
    var infoData = null;
    var lastTS = moment();

    this.stop = function () {
      clearInterval(checkInterval);
      IsRunning = false;
    };

    this.getData = function () {
      return infoData;
    };

    this.start = function () {
      IsRunning = true;
      timeoutCount = 0;
      lastTS = moment();

      // set the periodic checking interval
      checkInterval = setInterval(function () {
        checkAliveAndWell();
      }, 30000);
    };

    function checkAliveAndWell() {
      if (IsRunning) {
        W2WApi.info().then(data => {
          var heightIsOK = true;
          infoData = data;

          if (lastHeight !== data.height) {
            console.log(vsprintf("Current block height is %d", [data.height]));
            lastHeight = data.height;
            lastTS = moment();
          } else {
            var duration = moment.duration(moment().diff(lastTS));

            if (duration.asSeconds() > (configOpts.restart.maxBlockTime || 1800)) {
              errorCallback(vsprintf("No new block has be seen for more then %d minutes", [(configOpts.restart.maxBlockTime || 1800) / 60]));
              heightIsOK = false;
            }
          }

          if (heightIsOK) {
            if (data.status !== "OK") {
              errorCallback("Status is: " + data.status);
            } else {
              // reset counter
              timeoutCount = 0;
            }
          }
        }).catch(err => {
          if (IsRunning) {
            timeoutCount++;
            if (timeoutCount >= 3) {
              errorCallback(err);
            }
          }
        });
      }
    }
  }
};
