import { Flame, CloudLightning, Cloud, CloudOff } from 'lucide-react'

export const getReviewPotential = (rating?: number, totalRatings?: number) => {
    if (rating == null || totalRatings == null) return null
  
    // Improvement potential is only relevant if rating < 4.7
    // Scale [3.5 to 4.7]: 3.5 needs the most improvement, 4.7 needs very little
    // Ratings ≥4.7 get zero improvement points.
    let improvementPoints = 0
    if (rating < 4.7) {
      // Normalise rating from 3.5 (worst) to 4.7 (much better):
      // At 3.5 = full 50 points
      // At 4.7 ~ almost no improvement needed = close to 0 points
      const minRating = 3.5
      const maxRating = 4.7
      const clampedRating = Math.min(Math.max(rating, minRating), maxRating)
      const improvementRatio = (maxRating - clampedRating) / (maxRating - minRating)
      improvementPoints = improvementRatio * 50
    }
  
    // Growth opportunity applies if rating is high (≥4.5) but reviews are low.
    // If rating <4.5, we focus more on improvement. If rating≥4.5 but <4.9, some growth points if low reviews.
    // If rating≥4.9 and few reviews, high growth points; if rating≥4.9 and many reviews, minimal points.
    let growthPoints = 0
    if (rating >= 4.5) {
      // Normalise count: fewer = more growth opportunity.
      // 0 reviews = max growth (40 points), 250+ = 0 points
      const clampedCount = Math.min(totalRatings, 250)
      const normalisedCount = (250 - clampedCount) / 250
      growthPoints = normalisedCount * 40
    }
  
    // Special Cases:
    // If rating <4.0 and totalRatings <50, add +10 improvement bonus.
    // If rating ≥4.8 and totalRatings <50, add extra +10 growth bonus (reflecting a high rating that can be leveraged further with more reviews).
    let specialCasePoints = 0
    if (rating < 4.0 && totalRatings < 50) {
      specialCasePoints += 10
    }
    if (rating >= 4.8 && totalRatings < 50) {
      specialCasePoints += 10
    }
  
    // Now add a condition for perfect rating + large review count:
    // If rating≥4.9 and totalRatings≥100, we want minimal points.
    // Let’s scale down both improvement and growth drastically in that scenario.
    if (rating >= 4.9 && totalRatings >= 100) {
      // Very little need for improvement or growth
      improvementPoints = 0
      growthPoints = 0
      specialCasePoints = 0
    }
  
    let score = improvementPoints + growthPoints + specialCasePoints
    const roundedScore = Math.round(score)
  
    if (score >= 70) {
      return {
        icon: Flame,
        color: 'text-green-500',
        label: 'High-Value Opportunity',
        description: `Substantial potential: With ${totalRatings} reviews at ${rating} ⭐, focused review management can significantly enhance visibility and credibility.`,
        score: roundedScore
      }
    }
  
    if (score >= 50) {
      return {
        icon: CloudLightning,
        color: 'text-orange-500',
        label: 'Promising Opportunity',
        description: `${totalRatings} reviews at ${rating} ⭐ indicates good standing but meaningful room to strengthen the listing and reputation further.`,
        score: roundedScore
      }
    }
  
    if (score >= 30) {
      return {
        icon: Cloud,
        color: 'text-blue-500',
        label: 'Notable Potential',
        description: `${totalRatings} reviews at ${rating} ⭐ show a solid base, but some opportunity remains to refine or expand your review portfolio.`,
        score: roundedScore
      }
    }
  
    return {
      icon: CloudOff,
      color: 'text-gray-400',
      label: 'Established Presence',
      description: `With ${totalRatings} reviews and a ${rating} ⭐ rating, this listing is already thriving. Additional review management offers limited incremental benefit.`,
      score: roundedScore
    }
  }
  