import Image from "next/image";

import emptyStar from "../assets/empty-star.svg";
import fullStar from "../assets/full-star.svg";
import halfStar from "../assets/half-star.svg";

export const setImage = (ratingString: string) => {
  if (!ratingString) return null;
  const rating = Number(ratingString.replace(/^\D+/g, ""));
  if (rating % 1 === 0) {
    return [...Array(5)].map((x, i) => {
      return i < rating ? (
        <Image key={i} src={fullStar} alt="full-star-rating"></Image>
      ) : (
        <Image key={i} src={emptyStar} alt="empty-star-rating"></Image>
      );
    });
  } else {
    return [...Array(5)].map((x, i) => {
      return i < rating - 1 ? (
        <Image key={i} src={fullStar} alt="full-star-rating"></Image>
      ) : i === Math.floor(rating) ? (
        <Image key={i} src={halfStar} alt="half-star-rating"></Image>
      ) : (
        <Image key={i} src={emptyStar} alt="half-star-rating"></Image>
      );
    });
  }
};