import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getGigById } from '../redux/slices/gigSlice';
import { getBidsByGigId, createBid, hireFreelancer, reset as resetBids } from '../redux/slices/bidSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { DollarSign, User, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const GigDetailsPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { currentGig, isLoading: gigLoading, isError: gigError, message: gigMessage } = useSelector((state) => state.gigs);
    const { user } = useSelector((state) => state.auth);
    const { bids, isLoading: bidsLoading, isSuccess: bidSuccess, message: bidMessage } = useSelector((state) => state.bids);

    const [bidForm, setBidForm] = useState({
        message: '',
        price: ''
    });

    useEffect(() => {
        dispatch(getGigById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (currentGig && user && currentGig.ownerId._id === user._id) {
            dispatch(getBidsByGigId(id));
        }
    }, [dispatch, currentGig, user, id]);
    
    // Handle bid success
    useEffect(() => {
        if (bidSuccess && bidMessage) {
            toast.success(bidMessage);
            dispatch(resetBids());
            // Refresh gig to see status update if hired
             dispatch(getGigById(id));
             // Refresh bids
             if (currentGig && user && currentGig.ownerId._id === user._id) {
                dispatch(getBidsByGigId(id));
            }
        }
    }, [bidSuccess, bidMessage, dispatch, id, currentGig, user]);


    const handleBidSubmit = (e) => {
        e.preventDefault();
        dispatch(createBid({
            gigId: id,
            ...bidForm
        }));
        setBidForm({ message: '', price: '' });
    };

    const handleHire = (bidId) => {
        if (window.confirm('Are you sure you want to hire this freelancer? This will reject all other bids.')) {
            dispatch(hireFreelancer({ bidId }));
        }
    };

    if (gigLoading) return <Loader />;
    if (gigError) return <div className="text-red-500">{gigMessage}</div>;
    if (!currentGig) return <div>Gig not found</div>;

    const isOwner = user && user._id === currentGig.ownerId._id;
    const isAssigned = currentGig.status === 'assigned';

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl font-bold text-gray-900">{currentGig.title}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentGig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {currentGig.status}
                        </span>
                    </div>
                    <div className="mt-4 flex items-center space-x-4 text-gray-500 text-sm">
                        <span className="flex items-center"><User className="h-4 w-4 mr-1"/> {currentGig.ownerId.name}</span>
                        <span className="flex items-center"><Calendar className="h-4 w-4 mr-1"/> {new Date(currentGig.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center text-green-600 font-bold"><DollarSign className="h-4 w-4 mr-1"/> {currentGig.budget}</span>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900">Description</h3>
                        <p className="mt-2 text-gray-600 whitespace-pre-line">{currentGig.description}</p>
                    </div>
                </div>

                {/* Bids Section (For Owner) */}
                {isOwner && (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Proposals ({bids.length})</h3>
                        {bidsLoading ? <Loader /> : (
                            <div className="space-y-4">
                                {bids.length === 0 ? <p className="text-gray-500">No bids yet.</p> : (
                                    bids.map(bid => (
                                        <div key={bid._id} className="border rounded-lg p-4 flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-medium text-gray-900">{bid.freelancerId.name}</span>
                                                    <span className="text-gray-400 text-sm">• {new Date(bid.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="mt-2 text-gray-600">{bid.message}</p>
                                                <div className="mt-2 font-bold text-gray-900">${bid.price}</div>
                                            </div>
                                            <div className="flex flex-col items-end space-y-2">
                                                {bid.status === 'pending' && !isAssigned && (
                                                    <button 
                                                        onClick={() => handleHire(bid._id)}
                                                        className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
                                                    >
                                                        Hire
                                                    </button>
                                                )}
                                                {bid.status === 'hired' && (
                                                     <span className="flex items-center text-green-600 font-medium"><CheckCircle className="h-5 w-5 mr-1"/> Hired</span>
                                                )}
                                                {bid.status === 'rejected' && (
                                                     <span className="flex items-center text-red-500 font-medium"><XCircle className="h-5 w-5 mr-1"/> Rejected</span>
                                                )}
                                                {isAssigned && bid.status === 'pending' && (
                                                     <span className="flex items-center text-gray-400 font-medium">Not Selected</span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Sidebar (For Freelancer Bid Form) */}
            <div className="md:col-span-1">
                {!isOwner && user && !isAssigned && (
                    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Place a Bid</h3>
                        <form onSubmit={handleBidSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Your Price ($)</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        required
                                        className="focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-2 border"
                                        placeholder="0.00"
                                        value={bidForm.price}
                                        onChange={(e) => setBidForm({...bidForm, price: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
                                <textarea
                                    className="shadow-sm focus:ring-primary focus:border-primary mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                                    rows={4}
                                    placeholder="Why are you the best fit?"
                                    required
                                    value={bidForm.message}
                                    onChange={(e) => setBidForm({...bidForm, message: e.target.value})}
                                />
                            </div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                Submit Proposal
                            </button>
                        </form>
                    </div>
                )}
                 {!user && (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <p className="text-gray-500 mb-4">Please login to bid on this gig.</p>
                         <Link to="/login" className="block w-full text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200">Login</Link>
                    </div>
                 )}
                 {isAssigned && !isOwner &&(
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                          <div className="flex flex-col items-center text-center">
                              <CheckCircle className="h-12 w-12 text-green-500 mb-2"/>
                              <h3 className="text-lg font-bold text-gray-900">Gig Assigned</h3>
                              <p className="text-gray-500">This project has already been awarded to a freelancer.</p>
                          </div>
                      </div>
                 )}
            </div>
        </div>
    );
};

export default GigDetailsPage;
