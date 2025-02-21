#!/usr/bin/env bash
SERVICE=supervisord-monitor
MYDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
sudo ln -s ${MYDIR}/supervisord-monitor.service /lib/systemd/system/supervisord-monitor.service

# Reload the daemon so it knows about the new file
sudo systemctl daemon-reload

# Enable our new service
sudo systemctl enable $SERVICE

# Start the service
sudo systemctl start $SERVICE