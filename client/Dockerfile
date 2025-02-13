FROM nginx
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# to build
# docker build --pull -t client .

# to run
# docker run -d -p 8080:8080 --name client client
