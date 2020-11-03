// Copyright (c) 2019, Taegus Cromis, The Conceal Developers
//
// Please see the included LICENSE file for more information.

const xmlbuilder = require("xmlbuilder");
const username = require('username');
const format = require("string-template");
const shell = require("shelljs");
const path = require("path");
const fs = require("fs");
const os = require("os");

// export functions
module.exports = {
  install: function (configOpts, configFileName) {
    try {
      if (process.platform == "win32") {
        var xmlFile = xmlbuilder.create('configuration');
        xmlFile.ele('id', 'W2WNode');
        xmlFile.ele('name', 'W2W Node');
        xmlFile.ele('description', 'W2W Node for monitoring the W2W Gui');
        xmlFile.ele('executable', path.join(process.cwd(), 'w2w-node-win64.exe'));
        xmlFile.ele('arguments', '--config ' + configFileName);

        fs.writeFile("cgservice.xml", xmlFile.end({ pretty: true }), function (err) {
          if (err) {
            console.log('\nError trying to save the XML: ' + err);
          } else {
            shell.exec('cgservice.exe install');
          }
        });
      } else if (process.platform == "linux") {
        var template = fs.readFileSync("w2w-node.service.template", "utf8");
        var parsedData = format(template, {
          user: username.sync(),
          workDir: process.cwd(),
          execPath: path.join(process.cwd(), 'node-linux64'),
          configPath: configFileName
        });

        fs.writeFile("/etc/systemd/system/w2w-node.service", parsedData, function (err) {
          if (err) {
            console.log('\nError trying to save the service file: ' + err);
          } else {
            console.log('\nService is succesfully installed.\n');
            shell.exec('systemctl daemon-reload');
          }
        });
      } else {
        console.log("\nPlatform is not supported!\n");
      }
    } catch (err) {
      console.log(err.message);
    }
  },
  remove: function (configOpts, configFileName) {
    try {
      if (process.platform == "win32") {
        shell.exec('cgservice.exe uninstall');
      } else if (process.platform == "linux") {
        fs.unlink("/etc/systemd/system/w2w-node.service", function (err) {
          if (err) {
            console.log('\nError trying to remove the service: ' + err);
          } else {
            console.log('\nService is succesfully removed.\n');
          }
        });
      } else {
        console.log("\nPlatform is not supported!\n");
      }
    } catch (err) {
      console.log(err.message);
    }
  },
  start: function (configOpts, configFileName) {
    try {
      if (process.platform == "win32") {
        shell.exec('cgservice.exe start');
      } else if (process.platform == "linux") {
        shell.exec('systemctl start w2w-node');
        shell.exec('systemctl status w2w-node');
      } else {
        console.log("\nPlatform is not supported!\n");
      }
    } catch (err) {
      console.log(err.message);
    }
  },
  stop: function (configOpts, configFileName) {
    try {
      if (process.platform == "win32") {
        shell.exec('cgservice.exe stop');
      } else if (process.platform == "linux") {
        shell.exec('systemctl stop w2w-node');
      } else {
        console.log("\nPlatform is not supported!\n");
      }
    } catch (err) {
      console.log(err.message);
    }
  },
  status: function (configOpts, configFileName) {
    try {
      if (process.platform == "win32") {
        shell.exec('cgservice.exe status');
      } else if (process.platform == "linux") {
        shell.exec('systemctl status w2w-node');
      } else {
        console.log("\nPlatform is not supported!\n");
      }
    } catch (err) {
      console.log(err.message);
    }
  }
};