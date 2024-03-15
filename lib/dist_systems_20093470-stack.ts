
import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as lambdanode from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as custom from "aws-cdk-lib/custom-resources";
import * as apig from "aws-cdk-lib/aws-apigateway";
import { generateBatch } from "../shared/util";
import { movies, movieCasts, movieReview } from "../seed/movies";

export class DistSystems20093470Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Tables 
    const moviesTable = new dynamodb.Table(this, "MoviesTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "id", type: dynamodb.AttributeType.NUMBER },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: "Movies",
    });

    const movieCastsTable = new dynamodb.Table(this, "MovieCastTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "movieId", type: dynamodb.AttributeType.NUMBER },
      sortKey: { name: "actorName", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: "MovieCast",
    });

    movieCastsTable.addLocalSecondaryIndex({
      indexName: "roleIx",
      sortKey: { name: "roleName", type: dynamodb.AttributeType.STRING },
    });

    // Define the DynamoDB table for movie reviews
const reviewsTable = new dynamodb.Table(this, "ReviewsTable", {
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  partitionKey: { name: "movieId", type: dynamodb.AttributeType.NUMBER },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  tableName: "MovieReviews", // Update with your desired table name
});


    // Functions 
    const getMovieByIdFn = new lambdanode.NodejsFunction(
      this,
      "GetMovieByIdFn",
      {
        architecture: lambda.Architecture.ARM_64,
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: `${__dirname}/../lambdas/getMovieById.ts`,
        timeout: cdk.Duration.seconds(10),
        memorySize: 128,
        environment: {
          TABLE_NAME: moviesTable.tableName,
          REGION: 'eu-west-1',
        },
      }
    );

    const getAllMoviesFn = new lambdanode.NodejsFunction(
      this,
      "GetAllMoviesFn",
      {
        architecture: lambda.Architecture.ARM_64,
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: `${__dirname}/../lambdas/getAllMovies.ts`,
        timeout: cdk.Duration.seconds(10),
        memorySize: 128,
        environment: {
          TABLE_NAME: moviesTable.tableName,
          REGION: 'eu-west-1',
        },
      }
    );

    new custom.AwsCustomResource(this, "moviesddbInitData", {
      onCreate: {
        service: "DynamoDB",
        action: "batchWriteItem",
        parameters: {
          RequestItems: {
            [moviesTable.tableName]: generateBatch(movies),
            [movieCastsTable.tableName]: generateBatch(movieCasts),
            [reviewsTable.tableName]: generateBatch(movieReview), // Include movieReview data
          },
        },
        physicalResourceId: custom.PhysicalResourceId.of("moviesddbInitData"),
      },
      policy: custom.AwsCustomResourcePolicy.fromSdkCalls({
        resources: [moviesTable.tableArn, movieCastsTable.tableArn, reviewsTable.tableArn], // Add reviewsTable
      }),
    });

    const newMovieFn = new lambdanode.NodejsFunction(this, "AddMovieFn", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: `${__dirname}/../lambdas/addMovie.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: {
        TABLE_NAME: moviesTable.tableName,
        REGION: "eu-west-1",
      },
    });

    const getMovieCastMembersFn = new lambdanode.NodejsFunction(
      this,
      "GetCastMemberFn",
      {
        architecture: lambda.Architecture.ARM_64,
        runtime: lambda.Runtime.NODEJS_16_X,
        entry: `${__dirname}/../lambdas/getMovieCastMember.ts`,
        timeout: cdk.Duration.seconds(10),
        memorySize: 128,
        environment: {
          TABLE_NAME: movieCastsTable.tableName,
          REGION: "eu-west-1",
        },
      }
    );

    // Define the lambda function to retrieve movie reviews
    const getMovieReviewsFn = new lambdanode.NodejsFunction(this, "GetMovieReviewsFn", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: `${__dirname}/../lambdas/getMovieReviews.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: {
        REVIEWS_TABLE_NAME: reviewsTable.tableName,
        REGION: "eu-west-1",
      },
    });

    // NEW Lambda function for adding movie reviews
const addMovieReviewFn = new lambdanode.NodejsFunction(
  this,
  "AddMovieReviewFn",
  {
    architecture: lambda.Architecture.ARM_64,
    runtime: lambda.Runtime.NODEJS_16_X,
    entry: `${__dirname}/../lambdas/addMovieReview.ts`, // Update with your path to the Lambda function code
    timeout: cdk.Duration.seconds(10),
    memorySize: 128,
    environment: {
      TABLE_NAME: reviewsTable.tableName,
      REGION: "eu-west-1",
    },
  }
);

// Inside the DistSystems20093470Stack class constructor
const getReviewByRatingFn = new lambdanode.NodejsFunction(
  this,
  "GetReviewByRatingFn",
  {
    architecture: lambda.Architecture.ARM_64,
    runtime: lambda.Runtime.NODEJS_16_X,
    entry: `${__dirname}/../lambdas/getReviewByRating.ts`,
    timeout: cdk.Duration.seconds(10),
    memorySize: 128,
    environment: {
      REVIEWS_TABLE_NAME: reviewsTable.tableName,
      REGION: "eu-west-1",
    },
  }
);

   // NEW Lambda function for getting reviews by reviewerName
   const getReviewsByReviewerNameFn = new lambdanode.NodejsFunction(
    this,
    "GetReviewsByReviewerNameFn",
    {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: `${__dirname}/../lambdas/getReviewsByReviewerName.ts`, // Update with your path to the Lambda function code
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: {
        REVIEWS_TABLE_NAME: reviewsTable.tableName,
        REGION: "eu-west-1",
      },
    }
  );

    // Permissions 
    moviesTable.grantReadData(getMovieByIdFn)
    moviesTable.grantReadData(getAllMoviesFn)
    moviesTable.grantReadWriteData(newMovieFn)
    movieCastsTable.grantReadData(getMovieCastMembersFn);
    reviewsTable.grantReadData(getMovieReviewsFn);
    reviewsTable.grantWriteData(addMovieReviewFn);
    reviewsTable.grantReadData(getReviewByRatingFn);
    reviewsTable.grantReadData(getReviewsByReviewerNameFn);

    const api = new apig.RestApi(this, "RestAPI", {
      description: "demo api",
      deployOptions: {
        stageName: "dev",
      },
      defaultCorsPreflightOptions: {
        allowHeaders: ["Content-Type", "X-Amz-Date"],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: ["*"],
      },
    });

    const moviesEndpoint = api.root.addResource("movies");
    moviesEndpoint.addMethod(
      "GET",
      new apig.LambdaIntegration(getAllMoviesFn, { proxy: true })
    );

    const movieEndpoint = moviesEndpoint.addResource("{movieId}");
    movieEndpoint.addMethod(
      "GET",
      new apig.LambdaIntegration(getMovieByIdFn, { proxy: true })
    );
    moviesEndpoint.addMethod(
      "POST",
      new apig.LambdaIntegration(newMovieFn, { proxy: true })
    );

    const movieCastEndpoint = moviesEndpoint.addResource("cast");
    movieCastEndpoint.addMethod(
      "GET",
      new apig.LambdaIntegration(getMovieCastMembersFn, { proxy: true })
    );

    // Define API Gateway endpoint for movie reviews
    const movieReviewsEndpoint = api.root.addResource("reviews");
    movieReviewsEndpoint.addMethod(
      "GET",
      new apig.LambdaIntegration(getMovieReviewsFn, { proxy: true })
    );

    // NEW POST method for adding movie reviews
    movieReviewsEndpoint.addMethod(
      "POST",
      new apig.LambdaIntegration(addMovieReviewFn, { proxy: true })
    );

    // Define API Gateway endpoint for getting reviews by minimum rating
const reviewsByRatingEndpoint = api.root.addResource("reviewsByRating");
reviewsByRatingEndpoint.addMethod(
  "GET",
  new apig.LambdaIntegration(getReviewByRatingFn, { proxy: true })
);

 // NEW API Gateway endpoint for getting reviews by reviewerName
 const reviewsByReviewerNameEndpoint = api.root.addResource("reviewsByReviewerName");
 reviewsByReviewerNameEndpoint.addMethod(
   "GET",
   new apig.LambdaIntegration(getReviewsByReviewerNameFn, { proxy: true })
 );
  }
}

//minRating
