DIST_BINARY="dist"
TAR_BINARY="rabbit-frontend.tar.gz"
VERSION=1.0.0
BUILD=`date +%FT%T%z`

all: rabbit-frontend

rabbit-frontend:
	npm run build && tar -czvf ${TAR_BINARY} ${DIST_BINARY}

clean:
	@if [ -d ${DIST_BINARY} ] ; then rm -r ${DIST_BINARY} ; fi; \
	if [ -f ${TAR_BINARY} ] ; then rm ${TAR_BINARY} ; fi

.PHONY: default clean rabbit-frontend
