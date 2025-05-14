{
  "Version": "2008-10-17",
  "Statement": [
    {
      "Sid": "Restrict access to the office IPs",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::${bucket_name}",
        "arn:aws:s3:::${bucket_name}/*"
      ],
      "Condition": {
        "IpAddress": {
          "aws:SourceIp": [
            "46.189.27.100/32",
            "93.241.23.242/32",
            "87.128.42.122/32"
          ]
        }
      }
    },
    {
      "Sid": "AllowCloudFrontOACAccess",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${bucket_name}/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::${account_id}:distribution/${distribution_id}"
        }
      }
    }
  ]
}
