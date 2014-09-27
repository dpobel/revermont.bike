#! /bin/sh

[ $? -ne 0 ] && exit 2

SSH_CMD="ssh -i ssh/id_dsa -o 'StrictHostKeyChecking no'"

if [ "$TRAVIS_PULL_REQUEST" = "false" ] ; then
    rsync -avcz -e "$SSH_CMD" web/ rb@vtt.revermont.bike:~/web/
else
    rsync -avcz -e "$SSH_CMD" web/ rb@vtt.revermont.bike:~/testing/${TRAVIS_PULL_REQUEST}.vtt.revermont.bike
fi
