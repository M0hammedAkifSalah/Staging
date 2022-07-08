// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  isMockEnabled: true, // You have to switch this, when your real back-end is done
  authTokenKey: 'authce9d77b308c149d5992a80073637e4d5',
  //apiUrl: 'http://ec2-35-154-221-135.ap-south-1.compute.amazonaws.com:3000/', // dev url
  // apiUrl: 'http://staging.zamask.com:3000/',
  // apiUrl: 'http://dev.zamask.com:3000/',



        // Dev 
        apiUrl:'http://3.6.41.63:3000/',
        
        // Pre Prod
         //apiUrl:'http://13.232.64.32:3002/',

        // Prod
        // apiUrl:'http://13.232.64.32:3002/',

  

  // apiUrl: 'https://api.devzamask.gloryautotech.com/',
  // apiUrl:"http://192.168.29.12:4001/",
  // apiUrl: 'http://167ddbcef9d9.ngrok.io/',
  // apiUrl: 'http://localhost:3000/',
  // apiUrl : 'http://ec2-13-232-155-192.ap-south-1.compute.amazonaws.com:3000/', // live url
  awsS3AccessKey: 'AKIASF6X6BXQYUMCVFVP',
  awsS3SecretKey: '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',
  awsS3Region: 'Asia Pacific(Mumbai)',
  s3BucketUrl: 'https://grow-on.s3.ap-south-1.amazonaws.com/',

  // s3BucketUrl: 'https://grow-on-prod.s3.ap-south-1.amazonaws.com/'

  //razorpay
  rzp_key:'rzp_test_hXRlPl2sNYcFiF',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
