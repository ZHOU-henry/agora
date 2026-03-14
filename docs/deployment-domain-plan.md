# Domain And Hosting Plan

## Goal

Move Agora from the temporary `trycloudflare.com` URL to a stable branded
domain, then choose between:

- cheapest local-machine hosting with a custom domain
- low-cost overseas VPS hosting
- China / Hong Kong oriented cloud hosting

## Constraint Summary

Primary real-world constraints for the current stage:

- Henry is in mainland China
- the site should be reachable by mainland-China users and overseas users
- budget target is under `USD 10 / month`
- the plan should preserve future Google visibility instead of trapping the
  product in a purely local-network path

## Main Conclusion

For the current stage, the best balance is:

- `.com` domain
- Cloudflare DNS / TLS / proxy
- Hong Kong cloud server

This is better than a Europe/US server for the current user base because
mainland-China access is more likely to stay usable and stable without forcing
users into a VPN-like experience.

It is also better than a mainland-China server for the current stage because it
avoids the immediate ICP / BeiAn friction while still staying much more
China-friendly than a transoceanic deployment.

## Option A - Cheapest Immediate Upgrade

Shape:

- buy a domain
- move DNS to Cloudflare
- replace the current quick tunnel with a named Cloudflare Tunnel
- point a custom hostname such as `agora.yourdomain.com` at the tunnel

Why:

- lowest cost
- keeps the current machine as the runtime
- easiest path from the current public demo

Tradeoffs:

- your local machine must stay online
- uptime and latency stay tied to the local network
- not ideal for real production operations

Estimated cost:

- domain only
- roughly `USD 9-11 / year` for a `.com`, depending on registrar

## Option B - Best Value Production Path

Shape:

- buy a domain
- use Cloudflare DNS and proxy
- deploy Agora on a small overseas cloud server
- run Next.js + Fastify + PostgreSQL on the server

Recommended starting profile:

- 2 vCPU
- 2-4 GB RAM
- 40-80 GB SSD

Why:

- much more stable than local hosting
- still inexpensive
- good enough for early product demos and small-scale real traffic

Recommended candidates:

- Hetzner Cloud
- DigitalOcean
- AWS Lightsail

Important note for the current China-based use case:

- these providers are still viable for global access
- but they are not the first recommendation for Agora right now because
  mainland-China network quality can be materially less stable than a Hong Kong
  deployment
- they are better treated as fallback options if Hong Kong price or account
  setup becomes a blocker

## Option C - China / Hong Kong Friendly Path

Shape:

- if you want no ICP filing friction, use Hong Kong
- if you want mainland China hosting, expect ICP / BeiAn work before going live

Recommended starting profile:

- Tencent Cloud Lighthouse Hong Kong
- Alibaba Cloud Simple Application Server Hong Kong

Why:

- easier latency path for China-based use
- lower operations friction than managing a full mainland enterprise stack early
- no immediate mainland ICP filing requirement if hosted in Hong Kong

## Practical Recommendation

### Recommended Sequence

1. buy the domain now
2. move DNS to Cloudflare
3. replace the temporary Quick Tunnel hostname with a named Cloudflare Tunnel on
   a custom subdomain
4. deploy Agora onto a Hong Kong cloud server once the product needs more
   stability than local hosting can provide
5. keep Cloudflare in front for DNS, TLS, and caching
6. only move to mainland-China hosting when you are ready to absorb the
   compliance workflow

### Recommended Budget Path

- domain:
  `USD 8.88 + 0.20 ICANN / year` at Spaceship for a `.com`
- DNS / TLS / reverse proxy:
  `USD 0` on Cloudflare free tier
- server:
  start with a low-cost Hong Kong small-instance offer

This keeps the effective monthly cost well inside the `USD 10 / month` target.

## Search Visibility

Hosting in mainland China does not automatically make Google unable to index the
site, but it does create more operational and compliance variables.

For the current stage, `.com + Cloudflare + Hong Kong` is the cleaner balance
for:

- China access
- overseas access
- future Google visibility

The strongest anti-pattern would be:

- a regionally awkward server
- plus blocked third-party frontend dependencies
- plus unstable DNS / tunnel routing

Those combined are more dangerous than server geography alone.

## Current Recommended Stack

### Immediate Cheapest Upgrade

- domain:
  Spaceship `.com`
- DNS / TLS:
  Cloudflare
- runtime:
  current local machine
- ingress:
  named Cloudflare Tunnel

Use this if:

- you need the fastest upgrade from `trycloudflare.com`
- you want near-zero monthly cost

### Best Current Production-Style Upgrade

- domain:
  `.com`
- DNS / TLS:
  Cloudflare
- server:
  Hong Kong VPS / simple application server
- app:
  Agora in production mode

Use this if:

- you want the best current balance of mainland-China access, overseas access,
  price, and professionalism

## Reference Sources

- Cloudflare Registrar docs:
  https://developers.cloudflare.com/registrar/
- Cloudflare Registrar product:
  https://www.cloudflare.com/products/registrar/
- Cloudflare Tunnel docs:
  https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/
- Spaceship `.com` pricing:
  https://www.spaceship.com/domains/gtld/com/
- Porkbun pricing / registry explanation:
  https://porkbun.com/about
- AWS Lightsail pricing:
  https://aws.amazon.com/lightsail/pricing/
- Alibaba Cloud simple application server billable items:
  https://www.alibabacloud.com/help/en/simple-application-server/product-overview/billable-items
- Tencent Cloud Lighthouse product page:
  https://www.tencentcloud.com/products/lighthouse
- Tencent Cloud international Lighthouse offer page:
  https://www.tencentcloud.com/act/pro/lighthouse
- Google Search documentation on locale / regional signals:
  https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages
- Google Search documentation on multi-regional sites:
  https://developers.google.com/search/docs/advanced/crawling/managing-multi-regional-sites
- Googlebot crawling documentation:
  https://developers.google.com/search/docs/advanced/crawling/googlebot
