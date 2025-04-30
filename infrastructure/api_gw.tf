resource "aws_api_gateway_rest_api" "github-proxy-api" {
  name        = aws_lambda_function.github-proxy.function_name
  description = "API that call Lambda function GithubProxy "
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_method" "method" {
  rest_api_id   = aws_api_gateway_rest_api.github-proxy-api.id
  resource_id   = aws_api_gateway_rest_api.github-proxy-api.root_resource_id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "method-options" {
  rest_api_id   = aws_api_gateway_rest_api.github-proxy-api.id
  resource_id   = aws_api_gateway_rest_api.github-proxy-api.root_resource_id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda-integration" {
  rest_api_id             = aws_api_gateway_rest_api.github-proxy-api.id
  resource_id             = aws_api_gateway_rest_api.github-proxy-api.root_resource_id
  http_method             = aws_api_gateway_method.method.http_method
  integration_http_method = "POST"
  uri                     = aws_lambda_function.github-proxy.invoke_arn
  type                    = "AWS_PROXY"
}

resource "aws_api_gateway_integration" "lambda-integration-mock" {
  rest_api_id          = aws_api_gateway_rest_api.github-proxy-api.id
  resource_id          = aws_api_gateway_rest_api.github-proxy-api.root_resource_id
  http_method          = aws_api_gateway_method.method-options.http_method
  type                 = "MOCK"

  request_templates = {
    "application/json" = file("${path.module}/params_api_gw.json")
  }
}

resource "aws_api_gateway_deployment" "api_deployment" {
  depends_on = [
    aws_api_gateway_integration.lambda-integration,
    aws_api_gateway_integration.lambda-integration-mock
  ]
  rest_api_id = aws_api_gateway_rest_api.github-proxy-api.id
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "api_stage" {
  stage_name    = "prod"
  rest_api_id   = aws_api_gateway_rest_api.github-proxy-api.id
  deployment_id = aws_api_gateway_deployment.api_deployment.id
}

data "aws_iam_policy_document" "gw-policy-document" {
  statement {
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions   = ["execute-api:Invoke"]
    resources = ["${aws_api_gateway_rest_api.github-proxy-api.execution_arn}/*"]

    condition {
      test     = "IpAddress"
      variable = "aws:SourceIp"
      values   = ["46.189.27.100/32", "93.241.23.242/32", "87.128.42.122/32"]
    }
  }
}

resource "aws_api_gateway_rest_api_policy" "gw-policy" {
  rest_api_id = aws_api_gateway_rest_api.github-proxy-api.id
  policy      = data.aws_iam_policy_document.gw-policy-document.json
}

resource "aws_api_gateway_method_response" "options_response_200" {
  rest_api_id = aws_api_gateway_rest_api.github-proxy-api.id
  resource_id = aws_api_gateway_rest_api.github-proxy-api.root_resource_id
  http_method = "OPTIONS"
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "options_response_200" {
  rest_api_id = aws_api_gateway_rest_api.github-proxy-api.id
  resource_id = aws_api_gateway_rest_api.github-proxy-api.root_resource_id
  http_method = aws_api_gateway_method.method-options.http_method
  status_code = aws_api_gateway_method_response.options_response_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  response_templates = {
    "application/json" = ""
  }
}
