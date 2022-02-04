import { spawn } from "child_process";

// We hook to serverless offline when firing its process
const SERVER_OK = `Enter "rp" to replay the last request`;
// Serverless fires a local dynamo-db instance which is killed once the parent process is terminated
// the current serverless script checks whether a local instance is running but does not error when binding fails
// we force throwing an error so we always start from a clean slate if java.io.IOException: Failed to bind to 0.0.0.0/0.0.0.0:8007
const DYNAMO_LOCAL_ERROR_THREAD = `Exception in thread "main"`;

const setupServer = (process: any) => {
  return new Promise((resolve, reject) => {
    process.stdout.setEncoding("utf-8").on("data", (stream: any) => {
      if (stream.includes(SERVER_OK)) {
        resolve(process);
      }
    });

    process.stderr.setEncoding("utf-8").on("data", (stream: any) => {
      if (stream.includes(DYNAMO_LOCAL_ERROR_THREAD)) {
        throw new Error("Internal Java process crashed");
      }
      if (stream.includes(SERVER_OK)) {
        resolve(process);
      }
    });

    process.on("exit", (code: any, signal: any) =>
      console.info(
        `process terminated with code: ${code} and signal: ${signal}`
      )
    );
  });
};

const server = spawn("npm", ["run", "start"], {});

module.exports = async () => {
  try {
    console.log(`\nSetting up Integration tests...\n`);
    const instance = await setupServer(server);
    // @ts-ignore
    const { pid } = instance;
    console.info(`
    start script running ✅ ...
    on pid: ${pid}
    `);
  } catch (e) {
    console.error("Something wrong happened:\n");
    console.error(e);
    process.exit(1);
  }
};
