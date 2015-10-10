FROM node

# to properly install node-gyp package
ENV USER root

# so that npm installs not into the code path, so we can share this directory
# and still have npm_modules not shared
RUN mkdir -p /install/
# so that executable from modules are added to the path
ENV PATH /install/node_modules/.bin:$PATH
# so that you can require('..') a global module
ENV NODE_PATH /install/node_modules/

COPY ./package.json /install/package.json
RUN cd install; npm install
# # so that it installs global modules into /install/lib/node_modules
# ENV NPM_CONFIG_PREFIX=/install/
# # so that it install in global location by default
# ENV NPM_CONFIG_GLOBAL=true


WORKDIR /src/
COPY . /src/

CMD npm run test:watch
