import { getAllArticles } from '@/lib/articles'

export async function GET() {
  const articles = getAllArticles()
  const siteUrl = 'https://staatslogica.nl'
  
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Staatslogica | Kritische denkers. Heldere analyses.</title>
    <description>Doorzie staatspropaganda met scherpe analyses vanuit het perspectief van grote libertarische denkers. Elke dag nieuwe inzichten die mainstream media verzwijgt.</description>
    <link>${siteUrl}</link>
    <language>nl-NL</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>redactie@staatslogica.nl (Staatslogica)</managingEditor>
    <webMaster>redactie@staatslogica.nl (Staatslogica)</webMaster>
    <category>Analysis</category>
    <category>Opinion</category>
    <category>Politics</category>
    <category>News</category>
    <image>
      <url>${siteUrl}/og-image.jpg</url>
      <title>Staatslogica</title>
      <link>${siteUrl}</link>
      <width>200</width>
      <height>200</height>
    </image>
    ${articles.slice(0, 20).map(article => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${article.spin || `Analyse vanuit libertarisch perspectief over ${article.title.toLowerCase()}`}]]></description>
      <link>${siteUrl}/articles/${article.slug}</link>
      <guid isPermaLink="true">${siteUrl}/articles/${article.slug}</guid>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <category><![CDATA[Analyse]]></category>
      <category><![CDATA[Politiek]]></category>
      ${article.tags ? article.tags.map(tag => `<category><![CDATA[${tag}]]></category>`).join('\n      ') : ''}
      ${article.imageUrl ? `
      <enclosure url="${article.imageUrl}" type="image/jpeg"/>
      <media:content xmlns:media="http://search.yahoo.com/mrss/" url="${article.imageUrl}" type="image/jpeg"/>` : ''}
      <content:encoded><![CDATA[
        ${article.imageUrl ? `<img src="${article.imageUrl}" alt="${article.title}" style="max-width: 100%; height: auto; margin-bottom: 1rem;"/>` : ''}
        <p><strong>${article.spin || `Libertarische analyse van actuele gebeurtenissen`}</strong></p>
        <p>Lees het volledige artikel op <a href="${siteUrl}/articles/${article.slug}">Staatslogica</a></p>
        ${article.sourceUrl ? `<p><em>Bronmateriaal: <a href="${article.sourceUrl}" target="_blank" rel="noopener">${article.sourceTitle || 'Origineel artikel'}</a></em></p>` : ''}
      ]]></content:encoded>
    </item>`).join('')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  })
} 