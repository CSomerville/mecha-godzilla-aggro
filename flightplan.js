'use strict';

const plan = require('flightplan');

plan.target('selenium-master', {
  host: 'selenium-master.intranet.1stdibs.com',
  username: 'root',
  privateKey: '/var/lib/jenkins/.ssh/id_rsa'
});

function pm2Stop(remote) {
  remote.exec('pm2 list; pm2 stop all');
}

function pm2Start(remote) {
  remote.exec('pm2 startOrGracefulReload /etc/pm2/mecha-aggro.json');
}

function fetch(remote) {
  remote.exec('cd /opt/aggro; git pull --rebase origin master');
}

function deploy(remote) {
  remote.exec('cd /opt/aggro; npm run cleaninstall; gulp build;');
  pm2Start(remote);
}

plan.remote('initFolder', function (remote) {
  remote.exec('git clone git@github.com:CSomerville/mecha-godzilla-aggro.git /opt/aggro');
});

//Fetches new updates to the repository,
// and runs the deploy command for the server
plan.remote('deploy', function (remote) {
  fetch(remote);
  deploy(remote);
});

plan.remote('clearFolder', function (remote) {
  remote.exec('rm -rf /opt/aggro/*');
});

//Stop the old process for the aggro reporter
plan.remote('pm2Stop', function (remote) {
  pm2Stop(remote);
});

//Restart the old aggro reporter
plan.remote('pm2Start', function (remote) {
  pm2Start(remote);
});
