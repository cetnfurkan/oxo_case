# Temel imaj olarak Node.js 16 kullan
FROM node:18-alpine

# Uygulama dizinini oluştur
WORKDIR /usr/src/app

# Paketleri ve uygulama kodunu kopyala
COPY package*.json ./
COPY . .

# Gerekli paketleri yükle
RUN npm install

# Uygulama için ortam değişkenlerini ayarla
ENV PORT=3010

# Uygulamayı başlat
CMD ["npm", "start"]

# Uygulamanın dinleyeceği portu belirt
EXPOSE 3010
