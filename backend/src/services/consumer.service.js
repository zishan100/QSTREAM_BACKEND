require("dotenv").config();

const {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = require("@aws-sdk/client-sqs");
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");

const {
  REGION,
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
  QUEUE_URL,
  PROD_BUCKET_NAME,
  CLUSTER,
  TASK_DEFINATION,
  LAUNCH_TYPE,
  SUBNET_GROUP,
  SECURITY_GROUP,
  CONTAINER_NAME,
  NODE_ENVIRONMENT,
} = process.env;

const sqsClient = new SQSClient({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

const ecsClient = new ECSClient({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

async function init() {
  let params = {
    QueueUrl: QUEUE_URL,
    WaitTimeSeconds: 20,
    MaxNumberOfMessages: 1,
  };

  try {
    const command = new ReceiveMessageCommand(params);

    while (true) {
      const { Messages } = await sqsClient.send(command);

      if (!Messages) {
        if (NODE_ENVIRONMENT === "development") {
          console.log("No msg in queue");
        }
        continue;
      }

      for (const message of Messages) {
        const { Body, MessageId, ReceiptHandle } = message;

        if (!Body) continue;

        const events = JSON.parse(Body);

        if ("Service" in events && "Event" in events) {
          if (events.Event === "s3:TestEvent") continue;
        }

        for (const record of events.Records) {
          const {
            s3: { bucket, object },
          } = record;

          if (NODE_ENVIRONMENT === "development") {
            console.log(bucket, "  ", object);
          }

          /* Spin the docker when sqs msg received */
          const runTaskCommand = new RunTaskCommand({
            cluster: CLUSTER,
            taskDefinition: TASK_DEFINATION,
            launchType: LAUNCH_TYPE,
            networkConfiguration: {
              awsvpcConfiguration: {
                subnets: [...SUBNET_GROUP.split(",")],
                securityGroups: [SECURITY_GROUP],
                assignPublicIp: "ENABLED",
              },
            },
            overrides: {
              containerOverrides: [
                {
                  name: CONTAINER_NAME,
                  environment: [
                    { name: "BUCKET_NAME", value: bucket.name },
                    { name: "KEY", value: object.key },
                    { name: "PROD_BUCKET_NAME", value: PROD_BUCKET_NAME },
                    { name: "ACCESS_KEY_ID", value: ACCESS_KEY_ID },
                    { name: "SECRET_ACCESS_KEY", value: SECRET_ACCESS_KEY },
                    { name: "REGION", value: REGION },
                  ],
                },
              ],
            },
          });

          await ecsClient.send(runTaskCommand);

          /* Delete message queue from sqs services */
          const delCommand = new DeleteMessageCommand({
            QueueUrl: QUEUE_URL,
            ReceiptHandle: ReceiptHandle,
          });

          await sqsClient.send(delCommand);
        }
      }
    }
  } catch (err) {
    console.log("Error occured  :", err);
  }
}

module.exports = {
  init,
};
