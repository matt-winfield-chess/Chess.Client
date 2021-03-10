## BUILD
FROM node:12.2.0 as build

# Add node modules bin to path
ENV PATH node_modules/.bin:$PATH

WORKDIR /app

# Install node dependencies and angular CLI
RUN npm install -g @angular/cli@10.0.8
COPY package.json /app/package.json
RUN npm install

COPY . /app

RUN ng build --prod --source-map=false --output-path=dist

## RUN
FROM nginx:1.16.0-alpine

# Copy dist contents (compiled output) from build step
COPY --from=build /app/dist/ /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]