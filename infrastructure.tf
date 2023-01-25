# S3 setup
resource "aws_s3_bucket" "example" {
  bucket = "example-bucket"
}

# EC2 instances
resource "aws_instance" "example" {
  ami           = "ami-0f65671a86f061fcd"
  instance_type = "t2.micro"
  count = 2

  tags = {
    Name = "example-instance"
  }
}

# RDS setup
resource "aws_db_instance" "example" {
  allocated_storage = 20
  engine            = "mysql"
  engine_version    = "5.7"
  instance_class    = "db.t2.micro"
  name              = "example"
  username          = "example"
  password          = "example"
  port              = "3306"
}

# Elasticache setup
resource "aws_elasticache_cluster" "example" {
  cluster_id = "example"
  engine = "memcached"
  node_type = "cache.m3.medium"
  num_cache_nodes = 2
}

# Elastic Load Balancer setup
resource "aws_elb" "example" {
  name               = "example"
  availability_zones = ["us-east-1a", "us-east-1b"]

  listener {
    instance_port     = 80
    instance_protocol = "http"
    lb_port           = 80
    lb_protocol       = "http"
  }

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 3
    target              = "HTTP:80/"
    interval            = 30
  }
