const impor = require('./index')(__dirname);
// const os = impor<typeof import('os')>('os');
const os = impor('os') as typeof import('os');

async function main() {
  const arch = os.arch();
  console.log(arch);
}

main();