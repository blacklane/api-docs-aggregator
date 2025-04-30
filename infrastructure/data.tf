data "aws_route53_zone" "sdlc-int-blacklane-io" {
  name         = "sdlc-int.blacklane.io."
  private_zone = true
}
