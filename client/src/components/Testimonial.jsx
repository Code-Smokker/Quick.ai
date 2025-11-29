import { assets } from "../assets/assets"

const Testimonial = () => {
    const dummyTestimonialData = [
        {
            image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
            name: 'John Doe',
            title: 'Marketing Director, TechCorp',
            content: 'ContentAI has revolutionized our content workflow. The quality of the articles is outstanding, and it saves us hours of work every week.',
            rating: 5,
        },
        {
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
            name: 'Jane Smith',
            title: 'Content Creator, TechCorp',
            content: 'ContentAI has made our content creation process effortless. The AI tools have helped us produce high-quality content faster than ever before.',
            rating: 5,
        },
        {
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
            name: 'David Lee',
            title: 'Content Writer, TechCorp',
            content: 'ContentAI has transformed our content creation process. The AI tools have helped us produce high-quality content faster than ever before.',
            rating: 5,
        },
    ]

    return (
        <div className='px-4 sm:px-20 xl:px-32 py-24'>
            <div className='text-center'>
                <h2 className='text-slate-200 text-[42px] font-semibold'>Loved by Creators</h2>
                <p className='text-slate-400 max-w-lg mx-auto'>Don't just take our word for it. Here's what our users are saying.</p>
            </div>
            <div className='flex flex-wrap mt-10 justify-center'>
                {dummyTestimonialData.map((testimonial, index) => (
                    <div key={index} className='p-8 m-4 max-w-xs rounded-lg bg-slate-800 shadow-lg border border-slate-700 hover:-translate-y-1 transition duration-300 cursor-pointer hover:border-purple-500/50 hover:shadow-purple-500/10'>
                        <div className="flex items-center gap-1">
                            {Array(5).fill(0).map((_, i) => (
                                <img
                                    key={i}
                                    src={assets.star_icon}
                                    className="w-4 h-4"
                                    alt="star"
                                />
                            ))}
                        </div>
                        <p className='text-slate-300 text-sm my-5'>"{testimonial.content}"</p>
                        <hr className='mb-5 border-slate-600' />
                        <div className='flex items-center gap-4'>
                            <img src={testimonial.image} className='w-12 object-contain rounded-full' alt='' />
                            <div className='text-sm text-slate-400'>
                                <h3 className='font-medium text-white'>{testimonial.name}</h3>
                                <p className='text-xs text-slate-500'>{testimonial.title}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Testimonial