# --- Giai đoạn 1: Build Angular app ---
FROM node:20-alpine AS build

# Tạo thư mục làm việc trong container
WORKDIR /client

# Copy file package trước để cài dependencies
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ project vào container
COPY . .

# Build Angular app ở chế độ production
RUN npm run build --prod


# --- Giai đoạn 2: Chạy app với Nginx ---
FROM nginx:alpine

# Copy file build từ giai đoạn 1 sang thư mục Nginx public
COPY --from=build /client/dist/uiweb /usr/share/nginx/html

# Expose cổng 80 để truy cập
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
