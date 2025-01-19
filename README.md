# Gaianet Node Run With Docker

## System requirements
Your server have at least 16GB of RAM (32GB or more recommended)

## Installation
1. Check Sytem Update & Upgrade
    ```bash
    sudo apt update
    ```

    ```bash
    sudo apt upgrade
    ```

2. Install Screen 
    ```bash
    sudo apt install screen
    ```

3. Install Nodejs 
    ```bash
    sudo apt install nodejs
    ```

    ```bash
    sudo apt install npm
    ```

4. Install Git 
    ```bash
    sudo apt install git
    ```

5. Clean up unnecessary packages
    ```bash
    sudo apt autoremove
    ```

If you think you have installed all the above needs, you can skip the steps.

- Follow the steps below to run the node: 
    ```bash
    screen -S gaianet
    ```

    ```bash
    git clone https://github.com/Chupii37/Gaianet-Node.git
    ```
    
    ```bash
    cd Gaianet-Node
    ```

    ```bash
    chmod +x gaianet.sh
    ```

    ```bash
    ./gaianet.sh
    ```

![Alt text](https://github.com/Chupii37/Gaianet-Node/blob/main/image.png)

- Once you will see like this, Ctrl + A, then press D

- Now use this below command to get node-info
    ```bash
    docker exec -it gaianet /root/gaianet/bin/gaianet info
    ```

- Copy Node ID and Device ID

- Visit [Gaianet Site](https://www.gaianet.ai/setting/nodes) and then connect your wallet

- Now click on connect new node, here enter your Node ID and Device ID and then click on Join button

- After that return to the terminal, Follow the steps below to run auto chat: 
    ```bash
    screen -S chat
    ```

    ```bash
    cd Gaianet-Node
    ```

    ```bash
    npm i
    ```

    ```bash
    node chat.js
    ```

It will ask to enter the node id, just enter the previously obtained node id

## Backup nodeid.json
Use the below command to backup your nodeid.json:
  ```bash
  docker exec -it gaianet cat /root/gaianet/nodeid.json
  ```

## After End Of Project
Remove Screen
 ```bash
 screen -X -S gaianet quit
 ```

 ```bash
 screen -X -S chat quit
 ```

Stop Docker Container
 ```bash
 docker stop  gaianet
 ```

Remove Docker Container
 ```bash
 docker rm  gaianet
 ```

Remove Docker Image
 ```bash
 docker rmi gaianet/phi-3-mini-instruct-4k_paris:latest
 ```

Remove Folder
 ```bash
 rm -rf /root/Gaianet-Node
 ```

## Want to See More Cool Projects?

Buy me a coffee so I can stay awake and make more cool stuff (and less bugs)! I’ll be forever grateful and a little bit jittery. 😆☕ 

[Buy me a coffee](https://paypal.me/chupii37 )
