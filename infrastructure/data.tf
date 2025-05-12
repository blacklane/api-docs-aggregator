data "aws_route53_zone" "sdlc-int-blacklane-io" {
  name         = "sdlc-int.blacklane.io."
  private_zone = true
}

data "aws_partition" "current" {}

data "aws_region" "current" {}

data "aws_caller_identity" "current" {}
