'use client'
import React, { useState, useEffect } from "react"
import supabase from "../Config/supabase";
import { FaStar } from "react-icons/fa";
import { Check } from "lucide-react";

interface LeaveReviewComponentProps {
    articleId: string
}

const LeaveReviewComponent: React.FC<LeaveReviewComponentProps> = ({ articleId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviewerName, setReviewerName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
      const fetchDoctorName = async () => {
        try {
          const { data, error } = await supabase
            .from('doctors')
            .select('doctorname')
            .eq('id', articleId)
            .single();
  
          if (error) throw error;
          if (data) setDoctorName(data.doctorname);
        } catch (error) {
          console.error('Error fetching doctor name:', error);
        }
      };
  
      fetchDoctorName();
    }, [articleId]);
  
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
  
    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
    
        try {
          const reviewData = {
            doctor_id: articleId,
            rating: rating,
            review_text: reviewText,
            reviewer_name: reviewerName,
          };
  
          console.log('Submitting review data:', reviewData);
  
          const { data, error } = await supabase
            .from('reviews')
            .insert([reviewData]);
  
          if (error) {
            console.error('Supabase error:', error);
            throw error;
          }
  
  
              setRating(0);
          setReviewText('');
          setReviewerName('');
         setShowConfirmation(true);
          setTimeout(() => {
            setShowConfirmation(false);
            closeModal();
          }, 3000);  
        } catch (error) {
          console.error('Error in handleSubmitReview:', error);
          if (error instanceof Error) {
            setErrorMessage(`Error submitting review: ${error.message}`);
          } else {
            setErrorMessage('An unknown error occurred. Please try again.');
          }
        } finally {
          setIsLoading(false);
        }
      };

  return (
    <>
      <p onClick={openModal} style={{
        margin: '5px 16px 3px 0',
        paddingLeft: '10px',
        fontWeight: '300',
        cursor:'pointer'
      }}>Leave a Review for </p>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{background:'teal'}}>
            <h2 className="modal-title" style={{marginBottom:'0 0 20px 0',
borderBottom:'solid 1px ',
lineHeight:'2'}}>Leave a Review for {doctorName}</h2>

{showConfirmation ? (
<div className="confirmation-message">
<Check size={48} color="white" />
<h2>Review Sent!</h2>
<p>Thank you for your review.</p>
</div>
) : (
    <>
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="form-group">
                <div className="star-rating">
                  {[...Array(5)].map((star, index) => {
                    const ratingValue = index + 1;
                    return (
                      <label key={index}>
                        <input
                          type="radio"
                          name="rating"
                          value={ratingValue}
                          onClick={() => setRating(ratingValue)}
                          style={{ display: 'none' }}
                        />
                        <FaStar
                        style={{
                            marginBottom:'1rem'
                        }}
                          className="star"
                          color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                          size={20}
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(0)}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <textarea
                style={{
                    marginBottom:'1rem'
                }}
                  id="reviewText"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Write your review here..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="reviewerName" className="form-label">Your Name:</label>
                <input
                style={{
                    marginBottom:'1rem'
                }}
                  type="text"
                  id="reviewerName"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Enter your name"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="submit-button"
              >
                {isLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
            {errorMessage && <p className="message error-message">{errorMessage}</p>}
            {successMessage && <p className="message success-message">{successMessage}</p>}
            <button onClick={closeModal} className="close-button">Close</button>
            </>
      )}
          </div>
        </div>
      )}
    </>
  )
}

export default LeaveReviewComponent