FROM ubuntu

# install apache and modules we need
RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive \
    apt-get -y install \
               apache2 \
               python3 python3-pip \
               libapache2-mod-wsgi-py3

# make base folder
RUN mkdir /app

# install deps
ADD requirements.txt /app
RUN pip install -r /app/requirements.txt

# add code
ADD *.py /app/
ADD *.wsgi /app/

# add the GUI files needed
ADD frontend/build /app/static

# copy in apache conf
COPY conf.d/000-default.conf /etc/apache2/sites-available/000-default.conf

# expose HTTP port
EXPOSE 5000

# run apache in the foreground
CMD /usr/sbin/apache2ctl -D FOREGROUND