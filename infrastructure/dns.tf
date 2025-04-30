resource "aws_route53_record" "api-doc" {
  zone_id = data.aws_route53_zone.sdlc-int-blacklane-io.zone_id
  name    = aws_s3_bucket.api-doc.id
  type    = "A"
  alias {
    name                   = aws_s3_bucket_website_configuration.api-doc.website_domain
    zone_id                = aws_s3_bucket.api-doc.hosted_zone_id
    evaluate_target_health = true
  }
}
