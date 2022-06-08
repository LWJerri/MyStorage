# Description

**_MyStorage_** - is a very useful application for hosting and easy to manage your files in S3 buckets. You can upload, delete or search your files just using the interface application.

## Installation

### Requirements

- Pnpm installed (`npm i pnpm -g`).
- Node.js >= v16 (Not tested in older versions, but maybe it's work).
- PostgreSQL database.
- Any S3 hosting [See free S3 list](https://free-for.dev/#/?id=iaas).

### Installing

- Clone this repository: `git clone https://github.com/LWJerri/MyStorage.git`.
- Install Node.js requirements `pnpm install`.
- Rename `.env.example` in `apps/backend` folder to `.env`.
- Setup your `.env` file.
- Build production code `pnpm -r build`.
- Run builded code, just type `pnpm start`.

OR

- Use `Dockerfile`.

## Troubleshooting

**CORS error:** You can't download your uploaded file and see in the console CORS error. Some buckets require edit CORS privacy to direct download files.

<details>
<summary>SCALEWAY FIX</summary>
<br>
Setup AWS CLI & cors.json:

1. Create `cors.json` file with CORS rules on desktop.

2. Install AWS CLI <a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html">click</a>.

3. Setup your AWS-CLI: `aws configure`.

4. Apply `cors.json` to your S3 bucket `aws s3api put-bucket-cors --bucket=BUCKETNAME --cors-configuration=file://cors.json --endpoint-url=S3_BUCKET_URL`

`CORS JSON`

```json
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "HEAD", "POST", "PUT", "DELETE"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["Etag"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

</details>

## Contributing

This project opened for contribution and any suggestions! You can create a new `Issue` or make an `Pull request` with your code changes.

## LICENSE

This code has **MIT** license. See the `LICENSE` file for getting more information.
