const { spawn } = require('child_process');
const http = require('http');
const httpProxy = require('http-proxy');

const port = 4000;
let basePort = 3010;

const services = [
  {
    route: '/orgs/*',
    path: './users',
    port: basePort++,
    lambdaPort: basePort++,
  },
  {
    route: '/auth/*',
    path: './auth',
    port: basePort++,
    lambdaPort: basePort++,
  },
  {
    route: '/assets/*',
    path: './assets',
    port: basePort++,
    lambdaPort: basePort++,
  },
];

services.forEach((service) => {
  console.log('Starting service:', service);
  const child = spawn('serverless', ['offline', 'start', '--noPrependStageInUrl', '--httpPort', service.port, '--lambdaPort', service.lambdaPort], { cwd: service.path, shell: process.platform === 'win32' });
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (chunk) => console.log(chunk.toString('utf8')));
  child.stderr.on('data', (chunk) => console.log(chunk.toString('utf8')));
  child.on('close', (code) => console.log(`child for ${service.route} exited with code ${code}`));
});

const proxy = httpProxy.createProxyServer({});
const server = http.createServer((req, res) => {
  const service = services.find((per) => urlMatchRoute(req.url, per.route));
  console.log('Calling:', service);
  if (service) {
    // Case 1: matching service FOUND => forward request to the service
    proxy.web(req, res, { target: `http://localhost:${service.port}` });
  } else {
    // Case 2: matching service NOT found => display available routes
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(`Url path "${req.url}" does not match routes defined in services\n\n`);
    res.write(`Available routes are:\n`);
    services.map((service) => res.write(`- ${service.route}\n`));
    res.end();
  }
});

try {
  server.listen(port);
  console.log(`Send your requests to http://localhost:${port}`);
  console.log('Please wait for all serverless offline commands to complete...');
} catch (error) {
  console.error(error);
}

// Check match route
// - ie. url is '/notes/123'
// - ie. route is '/notes/*'
function urlMatchRoute(url, route) {
  const urlParts = url.split('/');
  const routeParts = route.split('/');
  for (let i = 0, l = routeParts.length; i < l; i++) {
    const urlPart = urlParts[i];
    const routePart = routeParts[i];

    // Case 1: If either part is undefined => not match
    if (urlPart === undefined || routePart === undefined) {
      return false;
    }

    // Case 2: If route part is match all => match
    if (routePart === '*') {
      return true;
    }

    // Case 3: Exact match => keep checking
    if (urlPart === routePart) {
      continue;
    }

    // Case 4: route part is variable => keep checking
    if (routePart.startsWith('{')) {
      continue;
    }

    return false;
  }

  console.log('Return true');
  return true;
}
