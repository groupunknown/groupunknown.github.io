---
layout: post
title:  "Cloudflare page rules"
date:   2019-11-13 11:49:08 -0400
categories:
---
For xbt to work with cloudflare you need to add the following page rules for your sub domain.

where :
*.mysite.com - is the domain where your xbt is installed and pointed to. In case you want static domain you may change *.mysite.com to sub.mysite.com , change sub to any sub domain name you are using for your tracker.

2710 - is the port on which your xbt is running.

## Ports Supported By Cloudflare:

* `2052`
* `2053`
* `2082`
* `2083`
* `2086`
* `2087`
* `2095`
* `2096`
* `8080`
* `8443`
* `8880`

- ![Cloudflare Page Rules](![Macbook]({{site.baseurl}}/assets/img/cloudflare-page-rules.png))