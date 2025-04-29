import { Star, StarHalf, Cake, Candy, IceCream, Cookie, MessageSquare, CandyCane, Dessert } from 'lucide-react';

const Feedback = () => {
    // Sample feedback data
    const reviews = [
        {
            id: 1,
            product: "Chocolate Truffle Cake",
            customer: "Sarah Johnson",
            rating: 5,
            comment: "The most delicious cake I've ever had! Perfect balance of sweetness and richness. The presentation was exquisite.",
            date: "2 days ago"
        },
        {
            id: 2,
            product: "Caramel Fudge Brownie",
            customer: "Michael Chen",
            rating: 4.5,
            comment: "Amazing texture and flavor. The caramel was perfectly balanced - not too sweet, with just the right amount of saltiness.",
            date: "1 week ago"
        },
        {
            id: 3,
            product: "Strawberry Macarons",
            customer: "Emma Williams",
            rating: 5,
            comment: "Absolutely divine! The macarons have a perfect crisp shell with a chewy interior. Tastes like fresh berries.",
            date: "2 weeks ago"
        },
        {
            id: 4,
            product: "Hazelnut Praline",
            customer: "David Miller",
            rating: 3,
            comment: "Good flavor profile but the texture was a bit too crunchy for my preference. The hazelnut flavor was excellent.",
            date: "3 weeks ago"
        }
    ];

    // Function to render star ratings
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star
                    key={`full-${i}`}
                    className="w-5 h-5 text-amber-500 fill-amber-500"
                />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <StarHalf
                    key="half"
                    className="w-5 h-5 text-amber-500 fill-amber-500"
                />
            );
        }

        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <Star
                    key={`empty-${i}`}
                    className="w-5 h-5 text-amber-200 fill-amber-200"
                />
            );
        }

        return (
            <div className="flex items-center gap-1">
                {stars}
                <span className="ml-2 text-base font-medium text-amber-700">
          {rating.toFixed(1)}
        </span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#f4f3f3] p-6 relative overflow-hidden">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-10">
                <CandyCane className="absolute top-20 left-10 w-32 h-32 text-amber-500" />
                <IceCream className="absolute bottom-40 left-1/4 w-36 h-36 text-amber-500" />
                <Cake className="absolute bottom-20 right-10 w-40 h-40 text-amber-500" />
                <Dessert className="absolute top-1/4 right-1/3 w-24 h-24 text-amber-500 transform rotate-12" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-left mb-8">
                    <h1 className="text-3xl font-bold text-amber-800 mb-2 flex items-center gap-2">
                        <MessageSquare className="w-8 h-8" />
                        Customer Reviews
                    </h1>
                    <p className="text-amber-600">Honest feedback from our valued customers</p>
                </div>

                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white/95 rounded-lg shadow p-6 border border-amber-100 backdrop-blur-sm"
                        >
                            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-amber-900">{review.product}</h3>
                                    <p className="text-sm text-amber-600 mb-2">
                                        Reviewed by {review.customer} • {review.date}
                                    </p>
                                    {renderStars(review.rating)}
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-medium">
                                        {review.customer.charAt(0)}
                                    </div>
                                </div>
                            </div>
                            <p className="text-amber-800 mt-3">
                                "{review.comment}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 6s ease-in-out 1.5s infinite;
        }
      `}</style>
        </div>
    );
};

export default Feedback;