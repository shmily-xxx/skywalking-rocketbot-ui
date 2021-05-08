FROM nginx

MAINTAINER maxiaobin "maxiaobin001@chinasoftinc.com"

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone

COPY dist/  /usr/share/nginx/html/

#删除nginx 默认配置
RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf
#添加自己的配置 default.conf 在下面
ADD nginx.conf /etc/nginx/
ADD default.conf /etc/nginx/conf.d/

EXPOSE 443 80

CMD ["/bin/bash", "-c", "sed -i \"s@<html@<html deploy=\"$APP_DEPLOY_TYPE\" encrypt=\"$APP_ENCRYPT_TYPE\"@\" /usr/share/nginx/html/index.html; nginx -g \"daemon off;\""]
