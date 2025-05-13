resource "aws_route53_record" "frontend_alias" {
  zone_id = data.aws_route53_zone.sdlc-int-blacklane-io.id
  name    = "api-docs"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.frontend.domain_name
    zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id
    evaluate_target_health = false
  }
}
