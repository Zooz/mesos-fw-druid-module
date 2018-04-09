#/bin/sh

gtar -cvf druid-0.1.tar.gz --transform='s,^.,./druid-module,' --show-transformed-names --exclude-vcs --exclude-vcs-ignores --exclude=tests --exclude=`basename $0` .
