# base image
FROM nginx:1.16.0-alpine

# Copy dist contents
COPY dist/ChessClient /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]