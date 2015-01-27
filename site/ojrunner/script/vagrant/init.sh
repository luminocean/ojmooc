#vagrant's init script
#install git
sudo apt-get install -y git
#download ojmooc project and install related software and environments
sudo git clone -b paper http://git.iyopu.com:10080/datouxia/ojmooc.git \
    && sudo mv ojmooc /home \
    && cd /home/ojmooc/site \
    && npm install ./ojrunner \
    && npm install ./hawatcher \
    && cd ./ojrunner/script \
    && sudo ./setup.sh \
    && sudo ./run_env.sh
