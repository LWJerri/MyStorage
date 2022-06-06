# Bucket CORS

## Set CORS

- Create `cors.json` file with CORS rules.
- Apply `cors.json` to S3 bucket `aws s3api put-bucket-cors --bucket=BUCKETNAME --cors-configuration=file://cors.json --endpoint-url=https://BUCKETNAME.s3.nl-ams.scw.cloud`

## CORS JSON

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

## LICENSE

This code has **MIT** license. See the `LICENSE` file for getting more information.
