// Copyright (c) 2019, Taegus Cromis, The Conceal Developers
//
// Please see the included LICENSE file for more information.

const commandLineUsage = require('command-line-usage');
const commandLineArgs = require("command-line-args");
const mainEngine = require("./units/engine.js");
const vsprintf = require("sprintf-js").vsprintf;
const download = require("./units/download.js");
const service = require("./units/service.js");
const setup = require("./units/setup.js");
const utils = require("./units/utils.js");
const pjson = require('./package.json');
const path = require("path");
const fs = require("fs");

try {
  var cmdOptions = commandLineArgs([{
    name: "config",
    type: String
  }, {
    name: "daemon",
    type: String
  }, {
    name: "service",
    type: String
  }, {
    name: "setup",
    type: Boolean
  }, {
    name: "node",
    type: String
  }, {
    name: "update",
    type: Boolean
  }, {
    name: "version",
    type: Boolean
  }, {
    name: "help",
    alias: "h",
    type: Boolean
  }]);

} catch (err) {
  console.error("\nUknown command line parameter. Use --help for instructions.");
  process.exit();
}

if (cmdOptions.help) {
  const sections = [
    {
      header: 'W2W Node',
      content: 'This is a node app for the W2W daemon. Handles restarts, sends notifications, registers to pool...'
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'config',
          typeLabel: '{underline file}',
          description: 'The path to configuration file. If empty it uses the config.json in the same directory as the app.'
        },
        {
          name: 'daemon',
          typeLabel: '{underline file}',
          description: 'The path to node daemon executable. If empty it uses the same directory as the app.'
        },
        {
          name: 'setup',
          description: 'Initiates the interactive config setup for the W2W Node'
        },
        {
          name: 'service',
          description: 'Controls the service behaviour. Possible values are: "install", "remove", "start", "stop"'
        },
        {
          name: 'node',
          description: 'Node related commands. Possible values are: "update"'
        },
        {
          name: 'update',
          description: 'Update the W2W Node instance to the latest version'
        },
        {
          name: 'version',
          description: 'Shows the verion of the W2W Node app'
        },
        {
          name: 'help',
          description: 'Shows this help instructions'
        }
      ]
    },
    {
      header: 'Service option values',
      optionList: [
        {
          name: 'install',
          description: 'Install the W2W Node as a service in the OS.'
        },
        {
          name: 'remove',
          description: 'Removes the W2W Node as a service from the OS.'
        },
        {
          name: 'start',
          description: 'Starts the W2W Node as OS service.'
        },
        {
          name: 'stop',
          description: 'Stops the W2W Node as OS service.'
        }
      ]
    },
    {
      header: 'Node option values',
      optionList: [
        {
          name: 'update',
          description: 'Updates to the latest stable version of the node daemon. Node must be stoped first'
        }
      ]
    }
  ];
  const usage = commandLineUsage(sections);
  console.log(usage);
} else if (cmdOptions.version) {
  console.log(vsprintf('\nW2W node version %s\n', [pjson.version]));
} else {
  const rootPath = process.cwd();
  const configFileName = cmdOptions.config || path.join(rootPath, "config.json");

  if (!fs.existsSync(configFileName)) {
    console.log(vsprintf('\n"%s" does not exist! Specify the correct path to the config file or create config.json in the same directory as the application. You can use the config.json.sample as an example\n', [
      configFileName,
    ]));
  } else {
    // read config option to use them either in engine or setup module
    const configOpts = JSON.parse(fs.readFileSync(cmdOptions.config || path.join(rootPath, "config.json"), "utf8"));

    // check if arguments are specified if not make an empty array
    if (!(configOpts.node && configOpts.node.args)) {
      configOpts.node.args = [];
    }

    if (configOpts.node && configOpts.node.bindAddr) {
      var addrIndex = configOpts.node.args.indexOf("--rpc-bind-ip");

      if (addrIndex == -1) {
        // add bind address to arguments
        configOpts.node.args.push("--rpc-bind-ip");
        configOpts.node.args.push(configOpts.node.bindAddr);
      } else {
        configOpts.node.args[addrIndex + 1] = configOpts.node.bindAddr;
      }
    }

    if (configOpts.node && configOpts.node.port) {
      var portIndex = configOpts.node.args.indexOf("--rpc-bind-port");

      if (portIndex == -1) {
        // add fee address to arguments
        configOpts.node.args.push("--rpc-bind-port");
        configOpts.node.args.push(configOpts.node.port);
      } else {
        configOpts.node.args[portIndex + 1] = configOpts.node.port;
      }
    }

    if (configOpts.node && configOpts.node.feeAddr) {
      // add fee address to arguments
      configOpts.node.args.push("--fee-address");
      configOpts.node.args.push(configOpts.node.feeAddr);
    }

    if (cmdOptions.setup) {
      setup.Initialize(configFileName);
    } else if (cmdOptions.service) {
      switch (cmdOptions.service) {
        case "install":
          service.install(configOpts, configFileName);
          break;
        case "remove":
          service.remove(configOpts, configFileName);
          break;
        case "start":
          service.start(configOpts, configFileName);
          break;
        case "stop":
          service.stop(configOpts, configFileName);
          break;
        case "status":
          service.status(configOpts, configFileName);
          break;
        default: console.log('\nWrong parameter for service command. Valid values: "install", "remove", "start", "stop"\n');
      }
    } else if (cmdOptions.node) {
      if (cmdOptions.node === "update") {
        service.stop(configOpts, configFileName);
        download.downloadLatestDaemon(utils.getNodeActualPath(cmdOptions, configOpts, rootPath), function (error) {
          if (error) {
            console.log(vsprintf("\nError updating daemon: %s\n", [error]));
          } else {
            console.log("\nThe daemon has been succesfully updated\n");
          }
        });
      } else {
        console.log('\nWrong parameter for node command. Valid values: "update"\n');
      }
    } else if (cmdOptions.update) {
      service.stop(configOpts, configFileName);
      download.downloadLatestW2wNode(function (error) {
        if (error) {
          console.log(vsprintf("\nError updating the w2w node: %s\n", [error]));
        } else {
          console.log("\nThe w2w node has been succesfully updated\n");
        }
      });
    } else {
      const nodePath = utils.getNodeActualPath(cmdOptions, configOpts, rootPath);
      var guardInstance = null;

      // createGuardInstance function
      var createGuardInstance = function () {
        guardInstance = new mainEngine.NodeGuard(cmdOptions, configOpts, rootPath, pjson.version);
      };

      if (!fs.existsSync(nodePath)) {
        download.downloadLatestDaemon(nodePath, function (error) {
          if (error) {
            console.log(vsprintf("\nError updating daemon: %s\n", [error]));
          } else {
            console.log("\nThe daemon has been succesfully updated\n");
            createGuardInstance();
          }
        });
      } else {
        createGuardInstance();
      }

      process.on('uncaughtException', function (err) {
        guardInstance.logError(err);
      });
    }
  }
}
