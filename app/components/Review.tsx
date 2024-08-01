'use client'
import React, { useEffect, useState } from 'react';
import supabase from '../Config/supabase';
import { v4 as uuidv4 } from 'uuid';

interface Review {
  id: string;
  uuid: string;
  rating: number;
  review_text: string;
  reviewer_name: string;
  created_at: string;
}

interface ReviewComponentProps {
  articleId: string;
}

const ReviewComponent: React.FC<ReviewComponentProps> = ({ articleId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('doctor_id', articleId) 
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReviews(data || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isModalOpen) {
      fetchReviews();
    }
  }, [articleId, isModalOpen]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPage(1);
    setShowAllReviews(false);
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const toggleShowAllReviews = () => setShowAllReviews(!showAllReviews);

  return (
    <>
      <button onClick={openModal} className="viewReviewsButton">View Reviews</button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{
            background: 'teal',
            color: 'white',
            padding: '20px',
            maxHeight: '80vh',
            overflowY: 'auto',
            maxWidth:'50rem'
          }}>
            <h2 className="modal-title" style={{marginBottom:'20px', borderBottom:'solid 1px white', paddingBottom: '10px'}}>Reviews</h2>
            {loading ? (
              <p>Loading...</p>
            ) : reviews.length > 0 ? (
              <>
                <div style={{maxHeight: showAllReviews ? 'none' : '300px', overflowY: showAllReviews ? 'visible' : 'auto'}}>
                  {(showAllReviews ? reviews : currentReviews).map((review) => (
                    <div key={review.id || uuidv4()} className="review-item" style={{marginBottom: '15px'}}>
                      <h3 className='review-item-name'>{review.reviewer_name}</h3>
                      <p className='review-item-rating'>Rating: {review.rating} / 5</p>
                      <p className='review-item-date'> <small>{new Date(review.created_at).toLocaleDateString()}</small></p>

                      <p>{review.review_text}</p>
                     
                    </div>
                  ))}
                </div>
                {!showAllReviews && (
                  <div style={{marginTop: '20px'}}>
                    {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }, (_, i) => (
                      <button key={i} onClick={() => paginate(i + 1)} className='edit-btn' >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
                <button onClick={toggleShowAllReviews} className='submit-button' style={{marginTop: '20px',backgroundColor:'blue'}}>
                  {showAllReviews ? 'Show Less' : 'Show All'}
                </button>
              </>
            ) : (
              <p>No reviews yet.</p>
            )}
            <button onClick={closeModal} className="close-button" style={{marginTop: '20px', padding: '10px', background: 'darkred', color: 'white', border: 'none', cursor: 'pointer'}}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ReviewComponent;