resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "api-docs"
  description                       = "Origin access control for S3"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  default_root_object = "index.html"

  aliases = ["api-docs.sdlc.blacklane.io"]

  origin {
    domain_name = aws_s3_bucket.api-doc.website_endpoint
    origin_id   = "api-docs"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2", "TLSv1.1"]
    }

  }

  default_cache_behavior {
    target_origin_id       = "api-docs"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD"]

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  viewer_certificate {
    acm_certificate_arn      = data.aws_acm_certificate.cert.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  lifecycle {
    ignore_changes = all
  }
  web_acl_id = aws_wafv2_web_acl.ip_restrict_acl.arn
}

