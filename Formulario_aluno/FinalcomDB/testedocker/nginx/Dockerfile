# Usa a imagem oficial do Nginx baseada no Alpine
FROM nginx:alpine

# Remove a configuração padrão para evitar conflitos
RUN rm /etc/nginx/conf.d/default.conf

# Copia o nosso arquivo de configuração customizado para o lugar correto
COPY nginx.conf /etc/nginx/conf.d/default.conf