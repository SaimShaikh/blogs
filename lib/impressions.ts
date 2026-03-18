import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis =
  redisUrl && redisToken
    ? new Redis({
        url: redisUrl,
        token: redisToken,
      })
    : null;

function getRedisClient() {
  if (!redis) {
    console.warn(
      "Upstash Redis credentials are missing. Impressions will not be recorded until UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are configured.",
    );
    return null;
  }
  return redis;
}

export async function incrementImpression(slug: string) {
  if (!slug) return;
  const client = getRedisClient();
  if (!client) return;
  await client.incr(impressionKey(slug));
}

export async function getImpression(slug: string): Promise<number> {
  if (!slug) return 0;
  const client = getRedisClient();
  if (!client) return 0;
  const value = await client.get<number>(impressionKey(slug));
  return value ?? 0;
}

export async function getImpressions(
  slugs: string[],
): Promise<Record<string, number>> {
  if (slugs.length === 0) return {};
  const client = getRedisClient();
  if (!client) {
    return slugs.reduce<Record<string, number>>((acc, slug) => {
      acc[slug] = 0;
      return acc;
    }, {});
  }

  const keys = slugs.map(impressionKey);
  const values = (await client.mget(...keys)) as (number | null)[];

  return slugs.reduce<Record<string, number>>((acc, slug, index) => {
    acc[slug] = values[index] ?? 0;
    return acc;
  }, {});
}

function impressionKey(slug: string) {
  return `impressions:${slug}`;
}
