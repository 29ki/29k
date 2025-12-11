// Run with npx ts-node ./scripts/importFirebaseDynamicLinksToAirbridge.ts
import 'dotenv/config';
import * as csv from '@fast-csv/parse';

const [, , CSV_FILE] = process.argv;

type DynamicLink = {
  short_link: string; //Short link
  link: string; //Deep link (link)
  apn: string; //Android package name (apn)
  afl: string; //Android fallback link (afl)
  amv: string; //Android minimum package version code (amv)
  ibi: string; //iOS bundle ID (ibi)
  ifl: string; //iOS fallback link (ifl)
  ius: string; //iOS custom scheme (ius)
  ipfl: string; //iOS iPad fallback link (ipfl)
  ipbi: string; //iOS iPad bundle ID (ipbi)
  isi: string; //iOS app store ID (isi)
  imv: string; //iOS minimum version (imv)
  efr: string; //Enable forced redirect? (efr)
  ofl: string; //Desktop fallback link (ofl)
  st: string; //Social title (st)
  sd: string; //Social description (sd)
  si: string; //Social image link (si)
  utm_source: string; //UTM source (utm_source)
  utm_medium: string; //UTM medium (utm_medium)
  utm_campaign: string; //UTM campaign (utm_campaign)
  utm_term: string; //UTM term (utm_term)
  utm_content: string; //UTM content (utm_content)
  at: string; //iTunes connect at
  ct: string; //iTunes connect ct
  mt: string; //iTunes connect mt
  pt: string; //iTunes connect pt
  archived: string; //Archived?
  name: string; //Link name
  creation_timestamp: string; //Creation timestamp
};

async function readFileCsvFile(filePath: string): Promise<DynamicLink[]> {
  return new Promise((resolve, reject) => {
    const data: DynamicLink[] = [];
    csv
      .parseFile(filePath, {headers: true})
      .on('error', reject)
      .on('data', row => data.push(row))
      .on('end', () => resolve(data));
  });
}

function channelSlugFromString(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-\_\.]/g, '') // Remove invalid chars
    .trim()
    .replace(/\s+/g, '-') // Collapse whitespace
    .replace(/-+/g, '-'); // Collapse multiple hyphens
}

const main = async () => {
  const links = await readFileCsvFile(CSV_FILE);
  const filteredLinks = links
    .filter(
      ({link, archived}) =>
        !link.includes('/hostSessionInvite') &&
        !link.includes('/joinSessionInvite') &&
        !link.includes('/verifyPublicHostCode') &&
        archived === 'false',
    )
    .slice(6, 10);

  for (const link of filteredLinks) {
    console.log(
      `Migrating link: ${link.short_link} -> ${link.link} (${link.name})`,
    );
    const response = await fetch('https://api.airbridge.io/v1/tracking-links', {
      method: 'POST',
      headers: {
        'Accept-Language': 'en',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.AIRBRIDGE_API_TOKEN}`,
      },
      body: JSON.stringify({
        deeplinkUrl: `${process.env.DEEP_LINK_SCHEME}://${link.link.replace('https://29k.org/', '')}`,
        channel: channelSlugFromString(link.utm_source) || 'app',
        campaignParams: {
          campaign: link.utm_campaign || link.name,
          content: link.utm_content,
          medium: link.utm_medium,
          term: link.utm_term,
        },
        deeplinkOption: {
          showAlertForInitialDeeplinkingIssue: true,
        },
        fallbackPaths: {
          android: 'google-play',
          ios: 'itunes-appstore',
          desktop:
            link.ofl ||
            link.link.replace('https://29k.org/', 'https://awareapp.org/'),
        },
        ogTag: {
          title: link.st,
          description: link.sd,
          imageUrl: link.si,
        },
        customShortId: link.short_link
          .replace('https://aware.29k.org/', '')
          .toLocaleLowerCase(),
      }),
    });
    if (!response.ok) {
      console.error('Error', response.status, await response.text());
      break;
    }
  }

  console.log(
    `Found ${links.length} links, ${filteredLinks.length} of which are valid.`,
  );
};

main();
