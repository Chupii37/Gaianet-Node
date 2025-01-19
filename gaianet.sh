#!/bin/bash

# Colors for output
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
MAGENTA="\033[0;35m"
CYAN="\033[0;36m"
WHITE="\033[0;37m"
RESET="\033[0m"

# Function to log messages with color
log_message() {
    printf "%b\n" "$1"
}

# Function to handle errors
handle_error() {
    local message="$1"
    log_message "${RED}ERROR: $message${RESET}"
    exit 1
}

# Function to display the logo
display_logo() {
    log_message "${GREEN}Displaying logo...${RESET}"
    wget -qO- https://raw.githubusercontent.com/Chupii37/Chupii-Node/refs/heads/main/Logo.sh | bash || handle_error "Failed to fetch the logo script."
}

# Function to retry a command a few times in case of failure
retry() {
    local n=1
    local max=5
    local delay=5
    while ((n <= max)); do
        "$@" && return 0 || {
            log_message "${YELLOW}Attempt $n of $max failed. Retrying in $delay seconds...${RESET}"
            sleep $delay
        }
        ((n++))
    done
    handle_error "Command failed after $max attempts: $*"
}

# Function to check if Docker is installed, and install it if not
check_and_install_docker() {
    log_message "${CYAN}Checking if Docker is installed...${RESET}"
    if ! command -v docker &> /dev/null; then
        log_message "${YELLOW}Docker not found. Installing Docker...${RESET}"
        retry apt-get update -y || handle_error "Failed to update apt repositories."
        retry apt-get install -y apt-transport-https ca-certificates curl software-properties-common || handle_error "Failed to install prerequisites."
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - || handle_error "Failed to add Docker GPG key."
        add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" || handle_error "Failed to add Docker repository."
        retry apt update -y || handle_error "Failed to update apt repositories."
        retry apt install -y docker-ce || handle_error "Failed to install Docker."
        systemctl start docker || handle_error "Failed to start Docker."
        systemctl enable docker || handle_error "Failed to enable Docker to start on boot."
        log_message "${GREEN}Docker installed and started.${RESET}"
    else
        log_message "${GREEN}Docker is already installed.${RESET}"
    fi
}

# Function to check if UFW is enabled
check_ufw_status() {
    sudo ufw status | grep -q "Status: active"
}

# Enable UFW if not already enabled
enable_ufw() {
    if ! check_ufw_status; then
        log_message "${MAGENTA}UFW is not enabled. Enabling UFW...${RESET}"
        sudo ufw enable || handle_error "Failed to enable UFW."
    else
        log_message "${GREEN}UFW is already enabled.${RESET}"
    fi
}

# Allow SSH port 22 and Docker port 9172
allow_ports() {
    log_message "${CYAN}Allowing ports 22 (SSH) and 9172 (Docker)...${RESET}"
    sudo ufw allow 22/tcp || handle_error "Failed to allow port 22 for SSH."
    sudo ufw allow 9172/tcp || handle_error "Failed to allow port 9172 for Docker."
}

# Deny all other incoming connections (optional, but recommended for security)
deny_other_ports() {
    log_message "${YELLOW}Setting default policies to deny all incoming traffic...${RESET}"
    sudo ufw default deny incoming || handle_error "Failed to set default deny incoming policy."
    sudo ufw default allow outgoing || handle_error "Failed to set default allow outgoing policy."
}

# Reload UFW to apply changes
reload_ufw() {
    log_message "${CYAN}Reloading UFW to apply changes...${RESET}"
    sudo ufw reload || handle_error "Failed to reload UFW."
}

# Function to configure UFW for SSH (port 22) and Docker (port 9172)
configure_ufw() {
    log_message "${MAGENTA}Configuring UFW...${RESET}"
    enable_ufw
    allow_ports
    deny_other_ports
    reload_ufw
}

# Run the Docker container with --restart unless-stopped policy
run_docker_container() {
    log_message "${GREEN}Running Docker container...${RESET}"
    docker run --name gaianet \
   -p 9172:9172 \
   -v $(pwd)/qdrant_storage:/root/gaianet/qdrant/storage:z \
   gaianet/phi-3-mini-instruct-4k_paris:latest || handle_error "Failed to start Docker container."
}

# Main script execution
log_message "${GREEN}Starting GaiaNet setup...${RESET}"

# Step 1: Display Logo
log_message "${CYAN}Step 1: Displaying logo...${RESET}"
display_logo

# Step 2: Check Installation Docker 
log_message "${CYAN}Step 2: Checking and installing Docker...${RESET}"
check_and_install_docker

# Step 3: Configure UFW
log_message "${CYAN}Step 3: Configuring UFW...${RESET}"
configure_ufw

# Step 4: Run the Docker container
log_message "${CYAN}Step 4: Running the Docker container...${RESET}"
run_docker_container

# Display final instructions to the user
log_message "${GREEN}GaiaNet setup completed successfully!${RESET}"
