# Use nginx alpine for a lightweight web server
FROM nginx:alpine

# Copy all static files to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/

# Copy README for reference (optional)
COPY README.md /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Nginx will start automatically with the default CMD
