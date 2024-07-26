import React from 'react'
interface ReviewComponentProps {
    articleId: string;
  }

const ReviewComponent: React.FC<ReviewComponentProps> = ({ articleId }) => {
    return <>
        <button className="viewReviewsButton">View Reviews</button>

    </>;
}

export default ReviewComponent