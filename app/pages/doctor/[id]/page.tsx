import React from 'react'
import { getArticle } from '../lib';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';




export async function generateMetadata({ params }: { params: { id: string } }): Promise<{ title: string }> {
const articleId: string = params.id;
try {
const articleDetails: any | null = await getArticle(articleId);
if (articleDetails) {
return {
title: `iTruth News | ${articleDetails.title || 'Page Not Found'}`,
};
} else {
return {
title: 'iTruth News | Page Not Found',
};
}
} catch (error) {
return {
title: 'iTruth News | Page Not Found',
};
}
}



export default async function DetailsPage({ params }: { params: { id: string } }): Promise<JSX.Element> {
const articleId: string = params.id;
// Fetch article details
const post: any | null = await getArticle(articleId);

if (!post) {
return <div>Article not found</div>;
}
const lastUpdatedDate: Date | null = post.timestamp && post.timestamp.toDate();
const formattedDate: string | null = lastUpdatedDate && `${lastUpdatedDate.toLocaleString('en-US', 
{ timeZone: 'America/New_York', day: 'numeric', month: 'long', year: 'numeric' })}, 
${lastUpdatedDate.toLocaleString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: 'numeric', hour12: true })}`;

return (
<>

<Navbar />
<div className='mass-container'>
<div className="article-container">
<div className="main-content">
<div className="backbtn-box">
<h1>{post.title}</h1>

</div>
<div className="imgbox">
<img className="cover_image" src={post.coverimage} alt="Property Cover" />
</div>
<div className="authflex">
<p>{post.catorgory}</p>
<h3 className="card-category" style={{ display: 'flex', alignItems: 'center', fontWeight: 300 }}>
<span className='iphone-500px'>{post.owner}</span> 
<div style={{ border: 'solid 1px', height: '30px', margin: '0 10px' }}></div>
<img className="authbox" src={post.authpic} style={{ maxWidth: '100%', height: '80px', borderRadius: '7px' }} />
</h3>
</div>
<p className="flexdate">{formattedDate}</p>
<div className="body-content">
{/* <div className="advertisement">
<AdComponent articleId={articleId} />
</div> */}

<p>{post.content}</p>

{/* <ArticleContribute articleId={articleId}/> */}
<p style={{ whiteSpace: 'pre-line' }}>{post.bodycontent}</p>
<p>{post.endcontent}</p>
</div>
{/* <div className="advertisement">
<AdComponent articleId={articleId} />
</div> */}

<hr />

{/* <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1rem' }}>
<Goup />
</div> */}
</div>
</div>
<div className="sidebar">

</div>
</div>
<Footer />
     


</>
);
}