import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGigs, reset } from '../redux/slices/gigSlice';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { Search, DollarSign, Clock, ArrowRight, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
    const dispatch = useDispatch();
    const { gigs, isLoading, isError, message } = useSelector((state) => state.gigs);
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(getGigs(search));

        return () => {
            dispatch(reset());
        }
    }, [dispatch, search]);

    const handleSearch = (e) => {
        if(e) e.preventDefault();
        dispatch(getGigs(search));
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-12 pb-12">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-[#4F46E5] text-white px-6 py-16 sm:px-12 sm:py-24 shadow-2xl">
                 {/* Decorative Blobs */}
                 <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                     <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white opacity-10 blur-3xl mix-blend-overlay"></div>
                     <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-pink-500 opacity-20 blur-3xl mix-blend-overlay"></div>
                 </div>
                 
                 <div className="relative z-10 max-w-3xl mx-auto text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl sm:text-6xl font-extrabold mb-6 tracking-tight leading-tight"
                    >
                        Find the perfect <span className="text-indigo-200">Connect</span> <br/> for your next project
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-indigo-100 text-lg sm:text-xl mb-10 max-w-2xl mx-auto"
                    >
                        Connect with talented freelancers to get your work done efficiently and professionally.
                    </motion.p>

                    <motion.form 
                       onSubmit={handleSearch}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.6, delay: 0.2 }}
                       className="bg-white p-2 rounded-2xl shadow-xl flex items-center max-w-lg mx-auto transform transition-transform hover:scale-[1.02]"
                    >
                        <Search className="h-6 w-6 text-gray-400 ml-4 flex-shrink-0" />
                        <input
                             type="text"
                             className="flex-grow px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-base"
                             placeholder="What are you looking for?"
                             value={search}
                             onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg">
                            Search
                        </button>
                    </motion.form>
                 </div>
            </section>

            {/* Gigs Grid */}
            <div>
                 <div className="flex justify-between items-end mb-8 px-2">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Recent Opportunities</h2>
                    {/* <Link to="/gigs" className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                        View all <ArrowRight className="w-5 h-5" />
                    </Link> */}
                 </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader />
                    </div>
                ) : isError ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                    >
                        <div className="bg-red-50 text-red-700 p-6 rounded-2xl mb-4 max-w-md">
                            <p className="font-bold text-lg mb-1">Error loading gigs</p>
                            <p className="text-sm opacity-80">{message}</p>
                        </div>
                        <button 
                            onClick={() => dispatch(getGigs(search))}
                            className="text-primary hover:text-indigo-700 font-bold underline decoration-2 underline-offset-4"
                        >
                            Try Again
                        </button>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {gigs.length > 0 ? (
                            gigs.map((gig) => (
                                <motion.div variants={item} key={gig._id}>
                                    <Link to={`/gigs/${gig._id}`} className="block h-full group">
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100">
                                            <div className="flex justify-between items-start mb-4">
                                                 <div className="p-2 bg-indigo-50 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <Briefcase className="w-6 h-6" />
                                                 </div>
                                                 <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                                                     gig.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                 }`}>
                                                    {gig.status}
                                                 </span>
                                            </div>
                                            
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                {gig.title}
                                            </h3>
                                            
                                            <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                                                {gig.description}
                                            </p>
                                            
                                            <div className="pt-4 border-t border-gray-50 flex justify-between items-center mt-auto">
                                                <div className="flex items-center text-gray-900 font-bold text-lg">
                                                    <DollarSign className="h-5 w-5 text-primary mr-0.5" />
                                                    {gig.budget}
                                                </div>
                                                 <div className="flex items-center text-xs text-gray-400 font-medium">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {new Date(gig.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                <p className="text-lg font-medium">No gigs found matching your search.</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
