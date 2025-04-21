import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

// Updated interface to match expected API structure more closely
interface ArticleData {
  slug?: string; // Slug might be generated later or part of the data
  title: string;
  date: string;
  tags: string[];
  thinker: string;
  quote: string;
  spin: string;
  libertarianAnalysis: string; // Renamed from analyses?
  anarchistAnalysis: string;   // Renamed from analyses?
  // content: string; // Main content seems handled by analyses fields now
  // image?: { url: string; alt: string }; // Image data if needed
}

const GeneratePreviewPage: React.FC = () => {
  const router = useRouter();
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (router.query.articleData) {
      try {
        const data = JSON.parse(router.query.articleData as string);
        // **Important**: Adapt this mapping based on the actual structure returned by /api/generate
        // Assuming the generate API returns fields matching the PublishRequestBody
        setArticleData({
            slug: data.slug || data.title?.toLowerCase().replace(/\s+/g, '-').substring(0, 50), // Example slug generation
            title: data.title,
            date: data.date,
            tags: data.tags || [],
            thinker: data.thinker,
            quote: data.quote,
            spin: data.spin,
            libertarianAnalysis: data.libertarianAnalysis || (Array.isArray(data.analyses) ? data.analyses[0] : 'N/A'), // Map based on actual data
            anarchistAnalysis: data.anarchistAnalysis || (Array.isArray(data.analyses) ? data.analyses[1] : 'N/A') // Map based on actual data
        });
      } catch (error) {
        console.error("Failed to parse article data:", error);
        setPublishStatus({ success: false, message: 'Error loading article data.' });
      }
    }
  }, [router.query]);

  const handlePublish = async () => {
    if (!articleData) {
        setPublishStatus({ success: false, message: 'No article data to publish.'});
        return;
    }
    
    // Ensure slug is present before publishing
    if (!articleData.slug) {
        setPublishStatus({ success: false, message: 'Article slug is missing. Cannot publish.'});
        // Optionally generate slug here if needed
        // articleData.slug = articleData.title?.toLowerCase().replace(/\s+/g, '-').substring(0, 50);
        return;
    }

    setIsPublishing(true);
    setPublishStatus(null);

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to publish article.');
      }

      setPublishStatus({ success: true, message: result.message || 'Article published successfully!' });
      // Optional: Redirect after successful publish
      // router.push(`/articles/${articleData.slug}`); 

    } catch (error) {
      console.error('Publish failed:', error);
      setPublishStatus({ success: false, message: error instanceof Error ? error.message : 'An unknown error occurred during publishing.' });
    } finally {
      setIsPublishing(false);
    }
  };

  if (!articleData && !publishStatus) {
    return <div>Loading article preview...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {publishStatus && (
        <div className={`p-4 mb-4 rounded ${publishStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {publishStatus.message}
        </div>
      )}

      {articleData && (
          <>
              <h1 className="text-3xl font-bold mb-4">{articleData.title}</h1>
              <p className="text-gray-600 mb-2">Date: {articleData.date}</p>
              <div className="mb-4">
                  Tags: {articleData.tags.map(tag => (
                  <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      {tag}
                  </span>
                  ))}
              </div>
              <p className="mb-2"><strong>Thinker:</strong> {articleData.thinker}</p>
               <blockquote className="border-l-4 border-gray-400 italic pl-4 mb-4">
                  "{articleData.quote}"
               </blockquote>
               <p className="mb-2"><strong>Spin:</strong> {articleData.spin}</p>

              <div className="prose lg:prose-xl mb-6">
                  <h2 className="text-xl font-semibold mb-2">Libertarian Analyse</h2>
                  <p>{articleData.libertarianAnalysis}</p>
                  <h2 className="text-xl font-semibold mb-2">Anarchistische Analyse</h2>
                  <p>{articleData.anarchistAnalysis}</p>
              </div>

              <button
                onClick={handlePublish}
                disabled={isPublishing || publishStatus?.success}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPublishing ? 'Publishing...' : (publishStatus?.success ? 'Published!' : '✓ Publish Article')}
              </button>
          </>
      )}
    </div>
  );
};

export default GeneratePreviewPage; 