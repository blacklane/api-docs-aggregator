{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowAccessOnlyFromCloudFrontWithCustomHeader",
            "Effect": "Deny",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${bucket_name}/*",
            "Condition": {
                "StringNotEquals": {
                    "aws:Referer": ""
                }
            }
        },
        {
            "Sid": "AllowCloudFrontAccess",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${bucket_name}/*"
        }
    ]
}
