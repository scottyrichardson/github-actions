const core = require("@actions/core");
const { exec } = require("@actions/exec");
const {
  ECRClient,
  GetAuthorizationTokenCommand,
} = require("@aws-sdk/client-ecr");

async function run() {
  try {
    const credentials = {
      accessKeyId: core.getInput("aws-access-key-id"),
      secretAccessKey: core.getInput("aws-secret-access-key"),
    };
    const region = core.getInput("aws-region");
    const ecrClient = new ECRClient({ credentials, region });

    const authCommand = new GetAuthorizationTokenCommand({});
    const authData = await ecrClient.send(authCommand);
    const [username, password] = Buffer.from(
      authData.authorizationData[0].authorizationToken,
      "base64"
    )
      .toString()
      .split(":");
    const registry = authData.authorizationData[0].proxyEndpoint.replace(
      "https://",
      ""
    );

    // Docker login using stdin
    await exec(
      "docker",
      ["login", "-u", username, "--password-stdin", registry],
      {
        input: Buffer.from(password),
        silent: true,
      }
    );

    const repository = core.getInput("repository", { required: true });
    const tags = core.getInput("tags", { required: true }).split(",");
    const dockerfilePath = core.getInput("dockerfile-path") || ".";
    const buildArgs = core.getInput("build-args");

    const buildArgsArray = [];
    if (buildArgs) {
      buildArgs.split(",").forEach((arg) => {
        buildArgsArray.push("--build-arg", arg.trim());
      });
    }

    const tagArgs = tags
      .map((tag) => ["-t", `${registry}/${repository}:${tag.trim()}`])
      .flat();

    core.startGroup("Building Docker image");
    await exec("docker", [
      "build",
      ...buildArgsArray,
      ...tagArgs,
      dockerfilePath,
    ]);
    core.endGroup();

    core.startGroup("Pushing Docker image");
    for (const tag of tags) {
      const imageTag = `${registry}/${repository}:${tag.trim()}`;
      core.info(`Pushing ${imageTag}`);
      await exec("docker", ["push", imageTag]);
    }
    core.endGroup();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
