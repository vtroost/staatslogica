'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { format, parse, compareAsc } from 'date-fns';
import { nl } from 'date-fns/locale';

// Define types for the component props
type Article = {
    slug: string;
    title: string;
    date: string;
    tags?: string[];
    thinkers?: string[];
    spin?: string;
    imageUrl?: string;
    sourceTitle?: string;
};

type GroupedArticles = {
    [key: string]: Article[];
};

type TimelineProps = {
    groupedArticles: GroupedArticles;
};

const TimelineComponent: React.FC<TimelineProps> = ({ groupedArticles }) => {
    // State for expanded timeline items
    const [expandedMonths, setExpandedMonths] = useState<{ [key: string]: boolean }>({});
    const [activeArticle, setActiveArticle] = useState<string | null>(null);

    // Process and sort timeline keys
    const sortedTimelineKeys = Object.keys(groupedArticles).sort((a, b) => {
        try {
            // Parse the month and year strings
            const dateA = parse(a, 'MMMM yyyy', new Date(), { locale: nl });
            const dateB = parse(b, 'MMMM yyyy', new Date(), { locale: nl });
            return compareAsc(dateB, dateA); // newest first
        } catch (e) {
            return 0;
        }
    });

    // Auto-expand the most recent month when component mounts
    useEffect(() => {
        if (sortedTimelineKeys.length > 0) {
            const mostRecentMonth = sortedTimelineKeys[0];
            setExpandedMonths(prev => ({ ...prev, [mostRecentMonth]: true }));
        }
    }, [sortedTimelineKeys]);

    // Toggle expanded state for a month
    const toggleExpand = (month: string) => {
        setExpandedMonths(prev => ({
            ...prev,
            [month]: !prev[month]
        }));
    };

    // Format the date for display in the timeline
    const formatArticleDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'd MMMM', { locale: nl });
    };
    
    // Function to highlight active article on hover
    const handleArticleHover = (slug: string) => {
        setActiveArticle(slug);
    };
    
    // Function to clear active article on mouse leave
    const handleArticleLeave = () => {
        setActiveArticle(null);
    };

    // Function to determine if a month is "hot" (has many articles)
    const isHotMonth = (month: string) => {
        const count = groupedArticles[month].length;
        // Find average number of articles per month
        const totalArticles = Object.values(groupedArticles).reduce(
            (sum, articles) => sum + articles.length, 0
        );
        const avgArticlesPerMonth = totalArticles / sortedTimelineKeys.length;
        // If this month has significantly more articles than average, mark as hot
        return count > avgArticlesPerMonth * 1.5 && count >= 3;
    };

    return (
        <div className="sticky top-24">
            <h3 className="text-lg font-bold mb-4 text-gray-800 border-b border-yellow-300 pb-2">
                Tijdlijn
            </h3>
            <div className="timeline-container relative">
                {/* Yellow vertical line */}
                <div className="absolute left-4 top-0 bottom-0 w-1 bg-yellow-400 rounded-full" />

                {/* Timeline items */}
                <div className="space-y-1">
                    {sortedTimelineKeys.map((month) => {
                        const isHot = isHotMonth(month);
                        return (
                            <div key={month} className="mb-4">
                                {/* Month header */}
                                <button
                                    onClick={() => toggleExpand(month)}
                                    className={`flex items-center pl-9 pr-3 py-2 w-full text-left relative rounded-lg group transition-all duration-200
                                        ${isHot ? 'bg-yellow-50 hover:bg-yellow-100' : 'bg-white hover:bg-yellow-50'}`}
                                >
                                    {/* Yellow dot on the line */}
                                    <div className={`absolute left-4 transform -translate-x-1/2 w-3 h-3 
                                        ${expandedMonths[month] ? 'bg-yellow-500 scale-110' : isHot ? 'bg-yellow-500' : 'bg-yellow-400'} 
                                        rounded-full shadow-md z-10 transition-all duration-200
                                        ${isHot && !expandedMonths[month] ? 'animate-pulse' : ''}`} 
                                    />
                                    
                                    <span className={`font-medium ${expandedMonths[month] ? 'text-black' : 'text-gray-800'} group-hover:text-black`}>
                                        {month.charAt(0).toUpperCase() + month.slice(1)}
                                    </span>
                                    
                                    <div className="ml-auto flex items-center gap-2">
                                        {isHot && (
                                            <span className="text-xs bg-yellow-500 text-black px-1.5 py-0.5 rounded-sm font-bold">
                                                Populair
                                            </span>
                                        )}
                                        <span className={`text-gray-500 text-sm px-2 py-0.5 rounded-full
                                            ${isHot ? 'bg-yellow-200' : 'bg-gray-100'}`}>
                                            {groupedArticles[month].length}
                                        </span>
                                    </div>
                                    
                                    <svg 
                                        className={`w-4 h-4 ml-2 text-gray-400 transition-transform ${expandedMonths[month] ? 'transform rotate-180 text-yellow-500' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                
                                {/* Articles for this month - only show when expanded */}
                                {expandedMonths[month] && (
                                    <div className="pl-14 mt-2 space-y-0.5 max-h-64 overflow-auto pr-2">
                                        {groupedArticles[month].map((article) => (
                                            <div 
                                                key={article.slug} 
                                                className={`py-1.5 border-l-2 pl-3 transition-colors duration-200
                                                    ${activeArticle === article.slug 
                                                        ? 'border-yellow-400 bg-yellow-50' 
                                                        : 'border-gray-200 hover:border-yellow-300 hover:bg-gray-50'}`}
                                                onMouseEnter={() => handleArticleHover(article.slug)}
                                                onMouseLeave={handleArticleLeave}
                                            >
                                                <Link 
                                                    href={`/articles/${article.slug}`}
                                                    className="block group"
                                                >
                                                    <span className="text-xs text-yellow-600 font-medium">
                                                        {formatArticleDate(article.date)}
                                                    </span>
                                                    <span className="block text-gray-800 font-medium group-hover:text-yellow-600 transition-colors">
                                                        {article.title}
                                                    </span>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {sortedTimelineKeys.length > 1 && (
                    <div className="mt-6 text-center space-x-4">
                        <button 
                            onClick={() => {
                                // Create a new object with all months expanded
                                const allExpanded = sortedTimelineKeys.reduce((acc, month) => {
                                    acc[month] = true;
                                    return acc;
                                }, {} as {[key: string]: boolean});
                                setExpandedMonths(allExpanded);
                            }}
                            className="inline-block text-sm text-gray-600 hover:text-yellow-600 hover:underline"
                        >
                            Alles uitklappen
                        </button>
                        <button 
                            onClick={() => {
                                // Collapse all except the most recent
                                const mostRecentMonth = sortedTimelineKeys[0];
                                const collapsed = { [mostRecentMonth]: true };
                                setExpandedMonths(collapsed);
                            }}
                            className="inline-block text-sm text-gray-600 hover:text-yellow-600 hover:underline"
                        >
                            Inklappen
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimelineComponent; 