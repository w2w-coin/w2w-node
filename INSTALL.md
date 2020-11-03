# W2W Node Installation Instructions

Please take note that you will need **administrative rights** for working with service commands. On Linux and macOS ensure that you have superuser privileges. On Windows, be sure you are using "Run as administrator" option.

## Table of Contents
  * [Getting the Executables](#getting-the-executables)
     * [Linux Dependencies](#linux-dependencies)
     * [macOS Dependencies](#macos-dependencies)
  * [Configuration](#configuration)
  * [Running](#running)
  * [Updating](#updating)
     * [Node Daemon](#node-daemon)
     * [W2W Node](#w2w node)

## Getting the Executables

Download the appropriate binary for your OS [here](https://github.com/w2w-coin/w2w-node/releases) and extract them to the directory of your choice.

If running on Linux or macOS, before running `w2wd`, Boost v1.58 must be installed. In case your package manager installs different Boost version (as it is with Ubuntu 18.10 or higher), `w2wd` executable will have to be built manually as described [here](https://github.com/w2w-coin/w2w#compiling-w2w-from-source). You can check installed Boost version by running `dpkg -s libboost-dev | grep 'Version'` on Linux or `brew info boost` on macOS if you installed it with Homebrew.

### Linux Dependencies

On Debian based system (Debian, Ubuntu, Mint...) you can use package manager:

```bash
$ sudo apt update
$ sudo apt install -y libboost-all-dev
```

### macOS Dependencies

The easiest way to install dependencies on macOS is by using [Homebrew](https://brew.sh/). Once Homebrew is installed, proceed with installing Boost:

```bash
$ brew install boost
```

## Configuration

You can use guided setup to configure your W2W Node. On Linux or macOS, run:
 
```bash
./node-linux64 --setup
```

or on Windows simply double click on `setup.bat`.

Each OS has the executable of a different name so be sure to use the appropriate one for your OS.

You will be presented with few questions, answer them and you will be ready to go.


**Questions explanations:**

> Please input the path to the "w2wd" executable (if you do not know what to put in, leave it empty)

Absolute path to `w2wd` daemon executable. If left empty the W2W Node will try to look in project's directory and use that one. If `w2wd` is not found it will try to download the latest one.

NOTE: The automatic download and install works for Windows and Ubuntu 16.04 and 18.04 only. For any other OS you need to compile your own daemon.

> Please input name for your node (this will be what others see)

This is the name of the node that will be visible in the pool. It is a **mandatory input**.

> Will this be a fee based remote node?

If you want to run your node as remote node with a fee, then answer `YES` to this.

> Please input the fee address for your node (earnings will be sent to that address)

Address where to send fees if W2W Node is running as fee based remote node.

> Will your node be accessible from the outside?

This controls if your node will be accessible from the internet or not. If you run this internally then answer `NO`. If people will use it from the internet and connect to it, then you need to answer `YES`.

> Will your node have auto update enabled?

This option controls if your W2W Node will try to autoupdate the daemon (node). If true then the W2W Node will check every hour if there is a new version available and update it, if it is.

> Do you want to be listed in the nodes pool?

Decide if you will be listed in the explorer nodes pool.

> Please input the URL of the pool (default value should be ok)

If previous answer was `YES` then you select the pool address here. The default value should bi fine, so just press `ENTER`.

> Do you want to be notified on Discord in case of problems?

Answer `YES` if you want to be notified over the Discord in case of a problem with node. You will be asked further questions if you answered `YES`.

> Do you want to be notified over email in case of problems?

Answer `YES` if you want to be notified over the email in case of a problem with node. You will be asked further questions if you answered `YES`.

## Running

To install system service, run:

```bash
./node-linux64 --service install
```

Once the service is installed, you can simply run it with:

```bash
./node-linux64 --service start
```

To stop the service use the command:

```bash
./node-linux64 --service stop
```

And to remove it just use: 

```bash
./node-linux64 --service remove
```

To see if the service is running correctly and current status, use:

```bash
./node-linux64 --service status
```

You can see help at any time by using:
 
```bash
./node-linux64 --help
```

## Updating

### Node Daemon

The W2W Node supports two mode of operations:

1. You don't have a daemon (`w2wd`) pre-installed, the W2W Node takes care of everything.
2. You have the daemon pre-installed and the W2W Node monitors that instance.

If you have a type 1 installation, you can use the build in updater for the daemon. Simply do: 

```bash
./node-linux64 --node update
```

The W2W Node will download and update the latest stable daemon (`w2wd`). Or if you have a fresh install and don't have the daemon yet, the W2W Node will download it and install it on the first run automatically. **Note** however, that precompiled binaries are **only available** for Windows and for Ubuntu 16.04 and 18.04 LTS. On other Linux versions, you will have to compile the daemon binaries yourself as described [here](https://github.com/w2w-coin/w2w#compiling-w2w-from-source).

### W2W Node

Updating of the W2W Node itself is similar and as easy as updating the Node daemon. Simply type:

```bash
./node-linux64 --update
```

The W2W Node will download and update itself.
