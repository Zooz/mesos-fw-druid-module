# mesos-fw-druid-module
Druid module for mesos-framework-core (https://github.com/Zooz/mesos-framework-core)

This plugin should be fetched by framework-core deployment to create a druid mesos framework.

# Druid-framework:
A framework for managing a druid cluster. The druid cluster components are dockerized (https://github.com/Zooz/druid-images.git) and run as mesos tasks managed by this framework.

# Future plans:
- Upgrade druid cluster (optionally remove tranquility).

# Screenshot
![](https://github.com/Zooz/mesos-fw-druid-module/blob/update-documentation/screenshots/Screen%20Shot%202018-03-29%20at%2018.38.29.png)

Launch tranquility:

```
curl -X PUT \
  http://<druid-fw-host>/api/v1/druid/tasks/tranquility/<prefix> \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-encoding: gzip, deflate' \
  -H 'accept-language: en-US,en;q=0.8,he;q=0.6' \
  -H 'cache-control: no-cache' \
  -H 'cookie: <framework authentication>' \
  -d '{"metrics": "s3://<s3bucket>/<metrics file>"}'
```
