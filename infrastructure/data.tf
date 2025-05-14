data "aws_route53_zone" "sdlc-blacklane-io" {
  provider = aws.us-east-1
  name     = "sdlc.blacklane.io."
}

data "aws_partition" "current" {}

data "aws_region" "current" {}

data "aws_caller_identity" "current" {}

data "aws_acm_certificate" "cert" {
  domain = "*.sdlc.blacklane.io"
}
