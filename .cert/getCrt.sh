#!/usr/bin/env bash


curl --insecure --remote-name https://curl.se/ca/cacert.pem
curl -k --remote-name \
"https://nexus.roqs.basf.net/repository/cdn/ca/{BASFRootCA21,BASFSUBCA23,BASF_ROOT_CA_2,BASF_SUB_CA_5,BASF_Sub_CA_2,BASF_internal_only_ca_bundle}.crt"
for x in *.crt; do cat $x >> cacert.pem; done;
rm *.crt

echo
echo
echo
echo
echo "Remember to set: NODE_EXTRA_CA_CERTS=./.cert/cacert.pem"
