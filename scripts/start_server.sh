source /home/ec2-user/.bash_profile
cd /home/ec2-user/passenger-portal/
rm -rf node_modules
yarn
npm run build --production
service nginx start 
