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
- Open website - `localhost:3005`.

## Troubleshooting

### **Links contain query params with 'X-' information:**

<details>
<summary>Main problem</summary>
Some object storages support only temp links and don't provide a live link to files. I faced this problem when trying to connect StorJ storage and resolved this problem by just writing the file id to Redis and regenerating it when key time expires.

Unfortunate, it's terrible, I removed this feature with Redis and recommend you choose another object storage service.

</details>

### **CORS error:** You can't download your uploaded file and see in the console CORS error. Some buckets require edit CORS privacy to direct download files.

<details>
<summary>Fix for Scaleway</summary>
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

## Production

You also can use or test this code, just visit the [MyStorage website](https://storage.lwjerri.ml/)

Username & password - **test**

## Features

1. Simple auth system, support multi accounts.
2. Accont & display uploads manage panel.
3. Upload, search and deleting files.
4. Add, remove, edit tags for uploaded files.
5. Change column type for uploaded files.
6. ...other features will be added soon.

## Localization

MyStorage has localization support. Actual list with available languages at this moment:

- **English**
- **Ukrainian**
- **Russian**

Anyone can open a pull request and suggest new translating or fix already exists localizations.

## Screenshots

![Photo #1](https://i.imgur.com/dtmQFqL.png)
![Photo #2](https://i.imgur.com/qn4nRio.png)
![Photo #3](https://i.imgur.com/mYZELG9.png)
![Photo #4](https://i.imgur.com/Mldqe7i.png)
![Photo #5](https://i.imgur.com/ZNlKg6E.png)
![Photo #6](https://i.imgur.com/oIbnjgS.png)
![Photo #7](https://i.imgur.com/48WFiD5.png)
![Photo #8](https://i.imgur.com/QrKsxhz.png)

## Contributing

This project opened for contribution and any suggestions! You can create a new `Issue` or make an `Pull request` with your code changes.

## LICENSE

This code has **MIT** license. See the `LICENSE` file for getting more information.
