To build the iso you need archiso 58-2 and custom packages repository
```
sudo downgrade archiso
git clone https://git.bisotuntech.com/mahor1221/repo.git ${HOME}/Desktop`
```

Set the cloned custom repository full path in pacman.conf, e.g.:
```
[custom]
SigLevel = Optional TrustAll
Server = file:///home/mahor/Desktop/repo
```

Build an ISO which you can then burn to CD or USB by running:
```
sudo mkarchiso -v -w ${HOME}/Desktop/archiso-tmp -o ${HOME}/Desktop ${HOME}/Desktop/archiso
```

Tip: If memory allows, it is preferred to place the working directory on tmpfs:
```
sudo mkarchiso -v -w /tmp/archiso-tmp -o ${HOME}/Desktop ${HOME}/Desktop/archiso
```

To rebuild the iso first remove the working direcotey:
```
sudo rm -r ${HOME}/Desktop/archiso-tmp
sudo rm -r /tmp/archiso-tmp
```
