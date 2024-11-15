#!/usr/bin/env sh

# Safety checks
set -eu

# Path to simplex-chat binary
simplex_chat_bin='/usr/local/bin/simplex-chat'
# Path to simplex-chat database (required)
db="$HOME/simplex/check_server"

# Various checks
checks() {
  # Check if simplex-chat binary dorsnt exist and prompt user to download it
  if [ ! -e "$simplex_chat_bin" ]; then
    printf 'Please download the simplex-chat CLI binary:\ncurl -L '"'"'https://github.com/simplex-chat/simplex-chat/releases/latest/download/simplex-chat-ubuntu-22_04-x86-64'"'"' -o %s && chmod +x %s\n' "$simplex_chat_bin" "$simplex_chat_bin" 
    exit 1
  fi

  # Check if database doesn't exist and prompt user to create it
  if [ ! -e "${db}_chat.db" ] && [ ! -e "${db}_agent.db" ]; then
    printf 'Please create the database with the following command: %s -d %s\n' "$simplex_chat_bin" "$db"
    exit 1
  fi

  # Check if first argument exist and is valid
  case "$1" in
    smp://*=@*|xftp://*=@*) serv="$1"; shift 1 ;;
    '') printf 'server is missing. Please include the server URL as the first argument.\n'; exit 1 ;;
    *) printf 'server is incorrect. Please check the server URL.\n'; exit 1 ;;
  esac
}

# Server checking logic
sx_check_server() {
  # Capture the start time
  start=$(date +%s.%N)

  # Execute simplex-chat binary, specifying the database and query. Then grep the response
  if $simplex_chat_bin --tcp-timeout 8 -t 0 -d "$db" -e "/_server test 1 $1" | grep -q "passed"; then
    # If it's "passed" message, calculate the latency
    end=$(date +%s.%N)
    time=$(printf "%s %s" "$end" "$start" | awk '{printf "%f", $1 - $2}')
  else
    # If response doesn't contain "passed", consider server as dead
    time=0
  fi

  # Finally, print the message and exit with the appropriate code
  # Message consist of: status latency
  if [ "$time" != '0' ]; then
    printf 'pass %s\n' "$time"
    exit 0
  else
    printf 'nopass 0\n'
    exit 1
  fi
}

# The main functions that executes everything
main() {
  # Temporarily disable safe check, we're checking the first argument ourselvs
  set +u
  checks "$1"
  set -u

  sx_check_server "$serv"
}

# Execute the main function, providing all input arguments
main "$@"
