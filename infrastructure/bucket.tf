resource "aws_s3_bucket" "api-doc" {
  bucket = "api-docs.sdlc-int.blacklane.io"
}

resource "aws_s3_bucket_versioning" "api-doc" {
  bucket = aws_s3_bucket.api-doc.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_website_configuration" "api-doc" {
  bucket = aws_s3_bucket.api-doc.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }
}

resource "aws_s3_bucket_ownership_controls" "api-doc" {
  bucket = aws_s3_bucket.api-doc.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_policy" "api-doc" {
  bucket = aws_s3_bucket.api-doc.id
  policy = templatefile("${path.module}/s3-policy.json.tpl", {
    bucket_name     = aws_s3_bucket.api-doc.bucket
    distribution_id = aws_cloudfront_distribution.frontend.id
    account_id      = data.aws_caller_identity.current.account_id
  })
}

resource "aws_s3_bucket_public_access_block" "api-doc" {
  bucket = aws_s3_bucket.api-doc.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "api-doc" {
  depends_on = [
    aws_s3_bucket_ownership_controls.api-doc,
    aws_s3_bucket_public_access_block.api-doc,
  ]

  bucket = aws_s3_bucket.api-doc.id
  acl    = "public-read"
}
