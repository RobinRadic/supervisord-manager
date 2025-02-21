#!/usr/bin/env bash
SERVICE=supervisord-monitor
MYDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

# link the service file into the systemd config
echo "sudo ln -s ${MYDIR}/supervisord-monitor.service /lib/systemd/system/supervisord-monitor.service"
sudo ln -s ${MYDIR}/supervisord-monitor.service /lib/systemd/system/supervisord-monitor.service

# Reload the daemon so it knows about the new file
echo "sudo systemctl daemon-reload"
sudo systemctl daemon-reload

# Enable our new service
echo "sudo systemctl enable $SERVICE"
sudo systemctl enable $SERVICE

# Start the service
echo "sudo systemctl start $SERVICE"
sudo systemctl start $SERVICE