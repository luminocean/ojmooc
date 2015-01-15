#vagrant初始化脚本
sudo apt-get install -y git
sudo git clone -b paper http://git.iyopu.com:10080/datouxia/ojmooc.git \
    && sudo mv ojmooc /home && cd /home/ojmooc/site/ojrunner/script \
    && sudo ./setup.sh && sudo ./run_env.sh