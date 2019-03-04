import impor = require('./index');
// const os = impor<typeof import('os')>('os');
const os = impor('os') as typeof import;('os');

async function main() {
  const arch = os.arch();
  console.log(arch);
}

main();