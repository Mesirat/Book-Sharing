// import React, { useState } from "react";
// import { Heart } from "lucide-react"; // Or use your own icon

// const StarRating = ({ rating, onRate }) => {
//   const [hovered, setHovered] = useState(null);

//   return (
//     <div className="flex gap-1">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <span
//           key={star}
//           className={`cursor-pointer text-2xl ${
//             star <= (hovered || rating) ? "text-yellow-400" : "text-gray-300"
//           }`}
//           onClick={() => onRate(star)}
//           onMouseEnter={() => setHovered(star)}
//           onMouseLeave={() => setHovered(null)}
//         >
//           ★
//         </span>
//       ))}
//     </div>
//   );
// };

// const RatingLikeControls = ({ bookId, onRatingChange, onLikeChange }) => {
//   const [userRating, setUserRating] = useState(0);
//   const [liked, setLiked] = useState(false);

//   const handleRate = (rating) => {
//     setUserRating(rating);
//     onRatingChange && onRatingChange(bookId, rating);
//   };

//   const handleLike = () => {
//     const newState = !liked;
//     setLiked(newState);
//     onLikeChange && onLikeChange(bookId, newState);
//   };

//   return (
//     <div className="flex flex-col items-center gap-2 mt-4">
//       <StarRating rating={userRating} onRate={handleRate} />
//       <button
//         onClick={handleLike}
//         className="text-2xl transition-transform hover:scale-110"
//         title={liked ? "Unlike" : "Like"}
//       >
//         <Heart fill={liked ? "red" : "none"} color={liked ? "red" : "gray"} />
//       </button>
//       {userRating > 0 && (
//         <p className="text-green-600 text-sm">Your rating: {userRating} ⭐</p>
//       )}
//     </div>
//   );
// };

// export default RatingLikeControls;
